from pathlib import Path
from sqlalchemy.orm import Session

from app.models.invoice_model import Invoice
from app.schemas.invoice_schema import InvoiceCreate
from app.services.ocr_service import extract_invoice_fields
from app.services.ai_service import score_invoice

UPLOAD_DIR = Path("uploads/invoices")


def save_invoice_file(file) -> str:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return str(file_path)


def create_invoice(
    db: Session,
    file,
    payload: InvoiceCreate,
):
    file_path = save_invoice_file(file)

    # OCR extraction
    ocr_data = extract_invoice_fields(file_path)

    # Verification - compare user input with OCR extracted data
    verification = {
        "invoice_number_match": False,
        "vendor_match": False,
        "amount_match": False,
        "ocr_details": ocr_data,
        "discrepancies": []
    }

    # Check invoice number match
    if ocr_data["invoice_number"] and payload.invoice_number:
        ocr_inv = ocr_data["invoice_number"].lower().replace(" ", "").replace("-", "")
        user_inv = payload.invoice_number.lower().replace(" ", "").replace("-", "")
        verification["invoice_number_match"] = (ocr_inv == user_inv)
        if not verification["invoice_number_match"]:
            verification["discrepancies"].append({
                "field": "invoice_number",
                "user_input": payload.invoice_number,
                "ocr_extracted": ocr_data["invoice_number"]
            })

    # Check vendor name match (fuzzy matching - at least 70% similar)
    if ocr_data["vendor_name"] and payload.vendor_name:
        ocr_vendor = ocr_data["vendor_name"].lower().strip()
        user_vendor = payload.vendor_name.lower().strip()
        # Simple similarity check
        if ocr_vendor in user_vendor or user_vendor in ocr_vendor:
            verification["vendor_match"] = True
        elif ocr_vendor == user_vendor:
            verification["vendor_match"] = True
        else:
            verification["discrepancies"].append({
                "field": "vendor_name",
                "user_input": payload.vendor_name,
                "ocr_extracted": ocr_data["vendor_name"]
            })

    # Check amount match (allow 1% tolerance for OCR errors)
    if ocr_data["amount"] > 0 and payload.amount > 0:
        amount_diff = abs(payload.amount - ocr_data["amount"])
        tolerance = payload.amount * 0.01  # 1% tolerance
        verification["amount_match"] = (amount_diff <= tolerance)
        if not verification["amount_match"]:
            verification["discrepancies"].append({
                "field": "amount",
                "user_input": payload.amount,
                "ocr_extracted": ocr_data["amount"]
            })

    # Calculate overall verification status
    verification["verified"] = (
        verification["invoice_number_match"] and
        verification["vendor_match"] and
        verification["amount_match"]
    )

    # AI Risk Scoring - increase risk if verification failed
    base_risk_score, risk_level = score_invoice(
        amount=payload.amount,
        project_id=payload.project_id,
        vendor_name=payload.vendor_name,
    )

    # Adjust risk score based on verification
    if not verification["verified"]:
        # Add 20 points for verification failure
        adjusted_risk_score = min(base_risk_score + 20, 100)
        if adjusted_risk_score >= 80:
            risk_level = "high"
        elif adjusted_risk_score >= 50:
            risk_level = "medium"
    else:
        adjusted_risk_score = base_risk_score

    invoice = Invoice(
        project_id=payload.project_id,
        invoice_number=payload.invoice_number,
        vendor_name=payload.vendor_name,
        amount=payload.amount,
        risk_score=adjusted_risk_score,
        risk_level=risk_level,
        file_path=file_path,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return {
        "invoice": invoice,
        "verification": verification,
        "ai_risk": {
            "score": adjusted_risk_score,
            "level": risk_level,
            "base_score": base_risk_score
        }
    }


def list_invoices(db: Session):
    return db.query(Invoice).all()


def list_high_risk_invoices(db: Session, threshold: int = 70):
    return db.query(Invoice).filter(Invoice.risk_score >= threshold).all()

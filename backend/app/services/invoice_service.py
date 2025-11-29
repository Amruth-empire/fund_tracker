from pathlib import Path
from sqlalchemy.orm import Session
import os
import re
from uuid import uuid4

from app.models.invoice_model import Invoice
from app.schemas.invoice_schema import InvoiceCreate
from app.ocr.invoice_ocr import process_invoice_ocr
from app.services.ai_service import score_invoice

UPLOAD_DIR = Path("uploads/invoices")


def save_invoice_file(file) -> str:
    """Save uploaded file with unique filename"""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"{uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return str(file_path)


def verify_invoice(filepath: str, user_data):
    """Verify invoice by comparing user input with OCR extracted data"""
    
    # Process OCR
    ocr_output = process_invoice_ocr(filepath)
    
    fields = ocr_output["ocr_fields"]
    table = ocr_output["ocr_table"]
    
    # Match user input with OCR data
    verification = {
        "invoice_number_match": False,
        "vendor_match": False,
        "amount_match": False
    }
    
    # Invoice number comparison - flexible matching
    if fields["invoice_number_ocr"] and user_data.invoice_number:
        # Clean both values - remove all non-alphanumeric except digits
        ocr_inv = re.sub(r'[^\d]', '', fields["invoice_number_ocr"])
        user_inv = re.sub(r'[^\d]', '', str(user_data.invoice_number))
        # Match if numbers are equal or one contains the other
        verification["invoice_number_match"] = (
            ocr_inv == user_inv or 
            (len(ocr_inv) > 0 and ocr_inv in user_inv) or 
            (len(user_inv) > 0 and user_inv in ocr_inv)
        )
    
    # Vendor name comparison - fuzzy matching
    if fields["vendor_name_ocr"] and user_data.vendor_name:
        ocr_vendor = fields["vendor_name_ocr"].lower().strip()
        user_vendor = user_data.vendor_name.lower().strip()
        # Match if one contains the other or they're equal
        verification["vendor_match"] = (
            ocr_vendor == user_vendor or 
            ocr_vendor in user_vendor or 
            user_vendor in ocr_vendor or
            all(word in ocr_vendor for word in user_vendor.split() if len(word) > 2)
        )
    
    # Amount comparison - allow 5% tolerance for OCR errors
    if fields["amount_ocr"] and user_data.amount:
        try:
            ocr_amount = float(fields["amount_ocr"].replace(",", "").replace("$", ""))
            user_amount = float(user_data.amount)
            tolerance = user_amount * 0.05  # 5% tolerance
            verification["amount_match"] = (abs(ocr_amount - user_amount) <= tolerance)
        except:
            verification["amount_match"] = False
    
    # Calculate fraud score based on mismatches
    fraud_score = 0
    if not verification["invoice_number_match"]:
        fraud_score += 40
    if not verification["vendor_match"]:
        fraud_score += 30
    if not verification["amount_match"]:
        fraud_score += 30
    
    return {
        "ocr_fields": fields,
        "ocr_table": table,
        "verification": verification,
        "fraud_score": fraud_score
    }


def create_invoice(
    db: Session,
    file,
    payload: InvoiceCreate,
    user_role: str = "contractor",
    user_id: int = None
):
    """Create invoice with OCR verification and fraud detection"""
    file_path = save_invoice_file(file)

    # Verify invoice using OCR
    verification_result = verify_invoice(file_path, payload)

    # Calculate fraud score (0-100) based on verification mismatches
    fraud_score = verification_result["fraud_score"]
    
    # If all verifications pass, use fraud_score as the base (which will be 0)
    # Otherwise, add AI risk scoring for additional analysis
    if fraud_score == 0:
        # All fields match perfectly - minimal risk
        adjusted_risk_score = 0
    else:
        # Some mismatches detected - combine fraud score with AI analysis
        base_risk_score, _ = score_invoice(
            amount=payload.amount,
            project_id=payload.project_id,
            vendor_name=payload.vendor_name,
        )
        adjusted_risk_score = min(base_risk_score + fraud_score, 100)
    
    if adjusted_risk_score >= 80:
        risk_level = "high"
        status = "flagged"  # Auto-flag high risk invoices
    elif adjusted_risk_score >= 50:
        risk_level = "medium"
        status = "pending"
    else:
        risk_level = "low"
        status = "pending"

    invoice = Invoice(
        project_id=payload.project_id,
        invoice_number=payload.invoice_number,
        vendor_name=payload.vendor_name,
        amount=payload.amount,
        risk_score=adjusted_risk_score,
        risk_level=risk_level,
        file_path=file_path,
        uploaded_by=user_role,
        status=status,
        submitted_by_user_id=user_id if user_role == "contractor" else None,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return {
        "invoice": invoice,
        "ocr_fields": verification_result["ocr_fields"],
        "ocr_table": verification_result["ocr_table"],
        "verification": verification_result["verification"],
        "ai_risk": {
            "score": adjusted_risk_score,
            "level": risk_level,
            "fraud_score": verification_result["fraud_score"]
        },
        "status": status,
        "message": f"Invoice submitted successfully. Status: {status.upper()}"
    }


def verify_invoice_by_admin(
    db: Session,
    invoice_id: int,
    action: str,
    admin_id: int,
    notes: str = None
):
    """Admin verifies/approves/rejects invoice"""
    from datetime import datetime
    
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return {"error": "Invoice not found"}
    
    invoice.status = action  # "approved", "rejected", "flagged"
    invoice.verified_by_user_id = admin_id
    invoice.verified_at = datetime.utcnow()
    invoice.admin_notes = notes
    
    db.commit()
    db.refresh(invoice)
    
    return {
        "invoice": invoice,
        "message": f"Invoice {action} successfully"
    }


def list_invoices(db: Session):
    return db.query(Invoice).all()


def list_high_risk_invoices(db: Session, threshold: int = 70):
    return db.query(Invoice).filter(Invoice.risk_score >= threshold).all()

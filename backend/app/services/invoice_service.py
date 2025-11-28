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
) -> Invoice:
    file_path = save_invoice_file(file)

    # OCR extraction (you can combine OCR + payload later)
    ocr_data = extract_invoice_fields(file_path)

    # Basic data priority: payload -> OCR fallback
    invoice_number = payload.invoice_number or ocr_data.get("invoice_number", "")
    vendor_name = payload.vendor_name or ocr_data.get("vendor_name", "")
    amount = payload.amount or ocr_data.get("amount", 0.0)

    risk_score, risk_level = score_invoice(
        amount=amount,
        project_id=payload.project_id,
        vendor_name=vendor_name,
    )

    invoice = Invoice(
        project_id=payload.project_id,
        invoice_number=invoice_number,
        vendor_name=vendor_name,
        amount=amount,
        risk_score=risk_score,
        risk_level=risk_level,
        file_path=file_path,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


def list_invoices(db: Session):
    return db.query(Invoice).all()


def list_high_risk_invoices(db: Session, threshold: int = 70):
    return db.query(Invoice).filter(Invoice.risk_score >= threshold).all()

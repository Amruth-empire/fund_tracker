from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.config.database import get_db
from app.services.invoice_service import list_high_risk_invoices
from app.services.fraud_service import get_fraud_summary
from app.schemas.invoice_schema import InvoiceOut
from app.utils.helpers import require_admin
from app.models.invoice_model import Invoice

router = APIRouter()


class FlagInvoiceRequest(BaseModel):
    invoice_id: int
    reason: Optional[str] = "Flagged for manual review"


@router.get("/summary")
def fraud_summary(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return get_fraud_summary(db)


@router.get("/high-risk", response_model=List[InvoiceOut])
def high_risk_invoices(
    db: Session = Depends(get_db), 
    admin=Depends(require_admin),
    min_risk: int = 70
):
    """Get high-risk invoices with optional risk threshold filter"""
    return db.query(Invoice).filter(Invoice.risk_score >= min_risk).all()


@router.get("/filter", response_model=List[InvoiceOut])
def filter_invoices(
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
    category: Optional[str] = None,
    risk_level: Optional[str] = None
):
    """Filter invoices by fraud category or risk level
    
    Categories:
    - duplicate: Duplicate invoices (risk >= 80)
    - overbilling: Amount mismatch > 30% (risk >= 70)
    - amount_mismatch: Amount mismatch 5-30% (risk >= 50)
    - vendor_mismatch: Vendor name doesn't match
    - invoice_mismatch: Invoice number doesn't match
    """
    query = db.query(Invoice)
    
    if risk_level:
        query = query.filter(Invoice.risk_level == risk_level)
    
    if category:
        # Filter by fraud_category field for accurate categorization
        if category == "duplicate":
            query = query.filter(Invoice.fraud_category == "duplicate")
        elif category == "overbilling":
            query = query.filter(Invoice.fraud_category == "overbilling")
        elif category == "amount":
            query = query.filter(Invoice.fraud_category == "amount_mismatch")
        elif category == "vendor":
            query = query.filter(Invoice.fraud_category == "vendor_mismatch")
        elif category == "invoice":
            query = query.filter(Invoice.fraud_category == "invoice_mismatch")
        elif category == "all":
            # Return all suspicious invoices (risk >= 50)
            query = query.filter(Invoice.risk_score >= 50)
    
    return query.order_by(Invoice.risk_score.desc()).all()


@router.post("/flag/{invoice_id}")
def flag_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """Flag an invoice for manual review"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Update risk level to high if not already
    if invoice.risk_score < 80:
        invoice.risk_score = 90
        invoice.risk_level = "high"
    
    db.commit()
    db.refresh(invoice)
    
    return {
        "message": "Invoice flagged successfully",
        "invoice_id": invoice_id,
        "risk_score": invoice.risk_score
    }


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice_details(
    invoice_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """Get detailed information about a specific invoice"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return invoice

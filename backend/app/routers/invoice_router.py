from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.invoice_schema import InvoiceCreate, InvoiceOut, InvoiceVerify
from app.services.invoice_service import create_invoice, list_invoices, verify_invoice_by_admin
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/")
async def upload_invoice(
    project_id: int = Form(...),
    invoice_number: str = Form(...),
    vendor_name: str = Form(...),
    amount: float = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Upload invoice with OCR verification.
    Contractors use this to SUBMIT invoices (status: pending)
    Admins use this to VERIFY/CROSS-CHECK invoices
    """
    payload = InvoiceCreate(
        project_id=project_id,
        invoice_number=invoice_number,
        vendor_name=vendor_name,
        amount=amount,
    )

    # Determine role from user (User object, not dict)
    user_role = user.role if hasattr(user, 'role') else "contractor"
    user_id = user.id

    result = create_invoice(db, file, payload, user_role=user_role, user_id=user_id)
    return result


@router.post("/verify/{invoice_id}")
async def verify_invoice_action(
    invoice_id: int,
    action_data: InvoiceVerify,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Admin endpoint to approve/reject/flag invoices
    Actions: "approve", "reject", "flag"
    """
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can verify invoices")
    
    result = verify_invoice_by_admin(
        db=db,
        invoice_id=invoice_id,
        action=action_data.action,
        admin_id=user.id,
        notes=action_data.notes
    )
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return result


@router.get("/", response_model=List[InvoiceOut])
def get_invoices(
    db: Session = Depends(get_db), 
    user=Depends(get_current_user),
    status: str = None
):
    """Get invoices, optionally filtered by status"""
    invoices = list_invoices(db)
    
    if status:
        invoices = [inv for inv in invoices if inv.status == status]
    
    return invoices


@router.get("/pending", response_model=List[InvoiceOut])
def get_pending_invoices(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Get all pending invoices for admin review"""
    from app.models.invoice_model import Invoice
    return db.query(Invoice).filter(Invoice.status == "pending").all()

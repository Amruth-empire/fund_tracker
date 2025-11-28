from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.invoice_schema import InvoiceCreate, InvoiceOut
from app.services.invoice_service import create_invoice, list_invoices
from app.utils.helpers import get_current_user

router = APIRouter()


@router.post("/", response_model=InvoiceOut)
async def upload_invoice(
    project_id: int,
    invoice_number: str,
    vendor_name: str,
    amount: float,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    payload = InvoiceCreate(
        project_id=project_id,
        invoice_number=invoice_number,
        vendor_name=vendor_name,
        amount=amount,
    )

    invoice = create_invoice(db, file, payload)
    return invoice


@router.get("/", response_model=List[InvoiceOut])
def get_invoices(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return list_invoices(db)

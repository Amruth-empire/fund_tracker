from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.services.invoice_service import list_high_risk_invoices
from app.services.fraud_service import get_fraud_summary
from app.schemas.invoice_schema import InvoiceOut
from app.utils.helpers import require_admin

router = APIRouter()


@router.get("/summary")
def fraud_summary(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return get_fraud_summary(db)


@router.get("/high-risk", response_model=List[InvoiceOut])
def high_risk_invoices(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return list_high_risk_invoices(db)

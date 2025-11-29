from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InvoiceCreate(BaseModel):
    project_id: int
    invoice_number: str
    vendor_name: str
    amount: float


class InvoiceOut(BaseModel):
    id: int
    project_id: int
    invoice_number: str
    vendor_name: str
    amount: float
    risk_score: int
    risk_level: str
    file_path: str
    uploaded_by: Optional[str] = None
    status: str = "pending"
    created_at: datetime
    verified_at: Optional[datetime] = None
    admin_notes: Optional[str] = None

    class Config:
        from_attributes = True


class InvoiceVerify(BaseModel):
    action: str  # "approve", "reject", "flag"
    notes: Optional[str] = None

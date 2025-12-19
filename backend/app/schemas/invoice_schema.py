from pydantic import BaseModel, field_validator
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
    fraud_category: Optional[str] = None
    amount_mismatch_percentage: Optional[float] = None
    file_path: str
    uploaded_by: Optional[str] = None
    status: str = "pending"
    created_at: datetime
    verified_at: Optional[datetime] = None
    admin_notes: Optional[str] = None

    @field_validator('risk_score', mode='before')
    @classmethod
    def convert_risk_score_to_int(cls, v):
        """Convert risk_score to integer if it's a float"""
        if isinstance(v, float):
            return int(v)
        return v

    class Config:
        from_attributes = True


class InvoiceVerify(BaseModel):
    action: str  # "approve", "reject", "flag"
    notes: Optional[str] = None

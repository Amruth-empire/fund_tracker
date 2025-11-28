from pydantic import BaseModel
from typing import Optional


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

    class Config:
        orm_mode = True

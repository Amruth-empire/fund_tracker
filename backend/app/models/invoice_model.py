from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    invoice_number = Column(String, nullable=False)
    vendor_name = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    risk_score = Column(Integer, default=0)  # 0-100
    risk_level = Column(String, default="low")  # low, medium, high
    file_path = Column(String, nullable=False)
    
    # New fields for contractor-admin workflow
    uploaded_by = Column(String, nullable=True)  # "contractor" or "admin"
    status = Column(String, default="pending")  # pending, approved, rejected, flagged
    submitted_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    admin_notes = Column(String, nullable=True)

    # Optional relationship
    # project = relationship("Project", backref="invoices")

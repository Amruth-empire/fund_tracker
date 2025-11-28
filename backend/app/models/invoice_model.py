from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
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

    # Optional relationship
    # project = relationship("Project", backref="invoices")

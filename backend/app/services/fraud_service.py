from sqlalchemy.orm import Session
from app.models.invoice_model import Invoice


def get_fraud_summary(db: Session):
    total = db.query(Invoice).count()
    high = db.query(Invoice).filter(Invoice.risk_level == "high").count()
    medium = db.query(Invoice).filter(Invoice.risk_level == "medium").count()
    low = db.query(Invoice).filter(Invoice.risk_level == "low").count()

    return {
        "total_invoices": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
    }

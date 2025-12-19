from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth_router, project_router, invoice_router, fraud_router, user_router
from app.config.database import Base, engine, SessionLocal
from app.models.user_model import User
from app.utils.hashing import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Based Panchayat Fund Utilization Tracker API")


@app.on_event("startup")
def seed_default_users():
    """Automatically create default users on startup if they don't exist"""
    db = SessionLocal()
    try:
        # Check and create admin user
        admin_exists = db.query(User).filter(User.email == "admin@panchayat.gov.in").first()
        if not admin_exists:
            admin = User(
                name="District Admin",
                email="admin@panchayat.gov.in",
                password=hash_password("admin@123"),
                role="admin"
            )
            db.add(admin)
            print("✅ Admin user created: admin@panchayat.gov.in")
        
        # Check and create contractor user
        contractor_exists = db.query(User).filter(User.email == "contractor@panchayat.gov.in").first()
        if not contractor_exists:
            contractor = User(
                name="Contractor",
                email="contractor@panchayat.gov.in",
                password=hash_password("contractor@123"),
                role="contractor"
            )
            db.add(contractor)
            print("✅ Contractor user created: contractor@panchayat.gov.in")
        
        db.commit()
    except Exception as e:
        print(f"⚠️ Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

# CORS (open for dev; restrict in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(project_router.router, prefix="/projects", tags=["Projects"])
app.include_router(invoice_router.router, prefix="/invoices", tags=["Invoices"])
app.include_router(fraud_router.router, prefix="/fraud", tags=["Fraud"])
app.include_router(user_router.router, prefix="/users", tags=["Users"])


@app.get("/")
def root():
    return {"message": "Fund Tracker Backend is running 🚀"}

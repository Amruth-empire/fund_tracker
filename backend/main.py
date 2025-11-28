from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth_router, project_router, invoice_router, fraud_router, user_router
from app.config.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Based Panchayat Fund Utilization Tracker API")

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

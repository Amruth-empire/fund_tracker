from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.auth_schema import UserCreate, UserLogin, TokenResponse
from app.config.database import get_db
from app.services.auth_service import register_user, login_user

router = APIRouter(tags=["Authentication"])

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, data)
    return {"message": "User Registered Successfully", "user": user}

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    token = login_user(db, data)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return TokenResponse(access_token=token)

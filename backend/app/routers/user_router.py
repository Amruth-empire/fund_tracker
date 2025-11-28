from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.user_schema import UserBase
from app.utils.helpers import get_current_user, require_admin
from app.models.user_model import User

router = APIRouter()


@router.get("/me", response_model=UserBase)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserBase])
def list_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(User).all()

from sqlalchemy.orm import Session
from app.models.user_model import User
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.schemas.auth_schema import UserCreate, UserLogin


def register_user(db: Session, data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise ValueError("Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, data: UserLogin) -> dict | None:
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return None

    if not verify_password(data.password, user.password):
        return None

    token = create_access_token({"id": user.id, "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "user": user
    }

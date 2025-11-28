from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "admin" or "contractor"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

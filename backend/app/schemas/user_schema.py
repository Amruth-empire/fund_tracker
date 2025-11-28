from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

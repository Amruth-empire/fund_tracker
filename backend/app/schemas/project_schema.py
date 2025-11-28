from pydantic import BaseModel
from typing import Optional


class ProjectCreate(BaseModel):
    name: str
    location: str
    budget: float


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = None
    utilized: Optional[float] = None


class ProjectOut(BaseModel):
    id: int
    name: str
    location: str
    budget: float
    utilized: float
    status: str

    class Config:
        orm_mode = True

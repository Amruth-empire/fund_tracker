from pydantic import BaseModel
from typing import Optional
from datetime import date


class ProjectCreate(BaseModel):
    name: str
    location: str
    budget: float
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = None
    utilized: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectOut(BaseModel):
    id: int
    name: str
    location: str
    budget: float
    utilized: float
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        from_attributes = True

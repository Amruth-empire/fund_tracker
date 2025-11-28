from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from app.config.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    budget = Column(Numeric, nullable=False)
    utilized = Column(Numeric, default=0)
    status = Column(String, default="ongoing")  # ongoing, completed, delayed

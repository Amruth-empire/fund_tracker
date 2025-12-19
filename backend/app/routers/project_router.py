from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.project_schema import ProjectCreate, ProjectUpdate, ProjectOut
from app.services.project_service import create_project, list_projects, get_project, update_project
from app.utils.dependencies import require_admin

router = APIRouter()


@router.post("/", response_model=ProjectOut)
def create(data: ProjectCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    project = create_project(db, data)
    return project


@router.get("/", response_model=List[ProjectOut])
def get_all(db: Session = Depends(get_db)):
    return list_projects(db)


@router.get("/{project_id}", response_model=ProjectOut)
def get_one(project_id: int, db: Session = Depends(get_db)):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    project = update_project(db, project_id, data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}")
def delete(project_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

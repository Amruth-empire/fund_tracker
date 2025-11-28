from sqlalchemy.orm import Session
from app.models.project_model import Project
from app.schemas.project_schema import ProjectCreate, ProjectUpdate


def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(
        name=data.name,
        location=data.location,
        budget=data.budget,
        utilized=0,
        status="ongoing",
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session) -> list[Project]:
    return db.query(Project).all()


def get_project(db: Session, project_id: int) -> Project | None:
    return db.query(Project).filter(Project.id == project_id).first()


def update_project(db: Session, project_id: int, data: ProjectUpdate) -> Project | None:
    project = get_project(db, project_id)
    if not project:
        return None

    for field, value in data.dict(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project

from fastapi import APIRouter, HTTPException

from app.models.project import Project
from app.database import crud


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.get("/")
def get_projects():
    return crud.get_all_projects()


@router.get("/{project_id}")
def get_project(project_id: int):
    project = crud.get_project_by_id(project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    return project


@router.post("/")
def create_project(project: Project):
    project_data = {
        "name": project.name,
        "description": project.description,
        "location": project.location,
        "budget": project.budget,
        "status": project.status,
        "completion_percentage": project.completion_percentage
    }

    return {
        "message": "Project created successfully",
        "project": crud.create_project(project_data)
    }


@router.put("/{project_id}")
def update_project(project_id: int, project: Project):
    if not crud.get_project_by_id(project_id):
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    project_data = {
        "name": project.name,
        "description": project.description,
        "location": project.location,
        "budget": project.budget,
        "status": project.status,
        "completion_percentage": project.completion_percentage
    }

    return {
        "message": "Project updated successfully",
        "project": crud.update_project(
            project_id,
            project_data
        )
    }


@router.delete("/{project_id}")
def delete_project(project_id: int):
    if not crud.get_project_by_id(project_id):
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    crud.delete_project(project_id)

    return {
        "message": "Project deleted successfully"
    }

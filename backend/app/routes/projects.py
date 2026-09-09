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
        "latitude": project.latitude,
        "longitude": project.longitude,
        "budget": project.budget,
        "status": project.status,
        "completion_percentage": project.completion_percentage
    }

    created_project = crud.create_project(project_data)

    project_id = None

    if created_project:
        if isinstance(created_project, list):
            project_id = created_project[0].get("id")
        elif isinstance(created_project, dict):
            project_id = created_project.get("id")

    # Notification for new project
    if project_id:
        crud.create_notification({
            "project_id": project_id,
            "title": "New Project Created",
            "message": (
                f"Project '{project.name}' has been added "
                "to MPLAD-Guard."
            ),
            "notification_type": "Project",
            "priority": "Normal",
            "is_read": False
        })

    return {
        "message": "Project created successfully",
        "project": created_project
    }


@router.put("/{project_id}")
def update_project(project_id: int, project: Project):
    existing_project = crud.get_project_by_id(project_id)

    if not existing_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    project_data = {
        "name": project.name,
        "description": project.description,
        "location": project.location,
        "latitude": project.latitude,
        "longitude": project.longitude,
        "budget": project.budget,
        "status": project.status,
        "completion_percentage": project.completion_percentage
    }

    updated_project = crud.update_project(
        project_id,
        project_data
    )

    # Notification for project update
    crud.create_notification({
        "project_id": project_id,
        "title": "Project Updated",
        "message": (
            f"Project '{project.name}' has been updated. "
            f"Current completion is "
            f"{project.completion_percentage}%."
        ),
        "notification_type": "Project Update",
        "priority": "Normal",
        "is_read": False
    })

    # Extra notification when project status changes
    old_status = existing_project.get("status")
    new_status = project.status

    if old_status != new_status:
        crud.create_notification({
            "project_id": project_id,
            "title": "Project Status Changed",
            "message": (
                f"Project '{project.name}' status changed "
                f"from '{old_status}' to '{new_status}'."
            ),
            "notification_type": "Status",
            "priority": "High",
            "is_read": False
        })

    # Notification when project reaches 100%
    if (
        project.completion_percentage >= 100
        and existing_project.get("completion_percentage", 0) < 100
    ):
        crud.create_notification({
            "project_id": project_id,
            "title": "Project Completed",
            "message": (
                f"Project '{project.name}' has reached "
                "100% completion."
            ),
            "notification_type": "Completion",
            "priority": "High",
            "is_read": False
        })

    return {
        "message": "Project updated successfully",
        "project": updated_project
    }


@router.delete("/{project_id}")
def delete_project(project_id: int):
    existing_project = crud.get_project_by_id(project_id)

    if not existing_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    project_name = existing_project.get(
        "name",
        f"Project {project_id}"
    )

    crud.delete_project(project_id)

    return {
        "message": "Project deleted successfully"
    }
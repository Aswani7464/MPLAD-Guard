from fastapi import APIRouter, HTTPException

from app.models.risk import Risk
from app.database.connection import get_supabase_client
from app.database import crud


router = APIRouter(
    prefix="/risk",
    tags=["Risk Analysis"]
)


@router.get("/{project_id}")
def get_project_risk(project_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("risks")
        .select("*")
        .eq("project_id", project_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Risk information not found."
        )

    return response.data


@router.post("/")
def create_risk(risk: Risk):
    supabase = get_supabase_client()

    # Save risk analysis
    response = (
        supabase
        .table("risks")
        .insert({
            "project_id": risk.project_id,
            "risk_score": risk.risk_score,
            "risk_level": risk.risk_level,
            "financial_risk": risk.financial_risk,
            "delay_risk": risk.delay_risk,
            "anomaly_score": risk.anomaly_score,
            "description": risk.description
        })
        .execute()
    )

    # Get project information
    project = crud.get_project_by_id(risk.project_id)

    project_name = (
        project.get("name", f"Project {risk.project_id}")
        if project
        else f"Project {risk.project_id}"
    )

    # Determine notification priority
    risk_level = str(risk.risk_level or "").strip().lower()

    if risk_level == "high":
        priority = "High"
        title = "High Risk Project Alert"
        message = (
            f"Project '{project_name}' has been identified "
            f"as a high-risk project with a risk score of "
            f"{risk.risk_score}. Immediate attention is recommended."
        )

    elif risk_level == "medium":
        priority = "Medium"
        title = "Medium Risk Project Alert"
        message = (
            f"Project '{project_name}' has a medium risk level "
            f"with a risk score of {risk.risk_score}. "
            f"Please monitor the project closely."
        )

    else:
        priority = "Normal"
        title = "Risk Analysis Updated"
        message = (
            f"Risk analysis for project '{project_name}' "
            f"has been updated. Current risk level: "
            f"{risk.risk_level}."
        )

    # Create project risk notification
    crud.create_notification({
        "project_id": risk.project_id,
        "title": title,
        "message": message,
        "notification_type": "Risk",
        "priority": priority,
        "is_read": False
    })

    return {
        "message": "Risk analysis saved successfully",
        "risk": response.data
    }
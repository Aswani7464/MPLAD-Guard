from fastapi import APIRouter
from app.database.connection import get_supabase_client

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary():
    supabase = get_supabase_client()

    projects = (
        supabase
        .table("projects")
        .select("*")
        .execute()
    )

    risks = (
        supabase
        .table("risks")
        .select("*")
        .execute()
    )

    project_data = projects.data or []
    risk_data = risks.data or []

    total_projects = len(project_data)

    high_risk_projects = len([
        risk for risk in risk_data
        if risk.get("risk_level") == "high"
    ])

    medium_risk_projects = len([
        risk for risk in risk_data
        if risk.get("risk_level") == "medium"
    ])

    low_risk_projects = len([
        risk for risk in risk_data
        if risk.get("risk_level") == "low"
    ])

    return {
        "total_projects": total_projects,
        "high_risk_projects": high_risk_projects,
        "medium_risk_projects": medium_risk_projects,
        "low_risk_projects": low_risk_projects
    }

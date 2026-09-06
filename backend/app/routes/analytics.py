from fastapi import APIRouter

from app.database.connection import get_supabase_client


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/projects")
def project_analytics():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("projects")
        .select("*")
        .execute()
    )

    projects = response.data or []

    total_budget = sum(
        float(project.get("budget", 0))
        for project in projects
    )

    average_completion = (
        sum(
            float(project.get("completion_percentage", 0))
            for project in projects
        ) / len(projects)
        if projects else 0
    )

    return {
        "total_projects": len(projects),
        "total_budget": total_budget,
        "average_completion_percentage": round(
            average_completion,
            2
        )
    }


@router.get("/risks")
def risk_analytics():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("risks")
        .select("*")
        .execute()
    )

    risks = response.data or []

    return {
        "total_risk_records": len(risks),
        "high_risk": len([
            r for r in risks
            if r.get("risk_level") == "high"
        ]),
        "medium_risk": len([
            r for r in risks
            if r.get("risk_level") == "medium"
        ]),
        "low_risk": len([
            r for r in risks
            if r.get("risk_level") == "low"
        ])
    }

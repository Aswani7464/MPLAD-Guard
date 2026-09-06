from fastapi import APIRouter, HTTPException

from app.models.risk import Risk
from app.database.connection import get_supabase_client


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

    return {
        "message": "Risk analysis saved successfully",
        "risk": response.data
    }

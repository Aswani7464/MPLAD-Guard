from fastapi import APIRouter

from app.models.report import Report
from app.database.connection import get_supabase_client


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/{project_id}")
def get_project_reports(project_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("reports")
        .select("*")
        .eq("project_id", project_id)
        .execute()
    )

    return response.data


@router.post("/")
def create_report(report: Report):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("reports")
        .insert({
            "project_id": report.project_id,
            "title": report.title,
            "report_type": report.report_type,
            "file_url": report.file_url,
            "generated_at": report.generated_at
        })
        .execute()
    )

    return {
        "message": "Report created successfully",
        "report": response.data
    }

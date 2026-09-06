from fastapi import APIRouter, HTTPException

from app.models.verification import Verification
from app.database.connection import get_supabase_client


router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


@router.get("/{project_id}")
def get_verifications(project_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("verification")
        .select("*")
        .eq("project_id", project_id)
        .execute()
    )

    return response.data


@router.post("/")
def create_verification(verification: Verification):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("verification")
        .insert({
            "project_id": verification.project_id,
            "document_name": verification.document_name,
            "verification_status": verification.verification_status,
            "verified": verification.verified,
            "remarks": verification.remarks
        })
        .execute()
    )

    return {
        "message": "Verification record created successfully",
        "verification": response.data
    }


@router.put("/{verification_id}")
def update_verification(
    verification_id: int,
    verification: Verification
):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("verification")
        .update({
            "verification_status": verification.verification_status,
            "verified": verification.verified,
            "remarks": verification.remarks
        })
        .eq("id", verification_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Verification record not found."
        )

    return {
        "message": "Verification updated successfully",
        "verification": response.data
    }

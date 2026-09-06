from fastapi import APIRouter
from app.database.connection import get_supabase_client

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications():
    supabase = get_supabase_client()

    response = (
        supabase
        .table("notifications")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


@router.get("/user/{user_id}")
def get_user_notifications(user_id: int):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

from fastapi import APIRouter, HTTPException

from app.models.user import User
from app.database.connection import get_supabase_client


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(user: User):
    supabase = get_supabase_client()

    existing_user = (
        supabase
        .table("users")
        .select("*")
        .eq("email", str(user.email))
        .execute()
    )

    if existing_user.data:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )

    response = (
        supabase
        .table("users")
        .insert({
            "name": user.name,
            "email": str(user.email),
            "role": user.role,
            "is_active": user.is_active
        })
        .execute()
    )

    return {
        "message": "User registered successfully",
        "user": response.data
    }


@router.post("/login")
def login_user(email: str):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "Login successful",
        "user": response.data[0]
    }

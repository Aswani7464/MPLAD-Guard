from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.database.connection import get_supabase_client


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    state: str
    constituency: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register_user(user: RegisterRequest):
    supabase = get_supabase_client()

    email = str(user.email).strip().lower()

    # Check whether this email already exists
    existing_user = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if existing_user.data:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )

    # Create the new user
    response = (
        supabase
        .table("users")
        .insert({
            "name": user.name.strip(),
            "email": email,
            "mobile": user.mobile.strip(),
            "state": user.state.strip(),
            "constituency": user.constituency.strip(),
            "password": user.password,
            "role": "MPLAD Head",
            "is_active": True
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Unable to create user account."
        )

    created_user = response.data[0].copy()

    # Never send the password back to the frontend
    created_user.pop("password", None)

    return {
        "message": "User registered successfully",
        "user": created_user
    }


@router.post("/login")
def login_user(user: LoginRequest):
    supabase = get_supabase_client()

    email = str(user.email).strip().lower()

    # Find the account using the email entered by the user
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
            detail="User not found. Please register first."
        )

    db_user = response.data[0]

    # Check password
    if db_user.get("password") != user.password:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password."
        )

    # Check account status
    if db_user.get("is_active") is False:
        raise HTTPException(
            status_code=403,
            detail="This account is inactive."
        )

    logged_in_user = db_user.copy()

    # Never send password to frontend
    logged_in_user.pop("password", None)

    return {
        "message": "Login successful",
        "user": logged_in_user
    }
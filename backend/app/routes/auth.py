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
            "mobile": user.mobile,
            "state": user.state,
            "constituency": user.constituency,
            "password": user.password,
            "role": "MPLAD Head",
            "is_active": True
        })
        .execute()
    )

    return {
        "message": "User registered successfully",
        "user": response.data[0] if response.data else None
    }


@router.post("/login")
def login_user(user: LoginRequest):
    supabase = get_supabase_client()

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("email", str(user.email))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    db_user = response.data[0]

    if db_user.get("password") != user.password:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password."
        )

    if db_user.get("is_active") is False:
        raise HTTPException(
            status_code=403,
            detail="This account is inactive."
        )

    return {
        "message": "Login successful",
        "user": db_user
    }
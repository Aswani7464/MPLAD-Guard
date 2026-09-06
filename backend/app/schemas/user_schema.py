from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"


class UserLogin(BaseModel):
    email: EmailStr

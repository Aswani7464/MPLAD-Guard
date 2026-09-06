from typing import Optional

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2)
    description: Optional[str] = None
    location: Optional[str] = None
    budget: float = Field(default=0.0, ge=0)
    status: str = "active"
    completion_percentage: float = Field(
        default=0.0,
        ge=0,
        le=100
    )


class ProjectResponse(ProjectCreate):
    id: int

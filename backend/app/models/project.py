from pydantic import BaseModel
from typing import Optional


class Project(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    budget: float = 0.0
    status: str = "active"
    completion_percentage: float = 0.0

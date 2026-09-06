from typing import Optional

from pydantic import BaseModel


class Project(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    budget: float = 0.0
    status: str = "active"
    completion_percentage: float = 0.0

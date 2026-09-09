from typing import Optional
from pydantic import BaseModel


class Project(BaseModel):
    id: Optional[int] = None

    name: str
    description: Optional[str] = None

    # Location is obtained from the real GPS/map system
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Amount sanctioned/provided by MPLADS for this particular project
    # No fixed default amount
    budget: float

    status: str = "Proposed"
    completion_percentage: float = 0.0
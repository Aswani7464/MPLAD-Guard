from typing import Optional
from pydantic import BaseModel


class Notification(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    project_id: Optional[int] = None

    title: str
    message: str

    notification_type: str = "Project"
    priority: str = "Normal"

    is_read: bool = False
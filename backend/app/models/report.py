from pydantic import BaseModel
from typing import Optional


class Report(BaseModel):
    id: Optional[int] = None
    project_id: int
    title: str
    report_type: str = "project"
    file_url: Optional[str] = None
    generated_at: Optional[str] = None

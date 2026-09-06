from pydantic import BaseModel
from typing import Optional


class Verification(BaseModel):
    id: Optional[int] = None
    project_id: int
    document_name: str
    verification_status: str = "pending"
    verified: bool = False
    remarks: Optional[str] = None

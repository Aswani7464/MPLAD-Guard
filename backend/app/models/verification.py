from typing import Optional

from pydantic import BaseModel


class Verification(BaseModel):
    id: Optional[int] = None
    project_id: int

    document_name: str

    verification_status: str = "pending"
    verified: bool = False

    remarks: Optional[str] = None

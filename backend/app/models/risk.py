from typing import Optional

from pydantic import BaseModel


class Risk(BaseModel):
    id: Optional[int] = None
    project_id: int

    risk_score: float = 0.0
    risk_level: str = "low"

    financial_risk: float = 0.0
    delay_risk: float = 0.0
    anomaly_score: float = 0.0

    description: Optional[str] = None

from typing import Optional

from pydantic import BaseModel, Field


class RiskCreate(BaseModel):
    project_id: int

    risk_score: float = Field(default=0.0, ge=0, le=100)
    risk_level: str = "low"

    financial_risk: float = Field(default=0.0, ge=0, le=100)
    delay_risk: float = Field(default=0.0, ge=0, le=100)
    anomaly_score: float = Field(default=0.0, ge=0, le=100)

    description: Optional[str] = None

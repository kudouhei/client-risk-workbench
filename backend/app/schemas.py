from typing import Literal
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    database: Literal["connected"]

class ClientRiskReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    legal_name: str
    client_type: str
    country_code: str
    risk_rating: Literal["Low", "Medium", "High"]
    review_status: Literal["Approved", "In Review", "Escalated"]
    next_review_date: date
    created_at: datetime

    
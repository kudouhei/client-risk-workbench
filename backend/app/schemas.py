from typing import Literal
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

RiskRating = Literal["Low", "Medium", "High"]

ReviewStatus = Literal[
    "Approved",
    "In Review",
    "Escalated",
]

class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    database: Literal["connected"]

class ClientRiskReviewCreate(BaseModel):
    legal_name: str = Field(
        min_length=1,
        max_length=200,
    )
    client_type: str = Field(
        min_length=1,
        max_length=50,
    )
    country_code: str = Field(
        min_length=2,
        max_length=2,
        pattern=r"^[A-Z]{2}$",
    )
    risk_rating: RiskRating
    review_status: ReviewStatus
    next_review_date: date

class ClientRiskReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    legal_name: str
    client_type: str
    country_code: str
    risk_rating: RiskRating
    review_status: ReviewStatus
    next_review_date: date
    created_at: datetime

    
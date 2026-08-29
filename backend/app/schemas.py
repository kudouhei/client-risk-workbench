from typing import Literal
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

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

class ClientRiskReviewStatusUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    review_status: ReviewStatus
    change_reason: str | None = Field(
        default=None,
        min_length=5,
        max_length=500,
    )

    @field_validator("change_reason")
    @classmethod
    def normalize_change_reason(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        normalized_value = value.strip()

        if len(normalized_value) < 5:
            raise ValueError(
                "Change reason must contain at least "
                "5 non-whitespace characters."
            )

        return normalized_value
    
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

class ClientRiskReviewStatusEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    client_risk_review_id: int
    previous_status: ReviewStatus
    new_status: ReviewStatus
    changed_by: str
    change_reason: str | None
    changed_at: datetime
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Depends, status, HTTPException
from sqlalchemy import text, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ClientRiskReview
from app.schemas import HealthResponse, ClientRiskReviewResponse, ClientRiskReviewCreate

app = FastAPI(
    title="Client Risk & Compliance Workbench API",
    version="0.1.0",
)

DatabaseSession = Annotated[Session, Depends(get_db)]

@app.get("/api/health", response_model=HealthResponse)
def health(database_session: DatabaseSession) -> HealthResponse:
    database_session.execute(text("SELECT 1"))

    return HealthResponse(
        status="ok",
        service="client-risk-workbench-api",
        database="connected",
    )

@app.get("/api/client-risk-reviews", response_model=list[ClientRiskReviewResponse],)
def list_client_risk_reviews( database_session: DatabaseSession, ) -> list[ClientRiskReview]:
    statement = select(ClientRiskReview).order_by(
        ClientRiskReview.id
    )

    return list(database_session.scalars(statement).all())

@app.post("/api/client-risk-reviews", response_model=ClientRiskReviewResponse, status_code=status.HTTP_201_CREATED)
def create_client_risk_review(review_data: ClientRiskReviewCreate, database_session: DatabaseSession) -> ClientRiskReview:
    review = ClientRiskReview(
        **review_data.model_dump(),
    )
    database_session.add(review)
    database_session.commit()
    database_session.refresh(review)

    return review

@app.get("/api/client-risk-reviews/{review_id}", response_model=ClientRiskReviewResponse)
def get_client_risk_review(review_id: int, database_session: DatabaseSession) -> ClientRiskReview:
    review = database_session.get(ClientRiskReview, review_id)

    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client risk review not found.")

    return review


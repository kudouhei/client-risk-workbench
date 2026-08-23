from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy import text, select
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import ClientRiskReview
from app.schemas import HealthResponse, ClientRiskReviewResponse

@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(
        bind=engine,
        tables=[ClientRiskReview.__table__],
    )

    yield

app = FastAPI(
    title="Client Risk & Compliance Workbench API",
    version="0.1.0",
    lifespan=lifespan,
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
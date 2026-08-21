from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import ClientRiskReview
from app.schemas import HealthResponse

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


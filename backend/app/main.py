from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import HealthResponse


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


from fastapi import FastAPI
from app.schemas import HealthResponse

app = FastAPI(
    title="Client Risk & Compliance Workbench API",
    version="0.1.0",
)

@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="client-risk-workbench-api",
    )


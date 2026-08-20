from fastapi import FastAPI

app = FastAPI(
    title="Client Risk & Compliance Workbench API",
    version="0.1.0",
)

@app.get("/api/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "client-risk-workbench-api",
    }
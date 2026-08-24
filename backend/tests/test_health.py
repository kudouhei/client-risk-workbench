from fastapi.testclient import TestClient


def test_health_reports_database_connection(
    client: TestClient,
) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200

    assert response.json() == {
        "status": "ok",
        "service": "client-risk-workbench-api",
        "database": "connected",
    }
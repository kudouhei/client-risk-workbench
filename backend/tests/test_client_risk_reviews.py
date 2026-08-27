from datetime import date

from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ClientRiskReview

def test_list_client_risk_reviews_returns_database_record(client: TestClient, database_session: Session) -> None:
    review = ClientRiskReview(
        legal_name="Northstar Investment Fund",
        client_type="Fund",
        country_code="LU",
        risk_rating="High",
        review_status="In Review",
        next_review_date=date(2027, 6, 30),
    )

    database_session.add(review)
    database_session.flush()

    response = client.get("/api/client-risk-reviews")

    assert response.status_code == 200
    response_items = response.json()

    returned_review = next(
        item
        for item in response_items
        if item["id"] == review.id
    )

    assert returned_review["legal_name"] == (
        "Northstar Investment Fund"
    )
    assert returned_review["client_type"] == "Fund"
    assert returned_review["country_code"] == "LU"
    assert returned_review["risk_rating"] == "High"
    assert returned_review["review_status"] == "In Review"
    assert returned_review["next_review_date"] == "2027-06-30"
    assert returned_review["created_at"] is not None

def test_create_client_risk_review(client: TestClient, database_session: Session) -> None:
    request_data = {
        "legal_name": "Helios Capital Partners",
        "client_type": "Asset Manager",
        "country_code": "LU",
        "risk_rating": "Medium",
        "review_status": "In Review",
        "next_review_date": "2027-03-31",
    }

    response = client.post("/api/client-risk-reviews", json=request_data)

    assert response.status_code == 201 # Created

    response_data = response.json()

    assert response_data["id"] is not None
    assert response_data["legal_name"] == (
        "Helios Capital Partners"
    )
    assert response_data["client_type"] == "Asset Manager"
    assert response_data["country_code"] == "LU"
    assert response_data["risk_rating"] == "Medium"
    assert response_data["review_status"] == "In Review"
    assert response_data["next_review_date"] == "2027-03-31"
    assert response_data["created_at"] is not None

    created_review = database_session.get(
        ClientRiskReview,
        response_data["id"],
    )

    assert created_review is not None
    assert created_review.legal_name == (
        "Helios Capital Partners"
    )

def test_create_client_risk_review_rejects_invalid_data(
    client: TestClient,
    database_session: Session,
) -> None:
    request_data = {
        "legal_name": "Invalid Compliance Client",
        "client_type": "Fund",
        "country_code": "lu",
        "risk_rating": "Critical",
        "review_status": "In Review",
        "next_review_date": "2027-03-31",
    }

    response = client.post("/api/client-risk-reviews", json=request_data)

    assert response.status_code == 422

    validation_errors = response.json()["detail"]

    invalid_fields = {
        error["loc"][-1]
        for error in validation_errors
    }

    assert "country_code" in invalid_fields
    assert "risk_rating" in invalid_fields

    stored_review = database_session.scalar(
        select(ClientRiskReview).where(
            ClientRiskReview.legal_name== "Invalid Compliance Client"
        )
    )

    assert stored_review is None

def test_get_client_risk_review_returns_record(client: TestClient, database_session: Session) -> None:
    review = ClientRiskReview(
        legal_name="Atlas Private Markets",
        client_type="Asset Manager",
        country_code="LU",
        risk_rating="High",
        review_status="Escalated",
        next_review_date=date(2027, 9, 30),
    )

    database_session.add(review)
    database_session.flush()

    response = client.get(f"/api/client-risk-reviews/{review.id}")

    assert response.status_code == 200
    response_data = response.json()

    assert response_data["id"] == review.id
    assert response_data["legal_name"] == "Atlas Private Markets"
    assert response_data["client_type"] == "Asset Manager"
    assert response_data["country_code"] == "LU"
    assert response_data["risk_rating"] == "High"
    assert response_data["review_status"] == "Escalated"
    assert response_data["next_review_date"] == (
        "2027-09-30"
    )
    assert response_data["created_at"] is not None


def test_get_client_risk_review_returns_404_when_missing(client: TestClient, ) -> None:
    response = client.get(
        "/api/client-risk-reviews/0"
    )

    assert response.status_code == 404

    assert response.json() == {"detail": "Client risk review not found."}


def test_update_client_risk_review_status(client: TestClient, database_session: Session) -> None:
    review = ClientRiskReview(
        legal_name="Meridian Institutional Fund",
        client_type="Fund",
        country_code="LU",
        risk_rating="Medium",
        review_status="In Review",
        next_review_date=date(2027, 12, 31),
    )

    database_session.add(review)
    database_session.flush()

    response = client.patch(
        "/api/client-risk-reviews/"f"{review.id}/status",
        json={"review_status": "Approved"},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data["id"] == review.id
    assert response_data["review_status"] == "Approved"

    database_session.refresh(review)

    assert review.review_status == "Approved"


def test_update_client_risk_review_rejects_invalid_status(
    client: TestClient,
    database_session: Session,
) -> None:
    review = ClientRiskReview(
        legal_name="Oakbridge Pension Services",
        client_type="Pension Fund",
        country_code="NL",
        risk_rating="Low",
        review_status="In Review",
        next_review_date=date(2028, 3, 31),
    )

    database_session.add(review)
    database_session.flush()

    response = client.patch(
        (
            "/api/client-risk-reviews/"
            f"{review.id}/status"
        ),
        json={
            "review_status": "Pending",
        },
    )

    assert response.status_code == 422

    validation_errors = response.json()["detail"]

    invalid_fields = {
        error["loc"][-1]
        for error in validation_errors
    }

    assert "review_status" in invalid_fields

    database_session.refresh(review)

    assert review.review_status == "In Review"
from datetime import date

from fastapi.testclient import TestClient
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
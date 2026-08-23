from datetime import date

from sqlalchemy import func, select

from app.database import SessionLocal
from app.models import ClientRiskReview

def seed_demo_data() -> None:
    with SessionLocal() as database_session:
        existing_count = database_session.scalar(
            select(func.count(ClientRiskReview.id))
        )

        if existing_count > 0:
            print("Demo data already exists. Skipping seeding.")
            return

        print("Seeding demo data...")

        demo_data = [
            ClientRiskReview(
                legal_name="John Doe",
                client_type="Individual",
                country_code="US",
            )
        ]

        database_session.add_all(
            [
                ClientRiskReview(
                    legal_name="Aurora Asset Management S.A.",
                    client_type="Asset Manager",
                    country_code="LU",
                    risk_rating="Medium",
                    review_status="In Review",
                    next_review_date=date(2026, 9, 30),
                ),
                ClientRiskReview(
                    legal_name="Northbridge Private Bank",
                    client_type="Bank",
                    country_code="CH",
                    risk_rating="High",
                    review_status="Escalated",
                    next_review_date=date(2026, 8, 31),
                ),
                ClientRiskReview(
                    legal_name="Greenfield Pension Fund",
                    client_type="Pension Fund",
                    country_code="NL",
                    risk_rating="Low",
                    review_status="Approved",
                    next_review_date=date(2027, 2, 15),
                ),
            ]
        )
        database_session.commit()
        print("Inserted 3 demo client risk reviews.")

if __name__ == "__main__":
    seed_demo_data()
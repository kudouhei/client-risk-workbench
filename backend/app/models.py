from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ClientRiskReview(Base):
    __tablename__ = "client_risk_reviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    legal_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    client_type: Mapped[str] = mapped_column(String(50), nullable=False)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)

    risk_rating: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    review_status: Mapped[str] = mapped_column(String(30), nullable=False, index=True)

    next_review_date: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ClientRiskReviewStatusEvent(Base):
    __tablename__ = "client_risk_review_status_events"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_risk_review_id: Mapped[int] = mapped_column(
        ForeignKey("client_risk_reviews.id"),
        nullable=False,
        index=True,
    )

    previous_status: Mapped[str] = mapped_column(String(30), nullable=False)
    new_status: Mapped[str] = mapped_column(String(30), nullable=False)
    changed_by: Mapped[str] = mapped_column(String(100), nullable=False)
    change_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

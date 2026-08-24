"""create client risk reviews

Revision ID: 78239dd46afd
Revises: 
Create Date: 2026-08-24 21:59:00.150121

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78239dd46afd'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "client_risk_reviews",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "legal_name",
            sa.String(length=200),
            nullable=False,
        ),
        sa.Column(
            "client_type",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "country_code",
            sa.String(length=2),
            nullable=False,
        ),
        sa.Column(
            "risk_rating",
            sa.String(length=20),
            nullable=False,
        ),
        sa.Column(
            "review_status",
            sa.String(length=30),
            nullable=False,
        ),
        sa.Column(
            "next_review_date",
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_client_risk_reviews_legal_name",
        "client_risk_reviews",
        ["legal_name"],
        unique=False,
    )

    op.create_index(
        "ix_client_risk_reviews_risk_rating",
        "client_risk_reviews",
        ["risk_rating"],
        unique=False,
    )

    op.create_index(
        "ix_client_risk_reviews_review_status",
        "client_risk_reviews",
        ["review_status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_client_risk_reviews_review_status",
        table_name="client_risk_reviews",
    )

    op.drop_index(
        "ix_client_risk_reviews_risk_rating",
        table_name="client_risk_reviews",
    )

    op.drop_index(
        "ix_client_risk_reviews_legal_name",
        table_name="client_risk_reviews",
    )

    op.drop_table("client_risk_reviews")
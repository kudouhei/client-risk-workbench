from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.database import get_db
from app.main import app

BACKEND_DIR = Path(__file__).resolve().parent.parent # backend/

class TestSettings(BaseSettings):
    test_database_url: SecretStr

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env.test",
        env_file_encoding="utf-8",
        extra="ignore",
    )

test_settings = TestSettings()

test_engine = create_engine(
    test_settings.test_database_url.get_secret_value(),
    pool_pre_ping=True,
)


@pytest.fixture()
def database_session() -> Generator[Session, None, None]:
    with test_engine.connect() as connection:
        transaction = connection.begin()

        session = Session(
            bind=connection,
            join_transaction_mode="create_savepoint",
        )

        try:
            yield session
        finally:
            session.close()
            transaction.rollback()

@pytest.fixture()
def client(
    database_session: Session,
) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[
        Session,
        None,
        None,
    ]:
        yield database_session

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
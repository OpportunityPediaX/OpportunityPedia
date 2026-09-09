"""Insert or update the platform admin from .env (ADMIN_EMAIL / ADMIN_PASSWORD)."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.config import settings
from app.core.security import hash_password
from app.repositories import user_repository


def seed_admin() -> None:
    email = settings.ADMIN_EMAIL
    password = settings.ADMIN_PASSWORD
    if not email or not password:
        raise SystemExit("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env")
    hashed = hash_password(password)
    existing = user_repository.find_by_email(email)
    if existing:
        user_repository.update_admin_credentials(
            email=email, name=settings.ADMIN_NAME, password_hash=hashed
        )
        print(f"Updated platform admin `{email}`")
        return
    user_id = user_repository.insert_admin(
        name=settings.ADMIN_NAME, email=email, password_hash=hashed
    )
    print(f"Created platform admin `{email}` id={user_id}")


if __name__ == "__main__":
    seed_admin()

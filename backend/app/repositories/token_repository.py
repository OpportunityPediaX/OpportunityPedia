from __future__ import annotations

from datetime import datetime
from typing import Any

from app.db.connection import connect_database
from app.db.schema import Tables


def insert(*, user_id: int, token_hash: str, expires_at: datetime) -> None:
    sql = (
        f"INSERT INTO `{Tables.password_tokens}` "
        "(`user_id`, `token_hash`, `expires_at`) VALUES (%s, %s, %s)"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id, token_hash, expires_at))


def expire_open_for_user(user_id: int) -> None:
    sql = (
        f"UPDATE `{Tables.password_tokens}` SET `used_at` = NOW() "
        "WHERE `user_id` = %s AND `used_at` IS NULL"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id,))


def find_valid(token_hash: str) -> dict[str, Any] | None:
    sql = (
        f"SELECT * FROM `{Tables.password_tokens}` "
        "WHERE `token_hash` = %s AND `used_at` IS NULL AND `expires_at` > NOW() "
        "LIMIT 1"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (token_hash,))
            return cur.fetchone()


def mark_used(token_id: int) -> None:
    sql = f"UPDATE `{Tables.password_tokens}` SET `used_at` = NOW() WHERE `id` = %s"
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (token_id,))

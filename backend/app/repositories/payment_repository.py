from __future__ import annotations

from typing import Any

from app.db.connection import connect_database
from app.db.schema import Tables


def insert_pending(
    *,
    user_id: int,
    amount_cents: int,
    currency: str,
) -> int:
    sql = (
        f"INSERT INTO `{Tables.payments}` "
        "(`user_id`, `amount_cents`, `currency`, `status`, `provider`) "
        "VALUES (%s, %s, %s, %s, %s)"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id, amount_cents, currency, "pending", "razorpay"))
            return int(cur.lastrowid)


def find_by_id(payment_id: int) -> dict[str, Any] | None:
    sql = f"SELECT * FROM `{Tables.payments}` WHERE `id` = %s LIMIT 1"
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (payment_id,))
            return cur.fetchone()


def set_order_id(payment_id: int, order_id: str) -> None:
    sql = (
        f"UPDATE `{Tables.payments}` SET `stripe_session_id` = %s, `provider` = %s "
        f"WHERE `id` = %s"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (order_id, "razorpay", payment_id))


def mark_paid(payment_id: int) -> None:
    sql = (
        f"UPDATE `{Tables.payments}` SET `status` = %s, `paid_at` = NOW(), `provider` = %s "
        f"WHERE `id` = %s"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, ("paid", "razorpay", payment_id))


def find_pending_for_user(user_id: int) -> dict[str, Any] | None:
    sql = (
        f"SELECT * FROM `{Tables.payments}` "
        "WHERE `user_id` = %s AND `status` = %s "
        "ORDER BY `id` DESC LIMIT 1"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id, "pending"))
            return cur.fetchone()


def list_all() -> list[dict[str, Any]]:
    sql = (
        f"SELECT p.`id`, p.`user_id`, p.`amount_cents`, p.`currency`, p.`status`, "
        f"p.`provider`, p.`stripe_session_id`, p.`paid_at`, p.`created_at`, "
        f"u.`name` AS `user_name`, u.`email` AS `user_email`, u.`phone` AS `user_phone` "
        f"FROM `{Tables.payments}` p "
        f"INNER JOIN `{Tables.users}` u ON u.`id` = p.`user_id` "
        f"ORDER BY p.`created_at` DESC"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            return list(cur.fetchall())

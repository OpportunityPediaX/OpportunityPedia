from __future__ import annotations

from typing import Any

from app.db.connection import connect_database
from app.db.schema import Tables


def find_by_email(email: str) -> dict[str, Any] | None:
    sql = f"SELECT * FROM `{Tables.users}` WHERE `email` = %s LIMIT 1"
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (email.strip().lower(),))
            return cur.fetchone()


def find_by_id(user_id: int) -> dict[str, Any] | None:
    sql = f"SELECT * FROM `{Tables.users}` WHERE `id` = %s LIMIT 1"
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id,))
            return cur.fetchone()


def insert_admin(*, name: str, email: str, password_hash: str) -> int:
    sql = (
        f"INSERT INTO `{Tables.users}` "
        "(`role`, `name`, `email`, `phone`, `company`, `password_hash`, `status`) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(
                sql,
                (
                    "platform_admin",
                    name,
                    email.strip().lower(),
                    "",
                    None,
                    password_hash,
                    "active",
                ),
            )
            return int(cur.lastrowid)


def insert_customer(*, name: str, email: str, phone: str, company: str | None) -> int:
    sql = (
        f"INSERT INTO `{Tables.users}` "
        "(`role`, `name`, `email`, `phone`, `company`, `password_hash`, `status`) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(
                sql,
                (
                    "customer",
                    name,
                    email.strip().lower(),
                    phone,
                    company or None,
                    None,
                    "pending",
                ),
            )
            return int(cur.lastrowid)


def update_customer_profile(
    *,
    user_id: int,
    name: str,
    phone: str,
    company: str | None,
) -> None:
    sql = (
        f"UPDATE `{Tables.users}` SET `name` = %s, `phone` = %s, `company` = %s "
        f"WHERE `id` = %s AND `role` = %s"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (name, phone, company or None, user_id, "customer"))


def list_customers() -> list[dict[str, Any]]:
    sql = (
        f"SELECT `id`, `name`, `email`, `phone`, `company`, `status`, `created_at` "
        f"FROM `{Tables.users}` WHERE `role` = %s ORDER BY `created_at` DESC"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, ("customer",))
            return list(cur.fetchall())


def set_customer_status(user_id: int, status: str) -> None:
    sql = f"UPDATE `{Tables.users}` SET `status` = %s WHERE `id` = %s AND `role` = %s"
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (status, user_id, "customer"))


def update_admin_credentials(*, email: str, name: str, password_hash: str) -> None:
    sql = (
        f"UPDATE `{Tables.users}` SET "
        "`name` = %s, `password_hash` = %s, `role` = %s, `status` = %s "
        "WHERE `email` = %s"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(
                sql,
                (name, password_hash, "platform_admin", "active", email.strip().lower()),
            )


def set_password_hash(user_id: int, password_hash: str) -> None:
    sql = (
        f"UPDATE `{Tables.users}` SET `password_hash` = %s, `status` = %s "
        f"WHERE `id` = %s AND `role` = %s"
    )
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (password_hash, "active", user_id, "customer"))

from __future__ import annotations

import pymysql
from pymysql.connections import Connection

from app.core.config import settings


def connect_server() -> Connection:
    """Connect to MySQL with no default database (for CREATE DATABASE)."""
    return pymysql.connect(
        host=settings.MYSQL_HOST,
        port=settings.MYSQL_PORT,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        charset="utf8mb4",
        autocommit=True,
    )


def connect_database() -> Connection:
    """Connect to the configured application database."""
    return pymysql.connect(
        host=settings.MYSQL_HOST,
        port=settings.MYSQL_PORT,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        database=settings.MYSQL_DATABASE,
        charset="utf8mb4",
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor,
    )

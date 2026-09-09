"""Create the configured database and tables."""

from __future__ import annotations

from app.core.config import settings
from app.db.connection import connect_database, connect_server
from app.db.schema import DATABASE, Tables


def _ensure_column(cur, table: str, column: str, definition: str) -> None:
    cur.execute(
        """
        SELECT COUNT(*) AS c
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s
        """,
        (DATABASE, table, column),
    )
    row = cur.fetchone() or {}
    if int(row.get("c") or 0) == 0:
        cur.execute(f"ALTER TABLE `{table}` ADD COLUMN `{column}` {definition}")


def create_database() -> None:
    sql = (
        f"CREATE DATABASE IF NOT EXISTS `{DATABASE}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    with connect_server() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)


def create_tables() -> None:
    users = Tables.users
    payments = Tables.payments
    tokens = Tables.password_tokens
    radar_runs = Tables.radar_runs
    radar_jobs = Tables.radar_jobs
    with connect_database() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{users}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `role` VARCHAR(32) NOT NULL,
                  `name` VARCHAR(255) NOT NULL,
                  `email` VARCHAR(255) NOT NULL,
                  `phone` VARCHAR(64) NOT NULL DEFAULT '',
                  `company` VARCHAR(255) NULL,
                  `password_hash` VARCHAR(255) NULL,
                  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `uq_{users}_email` (`email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{payments}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `user_id` BIGINT UNSIGNED NOT NULL,
                  `amount_cents` INT NOT NULL,
                  `currency` VARCHAR(8) NOT NULL DEFAULT 'usd',
                  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
                  `provider` VARCHAR(32) NOT NULL DEFAULT 'stripe',
                  `stripe_session_id` VARCHAR(255) NULL,
                  `paid_at` DATETIME NULL,
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `ix_{payments}_user_id` (`user_id`),
                  CONSTRAINT `fk_{payments}_user`
                    FOREIGN KEY (`user_id`) REFERENCES `{users}` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{tokens}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `user_id` BIGINT UNSIGNED NOT NULL,
                  `token_hash` VARCHAR(64) NOT NULL,
                  `expires_at` DATETIME NOT NULL,
                  `used_at` DATETIME NULL,
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `ix_{tokens}_hash` (`token_hash`),
                  CONSTRAINT `fk_{tokens}_user`
                    FOREIGN KEY (`user_id`) REFERENCES `{users}` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{radar_runs}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `user_id` BIGINT UNSIGNED NOT NULL,
                  `status` VARCHAR(32) NOT NULL DEFAULT 'ok',
                  `boards_run` INT NOT NULL DEFAULT 0,
                  `jobs_found` INT NOT NULL DEFAULT 0,
                  `notes` TEXT NULL,
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `ix_{radar_runs}_user_id` (`user_id`),
                  CONSTRAINT `fk_{radar_runs}_user`
                    FOREIGN KEY (`user_id`) REFERENCES `{users}` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{radar_jobs}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `user_id` BIGINT UNSIGNED NOT NULL,
                  `run_id` BIGINT UNSIGNED NOT NULL,
                  `provider` VARCHAR(64) NOT NULL,
                  `board_token` VARCHAR(128) NOT NULL,
                  `board_name` VARCHAR(255) NOT NULL,
                  `external_job_id` VARCHAR(128) NOT NULL,
                  `title` VARCHAR(512) NOT NULL,
                  `location` VARCHAR(512) NULL,
                  `department` VARCHAR(255) NULL,
                  `url` VARCHAR(1024) NULL,
                  `posted_at` VARCHAR(64) NULL,
                  `updated_at` VARCHAR(64) NULL,
                  `requisition_id` VARCHAR(128) NULL,
                  `heat` VARCHAR(32) NOT NULL DEFAULT 'HOT',
                  `signal_type` VARCHAR(64) NOT NULL DEFAULT 'JOB_OPENING',
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `ix_{radar_jobs}_user_id` (`user_id`),
                  KEY `ix_{radar_jobs}_run_id` (`run_id`),
                  CONSTRAINT `fk_{radar_jobs}_user`
                    FOREIGN KEY (`user_id`) REFERENCES `{users}` (`id`),
                  CONSTRAINT `fk_{radar_jobs}_run`
                    FOREIGN KEY (`run_id`) REFERENCES `{radar_runs}` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            _ensure_column(cur, radar_jobs, "posted_at", "VARCHAR(64) NULL")
            _ensure_column(cur, radar_jobs, "updated_at", "VARCHAR(64) NULL")
            _ensure_column(cur, radar_jobs, "requisition_id", "VARCHAR(128) NULL")
            _ensure_column(
                cur, radar_jobs, "heat", "VARCHAR(32) NOT NULL DEFAULT 'HOT'"
            )
            _ensure_column(
                cur,
                radar_jobs,
                "signal_type",
                "VARCHAR(64) NOT NULL DEFAULT 'JOB_OPENING'",
            )
            _ensure_column(cur, radar_jobs, "naics", "VARCHAR(16) NULL")
            _ensure_column(cur, radar_jobs, "category", "VARCHAR(64) NULL")
            radar_vendors = Tables.radar_vendors
            cur.execute(
                f"""
                CREATE TABLE IF NOT EXISTS `{radar_vendors}` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `user_id` BIGINT UNSIGNED NOT NULL,
                  `run_id` BIGINT UNSIGNED NOT NULL,
                  `provider` VARCHAR(64) NOT NULL,
                  `agency_name` VARCHAR(255) NULL,
                  `agency_token` VARCHAR(128) NULL,
                  `vendor_name` VARCHAR(255) NOT NULL,
                  `vendor_uei` VARCHAR(64) NULL,
                  `cage_code` VARCHAR(32) NULL,
                  `registration_status` VARCHAR(64) NULL,
                  `award_notice_id` VARCHAR(128) NULL,
                  `award_title` VARCHAR(512) NULL,
                  `award_url` VARCHAR(1024) NULL,
                  `naics` VARCHAR(16) NULL,
                  `posted_at` VARCHAR(64) NULL,
                  `heat` VARCHAR(32) NOT NULL DEFAULT 'VERY_HOT',
                  `signal_type` VARCHAR(64) NOT NULL DEFAULT 'CONTRACT_AWARD',
                  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  KEY `ix_{radar_vendors}_user_id` (`user_id`),
                  KEY `ix_{radar_vendors}_run_id` (`run_id`),
                  CONSTRAINT `fk_{radar_vendors}_user`
                    FOREIGN KEY (`user_id`) REFERENCES `{users}` (`id`),
                  CONSTRAINT `fk_{radar_vendors}_run`
                    FOREIGN KEY (`run_id`) REFERENCES `{radar_runs}` (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """
            )
            _ensure_column(cur, radar_vendors, "category", "VARCHAR(64) NULL")


def bootstrap() -> None:
    print(f"Host: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}")
    print(f"User: {settings.MYSQL_USER}")
    print(f"Database: {DATABASE}")
    print(
        f"Tables: {Tables.users}, {Tables.payments}, {Tables.password_tokens}, "
        f"{Tables.radar_runs}, {Tables.radar_jobs}, {Tables.radar_vendors}"
    )
    create_database()
    print(f"Created or verified database `{DATABASE}`")
    create_tables()
    print(
        f"Created or verified tables `{Tables.users}`, `{Tables.payments}`, "
        f"`{Tables.password_tokens}`, `{Tables.radar_runs}`, `{Tables.radar_jobs}`, "
        f"`{Tables.radar_vendors}`"
    )


if __name__ == "__main__":
    bootstrap()

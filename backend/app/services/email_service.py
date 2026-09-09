from __future__ import annotations

import smtplib
from email.message import EmailMessage

from app.core.config import settings


def smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD)


def send_password_setup(*, to_email: str, name: str, setup_url: str) -> bool:
    if not smtp_configured():
        return False
    from_addr = settings.SMTP_FROM or settings.SMTP_USER
    message = EmailMessage()
    message["Subject"] = "Create your Radar password"
    message["From"] = from_addr
    message["To"] = to_email
    message.set_content(
        f"Hi {name},\n\n"
        "Your Radar payment is complete. Create your password using this link "
        "(valid for 24 hours):\n\n"
        f"{setup_url}\n\n"
        "If you did not request this, ignore this email.\n"
    )
    message.add_alternative(
        f"<p>Hi {name},</p>"
        "<p>Your Radar payment is complete. "
        f'<a href="{setup_url}">Create your password</a> '
        "(link valid for 24 hours).</p>",
        subtype="html",
    )
    if settings.SMTP_USE_SSL:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(message)
    return True

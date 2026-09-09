from fastapi import Depends

from app.api.deps import require_admin
from app.services import access_service


def list_users(_admin: dict = Depends(require_admin)):
    return {"users": access_service.list_customers()}


def list_payments(_admin: dict = Depends(require_admin)):
    return {"payments": access_service.list_payments()}

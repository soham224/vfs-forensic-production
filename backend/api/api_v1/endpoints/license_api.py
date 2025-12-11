import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps
from core import create_password, license_utils
from core.config import settings

router = APIRouter()


@router.post(
    "/license/generate",
    response_model=schemas.LicenseCreateResponse,
    tags=["License"],
)
def generate_license_key(
    *,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_superuser),
):
    """
    Generate a new license key (superuser only), store the encrypted value,
    and return the plain key for distribution.
    """
    plain_key = create_password.generate_license_key()
    crypto = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)

    try:
        encrypted_key = crypto.encrypt_message(plain_key)
    except Exception as exc:  # pragma: no cover - defensive
        logging.exception("Failed to encrypt license key")
        raise HTTPException(
            status_code=500, detail="Unable to generate license key"
        ) from exc

    now = datetime.utcnow()
    license_obj = crud.license_crud_obj.create(
        db=db,
        obj_in={
            "license_key": encrypted_key,
            "key_status": "unclaimed",
            "start_date": None,
            "expiry_date": None,
            "created_date": now,
            "updated_date": now,
            "status": True,
            "deleted": False,
            "limit_id": 1,
        },
    )

    return {
        "license_id": license_obj.id,
        "license_key": plain_key,
        "key_status": license_obj.key_status,
    }

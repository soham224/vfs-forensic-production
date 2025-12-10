import logging
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core import create_password, license_utils, security
from core.config import settings
from core.security import get_password_hash
from utils import verify_password_reset_token

router = APIRouter()


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    logging.info("login request : {}".format(form_data.username))
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        logging.info("Incorrect email or password")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(user):
        logging.info("Inactive user")
        raise HTTPException(status_code=400, detail="Inactive user")
    elif not user.licenses[0].key_status == "activate":
        logging.info("License Key is not active")
        raise HTTPException(status_code=400, detail="License Key is not active")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    logging.info("login success : {}".format(form_data.username))
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/reset-password/", response_model=schemas.Msg)
def reset_password(
    token: str = Body(...),
    user_email: str = Body(...),
    license_key: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Reset password
    """
    user_id = verify_password_reset_token(token)
    if not user_id:
        logging.info("Invalid token")
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.user.get_by_id(db, user_id=user_id)
    if not user:
        logging.info("The user does not exist in the system.")
        raise HTTPException(
            status_code=404,
            detail="The user does not exist in the system.",
        )
    elif not crud.user.is_active(user):
        logging.info("Inactive user")
        raise HTTPException(status_code=400, detail="Inactive user")
    crypto_obj = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)
    license_objs = crud.license_crud_obj.get_by_key_status(db)
    if not any(
        crypto_obj.decrypt_message(license.license_key) == license_key
        and license.key_status == "activate"
        for license in license_objs
    ):
        logging.warning("Invalid license key or status")
        raise HTTPException(
            status_code=400,
            detail="License key does not exist or does not activate",
        )
    else:
        generate_password = create_password.generate_password()
        # send_email.send_password_email(
        #     receiver_email=user_email,
        #     user_password=generate_password,
        # )
        hashed_password = get_password_hash(generate_password)
        user.hashed_password = hashed_password
        db.add(user)
        db.commit()
        logging.info("Password updated successfully")
        return {"msg": "Password updated successfully"}


@router.post("/forgot-password", response_model=schemas.UserForgotSchema)
def forgot_password(
    user_in: schemas.UserForgotPassword,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Forgot password
    """
    user = crud.user.get_by_email(db, email=user_in.user_email)
    if not user:
        logging.error("The user does not exist in the system.")
        raise HTTPException(
            status_code=404,
            detail="The user does not exist in the system.",
        )
    elif not crud.user.is_active(user):
        logging.info("Inactive user")
        raise HTTPException(status_code=400, detail="Inactive user")
    crypto_obj = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)
    license_objs = crud.license_crud_obj.get_by_key_status(db)
    if not any(
        crypto_obj.decrypt_message(license.license_key) == user_in.license_key
        and license.key_status == "activate"
        for license in license_objs
    ):
        logging.warning("Invalid license key or status")
        raise HTTPException(
            status_code=400,
            detail="License key does not exist or does not activate",
        )
    else:
        generate_password = create_password.generate_password()
        user = crud.user.update(
            db=db, db_obj=user, obj_in={"password": generate_password}
        )
        user.user_password = generate_password
        logging.info("Password update successfully")
        return user

import logging
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import Page, paginate
from sqlalchemy.orm import joinedload

import crud
import models
import schemas
from api import deps
from core import create_password, license_utils
from core.config import settings

router = APIRouter()

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/add_user", response_model=schemas.UserForgotSchema)
def create_user(
    *, db: Session = Depends(deps.get_db), user_in: schemas.UserCreate
) -> Any:
    """
    Create new user.
    """
    # Check if user already exists
    if crud.user.get_by_email(db, email=user_in.user_email):
        logging.warning("User already registered")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    # Validate license key format
    if len(user_in.license_key) != 29:
        logging.warning("Invalid license key format")
        raise HTTPException(
            status_code=400,
            detail="License key format is invalid.",
        )

    # Retrieve and validate license
    license_objs = crud.license_crud_obj.get_by_key_status(db)
    crypto_handler = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)

    # Debug: log decrypted license keys and statuses
    for lic in license_objs:
        try:
            decrypted = crypto_handler.decrypt_message(lic.license_key)
        except Exception as e:
            logging.warning(f"Failed to decrypt license id={getattr(lic, 'id', 'unknown')}: {e}")
            decrypted = "<decrypt_error>"
        logging.info(
            f"License debug -> id={getattr(lic, 'id', 'unknown')}, key_status={lic.key_status}, decrypted_key={decrypted}"
        )

    matching_license = next(
        (
            license
            for license in license_objs
            if crypto_handler.decrypt_message(license.license_key)
            == user_in.license_key
            and license.key_status == "unclaimed"
        ),
        None,
    )
    if not matching_license:
        logging.warning("Invalid license key or status")
        raise HTTPException(
            status_code=400,
            detail="License key does not exist or is active/expired.",
        )

    # Generate password
    user_in.user_password = create_password.generate_password()

    # Create user and update license status
    user = crud.user.create(db, obj_in=user_in, license_id=matching_license.id)
    start_date = datetime.now(timezone.utc).replace(microsecond=0)
    crud.license_crud_obj.update(
        db=db,
        db_obj=matching_license,
        obj_in={
            "start_date": start_date,
            "expiry_date": (start_date + timedelta(days=365)).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "key_status": "activate",
        },
    )
    user.user_password = user_in.user_password
    # Return email and original password
    return user


# @router.post("/add_user", response_model=schemas.User)
# def create_user(
#     *, db: Session = Depends(deps.get_db), user_in: schemas.UserCreate
# ) -> Any:
#     """
#     Create new user.
#     """
#     user = crud.user.get_by_email(db, email=user_in.user_email)
#     if user:
#         logging.warning("user already registered")
#         raise HTTPException(
#             status_code=400,
#             detail="The user with this email already exists in the system.",
#         )
#
#     if len(user_in.license_key) != 29:
#         logging.warning("License key does not valid")
#         raise HTTPException(
#             status_code=400,
#             detail="License key does not valid.",
#         )
#     license_objs = crud.license_crud_obj.get_by_key_status(db)
#     crypto_obj = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)
#     if not any(
#         crypto_obj.decrypt_message(license.license_key) == user_in.license_key
#         and license.key_status == "unclaimed"
#         for license in license_objs
#     ):
#         logging.warning("Invalid license key or status")
#         raise HTTPException(
#             status_code=400,
#             detail="License key does not exist or is active/expired.",
#         )
#     generate_password = create_password.generate_password()
#
#     user_in.user_password = generate_password
#
#     for licence in license_objs:
#         if crypto_obj.decrypt_message(licence.license_key) == user_in.license_key:
#             user = crud.user.create(db, obj_in=user_in, license_id=licence.id)
#             license_obj = crud.license_crud_obj.update(
#                 db=db,
#                 db_obj=licence,
#                 obj_in={
#                     "expiry_date": (
#                         datetime.now(timezone.utc).replace(microsecond=0)
#                         + timedelta(days=365)
#                     ).strftime("%Y-%m-%d %H:%M:%S"),
#                     "key_status": "activate",
#                 },
#             )
#             break
#     return user


@router.post("/add_supervisor", response_model=schemas.User)
def create_supervisor(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new supervisor.
    """
    user = crud.user.get_by_email(db, email=user_in.user_email)
    if user:
        logging.warning("user already registered")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create_supervisor(
        db, obj_in=user_in, company_id=current_user.company_id
    )

    # if user:
    #     send_user_registration_mail(recipient_list=[user.user_email, user.company_email])
    #     send_registration_mail_to_superadmin(company_name=user.company_name,
    #                                          recipient_list=settings.SUPER_ADMIN_MAIL_LIST)

    return user


@router.post("/update_user_status")
def update_user_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    user = crud.user.update_user_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        # send_activate_mail_to_user(company_name=user.company_name, recipient_list=[user.user_email, user.company_email])
        return "User Status Updated"


@router.post("/update_user_status_from_autoDL")
def update_user_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
) -> Any:
    user = crud.user.update_user_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        return "User Status Updated"


@router.post("/update_supervisor_status")
def update_supervisor_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.update_supervisor_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        return "Supervisor Status Updated"


@router.post("/get_all_users", response_model=Page[schemas.User])
def get_all_users(
    *,
    search: Optional[str] = "",
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    users = crud.user.get_all_users(db, search)
    if users:
        return paginate(users)
    else:
        return paginate([])


@router.post("/get_all_users_for_result_manager", response_model=List[schemas.User])
def get_all_users_result_manager(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    result_manager_companies = []
    user = crud.user.get_result_manager_by_id(db, current_user.id)
    if user:
        logging.info("{} user".format(user[0].roles[0].role))
        for company in user[0].companies:
            user1 = crud.user.get_admin_of_current_user_by_company_id(db, company.id)
            result_manager_companies.append(user1[0])
        logging.info("{} company_list".format(result_manager_companies))
    return result_manager_companies


@router.post("/get_all_company_supervisor", response_model=List[schemas.User])
def get_all_company_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_all_supervisor(db, current_user.company_id)
    return user


@router.post("/get_all_enabled_company_supervisor", response_model=List[schemas.User])
def get_all_company_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return crud.user.get_all_enabled_supervisor(db, current_user.company_id)


@router.post("/assign_locations", response_model=schemas.User)
def get_all_location(
    user_id: int,
    location_id_list: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_by_id(db, user_id=user_id)
    if user and location_id_list:
        for location_id in location_id_list:
            response = crud.user.add_location_mapping(db, user_id, location_id)
        return response

    else:
        raise HTTPException(
            status_code=400,
            detail="User not found to assign the location",
        )


@router.post("/remove_assigned_locations", response_model=schemas.User)
def get_all_location(
    user_id: int,
    location_id_list: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_by_id(db, user_id=user_id)
    if user and location_id_list:
        for location_id in location_id_list:
            response = crud.user.remove_location_mapping(db, user_id, location_id)
        return response
    else:
        raise HTTPException(
            status_code=400,
            detail="User not found to assign the location",
        )


@router.post("/get_user_by_company_id", response_model=Page[schemas.User])
def get_all_location(
    company_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.user.get_user_by_company_id(db, company_id)
    if db_obj:
        return paginate(db_obj)
    else:
        return paginate([])


@router.get("/get_all_users_by_status", response_model=Page[schemas.User])
def get_all_users_by_status(
    user_status: bool,
    search: Optional[str] = "",
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.user.get_users_by_user_status(
        db=db, user_status=user_status, search=search
    )
    if db_obj:
        return paginate(db_obj)
    else:
        return paginate([])


@router.get("/get_all_users_by_role", response_model=Page[schemas.User])
def get_all_users_by_status(
    role_id: int,
    search: Optional[str] = "",
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.user.get_users_by_user_role(db=db, role_id=role_id, search=search)
    if db_obj:
        return paginate(db_obj)
    else:
        return paginate([])


@router.get("/get_license_details", response_model=schemas.UserLicense)
def get_user_details(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.user.get_by_id(db, user_id=current_user.id)
    crypto_obj = license_utils.CryptographyHandler(settings.LICENSE_SECRET_KEY)
    db_obj.licenses[0].license_key = crypto_obj.decrypt_message(
        db_obj.licenses[0].license_key
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return db_obj

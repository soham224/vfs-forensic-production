import logging

import crud


def raise_notification(notification_details, db):
    try:
        if isinstance(notification_details, dict):
            obj_in = notification_details
        else:
            obj_in = notification_details.dict(exclude_unset=True)
        out_obj = crud.notification_crud_obj.create(db=db, obj_in=obj_in)
        return out_obj
    except Exception as e:
        logging.error("Exception add_notification_utils : {} ".format(e))
        return []

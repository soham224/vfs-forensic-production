from models import License, Limit, ResultType, Role


def seed_master_data(op, logger=None):
    op.bulk_insert(
        Role.__table__,
        [
            {"role": "superadmin"},
            {"role": "admin"},
            {"role": "supervisor"},
            {"role": "resultmanager"},
            {"role": "reporter"},
        ],
    )
    # op.bulk_insert(
    #     License.__table__,
    #     [
    #         {
    #             "license_key": "",
    #             "key_status": "",
    #             "expiry_date": "",
    #             "created_date": "",
    #             "updated_date": "",
    #             "status": "",
    #             "deleted": "",
    #             "limit_id": "",
    #             "start_date": "",
    #         },
    #         {
    #             "license_key": "",
    #             "key_status": "",
    #             "expiry_date": "",
    #             "created_date": "",
    #             "updated_date": "",
    #             "status": "",
    #             "deleted": "",
    #             "limit_id": "",
    #             "start_date": "",
    #         },
    #     ],
    # )
    # op.bulk_insert(
    #     Limit.__table__,
    #     [
    #         {
    #             "type": "VFS",
    #             "subtype": "camera",
    #             "current_limit": 10,
    #             "created_date": "",
    #             "updated_date": "",
    #             "status": "",
    #             "deleted": "",
    #         },
    #     ],
    # )

    op.bulk_insert(
        ResultType.__table__,
        [
            {"result_type": "Forensic"},
            {"result_type": "Crowd"},
            {"result_type": "Occupancy"},
            {"result_type": "Abandoned"},
        ],
    )

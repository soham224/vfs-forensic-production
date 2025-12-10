from sqlalchemy import func

from enums.query_duration_type_enum import QueryDurationTypeEnum


def get_time_filter(field, time_zone, duration_type):
    if duration_type == QueryDurationTypeEnum.YEAR:
        time_format = "%Y"
    elif duration_type == QueryDurationTypeEnum.MONTH:
        time_format = "%Y-%m"
    elif duration_type == QueryDurationTypeEnum.DAY:
        time_format = "%Y-%m-%d"
    elif duration_type == QueryDurationTypeEnum.WEEK:
        time_format = "%w"
    elif duration_type == QueryDurationTypeEnum.HOUR:
        time_format = "%H:00"
    elif duration_type == QueryDurationTypeEnum.MINUTE:
        time_format = "%H:%i"
    elif duration_type == QueryDurationTypeEnum.SECOND:
        time_format = "%H:%i:%s"
    elif duration_type == QueryDurationTypeEnum.MILLISECOND:
        time_format = "%H:%i:%s.%f"
    else:
        time_format = "%Y"
    return func.date_format(
        func.convert_tz(field, "UTC", time_zone), time_format
    ).label("date_time")

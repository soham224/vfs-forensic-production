from enum import Enum


class QueryDurationTypeEnum(Enum):
    YEAR = "YEAR"
    MONTH = "MONTH"
    DAY = "DAY"
    WEEK = "WEEK"
    HOUR = "HOUR"
    MINUTE = "MINUTE"
    SECOND = "SECOND"
    MILLISECOND = "MILLISECOND"

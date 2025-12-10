from enum import Enum


class CaseReportEnum(str, Enum):
    OPEN = "OPEN"
    PROCESSING = "PROCESSING"
    ON_HOLD = "ON HOLD"
    COMPLETED = "COMPLETED"


class CaseStatusEnum(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

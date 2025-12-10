from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class FilterCreate(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    current_date: Optional[datetime]
    deployed_rtsp_job_id: Optional[int]
    camera_id: Optional[list]
    selected_model_labels_list: Optional[str]
    duration_type: Optional[str]
    initial_graph: Optional[bool]
    location_id: Optional[list]
    day_time: Optional[str]


class FilterNotificationCreate(BaseModel):
    company_id: int
    time_diff: int
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    page_number: Optional[int] = 1
    page_size: Optional[int] = 10

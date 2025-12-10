from typing import Optional
import os
from fastapi import HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from core.query_utils import get_time_filter
from crud.base import CRUDBase
from enums.query_duration_type_enum import QueryDurationTypeEnum
from models import CameraRTSP, Result, Suspect, Videos, Location
from models.case import Case, CaseCameraRTSPMapping
from schemas.case import *


class CRUDCase(CRUDBase[Case, CaseCreate, CaseUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return db.query(Case).filter(Case.id == _id).first()

    def get_multiple_by_ids(self, db: Session, ids: List[int]) -> List[Case]:
        return db.query(self.model).filter(self.model.id.in_(ids)).all()

    def get_by_name(self, db: Session, *, name: str, company_id: int) -> Optional[Case]:
        return (
            db.query(Case)
            .filter(Case.case_name == name)
            .filter(Case.deleted == False)
            .first()
        )

    def get_all_case(self, db: Session):
        return db.query(Case).filter(Case.deleted == False).all()

    def get_all_cases_by_camera_and_user(
        self, session: Session, camera_rtsp_id: int, current_user_id: int
    ):
        return (
            session.query(Case)
            .join(CaseCameraRTSPMapping, Case.id == CaseCameraRTSPMapping.c.case_id)
            .filter(
                CaseCameraRTSPMapping.c.camera_rtsp_id == camera_rtsp_id,
                Case.user_id == current_user_id,  # Add the condition for the user_id
            )
            .all()
        )

    def get_graph_details(self, db: Session, filter_request: GraphCaseRequestSchema):
        try:
            duration_type_enum_object = QueryDurationTypeEnum[
                filter_request.duration_type.upper()
            ]
        except KeyError as ex:
            raise HTTPException(status_code=422, detail="Invalid Duration Type.")
        get_data_query = [
            get_time_filter(
                field=Case.created_date,
                time_zone=filter_request.time_zone,
                duration_type=duration_type_enum_object,
            ),
            func.count(Case.id),
        ]
        if filter_request.get_id:
            get_data_query.append(
                func.group_concat(Case.id).label("id_list"),
            )
        query = db.query(*get_data_query).select_from(Case)
        query = query.where(Case.deleted == False)
        if filter_request.start_date and filter_request.end_date:
            query = query.where(
                Case.created_date.between(
                    filter_request.start_date, filter_request.end_date
                )
            )
        query = query.group_by("date_time").order_by("date_time")
        db_case = db.execute(query)
        response = []
        for case in db_case:
            graph_data = {"name": case[0], "y": int(case[1])}
            if filter_request.get_id:
                graph_data["id"] = (
                    [int(id) for id in case[-1].split(",")] if case[-1] else []
                )
            response.append(graph_data)
        return response

    def get_suspect_journey(self, case_id: int, db: Session):
        """
        Build suspect journey grouped by recording source. If a result has a camera_id, include
        camera details. If a result has a video_id, include video details (name and URL). Results
        are restricted to the given case by either:
        - Suspects linked to the case (Suspect.case_id == case_id), or
        - Results recorded from cameras mapped to the case, or
        - Results recorded from videos mapped to the case.
        """
        # Preload case with its camera/video mappings
        case_obj = (
            db.query(Case)
            .options(joinedload(Case.cameras_rtsp), joinedload(Case.videos))
            .filter(Case.id == case_id)
            .first()
        )

        camera_ids = (
            [c.id for c in getattr(case_obj, "cameras_rtsp", [])] if case_obj else []
        )
        video_ids = [v.id for v in getattr(case_obj, "videos", [])] if case_obj else []

        # Build the base query of suspect journey data including camera and video joins
        base_query = (
            db.query(
                Suspect.suspect_name,
                CameraRTSP.id.label("camera_id"),
                CameraRTSP.camera_name,
                Location.location_name,
                Videos.id.label("video_id"),
                Videos.des_video_path,
                Videos.des_url,
                Result.bounding_box,
                Result.frame_time,
                Result.file_url,
            )
            .join(Suspect, Result.suspect_id == Suspect.id)
            .outerjoin(CameraRTSP, CameraRTSP.id == Result.camera_id)
            .outerjoin(Location, Location.id == CameraRTSP.location_id)
            .outerjoin(Videos, Videos.id == Result.video_id)
            .filter(Result.result_type_id == 1)
            .filter(Suspect.deleted == False)
            .filter(Result.deleted == False)
            .filter(Suspect.status == True)
            .filter(Result.status == True)
        )

        # Restrict results to the current case using suspect linkage OR mapped cameras/videos
        case_filters = [Suspect.case_id == case_id]
        if camera_ids:
            case_filters.append(Result.camera_id.in_(camera_ids))
        if video_ids:
            case_filters.append(Result.video_id.in_(video_ids))
        base_query = base_query.filter(or_(*case_filters))

        query = base_query.order_by(
            Result.video_id.is_(None),
            Result.video_id,
            Result.camera_id.is_(None),
            Result.camera_id,
            Result.frame_time,
        ).all()

        # Build response keyed by file_url
        response_data = {}
        for data in query:
            if not response_data.get(data.file_url):
                # Prefer video details when available; otherwise use camera details
                if data.video_id is not None:
                    video_name = os.path.basename(data.des_video_path or "")
                    display_name = video_name if video_name else "Unknown Video"
                    response_data[data.file_url] = {
                        "source_type": "video",
                        "video_id": data.video_id,
                        "video_name": display_name,
                        "destination_url": data.des_url,
                        "file_url": data.file_url,
                        "suspects": [],
                        "frame_time": data.frame_time,
                    }
                else:
                    display_name = (
                        data.camera_name if data.camera_name else "Unknown Camera"
                    )
                    response_data[data.file_url] = {
                        "source_type": "camera",
                        "camera_id": data.camera_id,
                        "camera_name": display_name,
                        "location_name": getattr(data, "location_name", None),
                        "file_url": data.file_url,
                        "suspects": [],
                        "frame_time": data.frame_time,
                    }

            response_data[data.file_url]["suspects"].append(
                {"bounding_box": data.bounding_box, "suspect_name": data.suspect_name}
            )

        # Generate descriptions once per file_url after all suspects are collected
        # This ensures consistency and uses the stored frame_time
        for file_url, entry_data in response_data.items():
            # Description based on resolved display name
            if entry_data["source_type"] == "video":
                source_name = entry_data["video_name"]
            else:
                source_name = entry_data.get("camera_name", "Unknown Camera")

            # Use the stored frame_time from the entry, not from individual rows
            frame_time = entry_data["frame_time"]
            if hasattr(frame_time, "isoformat"):
                frame_time_str = frame_time.isoformat()
            else:
                frame_time_str = str(frame_time)

            # Get unique suspect names
            suspect_names = ", ".join(
                sorted(
                    set(
                        suspects_data["suspect_name"]
                        for suspects_data in entry_data["suspects"]
                    )
                )
            )

            # Generate description based on number of suspects
            if len(entry_data["suspects"]) == 1:
                description = f"Suspect {suspect_names} was seen in {source_name} at {frame_time_str}."
            else:
                description = f"Multiple suspects ({suspect_names}) were seen in {source_name} at {frame_time_str}."

            entry_data["description"] = description

        return list(response_data.values())


case_crud_obj = CRUDCase(Case)

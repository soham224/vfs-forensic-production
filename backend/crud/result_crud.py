from typing import List

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.query_utils import get_time_filter
from crud.base import CRUDBase
from enums.query_duration_type_enum import QueryDurationTypeEnum
from models.camera import CameraRTSP
from models.location import Location, UserLocation
from models.result import Result
from models.result_type import ResultType
from schemas.result import (
    GraphResultRequestSchema,
    PaginatedResultsSchema,
    PaginationMeta,
    ResultCreate,
    ResultRequestSchema,
    ResultUpdate,
)


class CRUDResult(CRUDBase[Result, ResultCreate, ResultUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_multiple_by_ids(self, db: Session, ids: List[int]) -> List[Result]:
        return db.query(self.model).filter(self.model.id.in_(ids)).all()

    def get_all_result(self, db: Session):
        return db.query(Result).filter(Result.deleted == False).all()

    def get_all_results_by_user_id(self, db: Session, user_id: int):
        return (
            db.query(self.model)
            .join(CameraRTSP, Result.camera_id == CameraRTSP.id)
            .join(Location, CameraRTSP.location_id == Location.id)
            .join(UserLocation, UserLocation.c.location_id == Location.id)
            .filter(UserLocation.c.user_id == user_id)
            .all()
        )

    # def get_paginated_results(
    #     self,
    #     db: Session,
    #     request: ResultRequestSchema,
    #     user_id: int,  # Assuming you are filtering by user_id
    # ):
    #     query = db.query(Result).join(ResultType).join(CameraRTSP)
    #
    #     # Apply filters based on user input
    #     if request.location_id:
    #         query = (
    #             query.join(Location)
    #             .join(UserLocation)
    #             .filter(
    #                 UserLocation.c.location_id.in_(request.location_id)
    #             )  # Handle multiple location IDs
    #         )
    #
    #     if request.camera_id:
    #         query = query.filter(
    #             Result.camera_id.in_(request.camera_id)
    #         )  # Handle multiple camera IDs
    #
    #     if request.result_type:
    #         query = query.filter(Result.result_type_id == request.result_type)
    #
    #     if request.start_datetime:
    #         query = query.filter(Result.created_date >= request.start_datetime)
    #
    #     if request.end_datetime:
    #         query = query.filter(Result.created_date <= request.end_datetime)
    #
    #     # Get total count for pagination
    #     total_count = query.count()
    #     if not total_count:
    #         return PaginatedResultsSchema(results=[], total_count=total_count)
    #
    #     query = query.offset((request.page_number - 1) * request.page_size).limit(
    #         request.page_size
    #     )
    #     results = query.all()
    #     return PaginatedResultsSchema(results=results, total_count=total_count)
    def get_paginated_results(
        self,
        db: Session,
        request: ResultRequestSchema,
        user_id: int,
    ):
        # Use outerjoin to CameraRTSP so rows with NULL camera_id (e.g., video-only results) are included
        query = db.query(Result).join(ResultType).outerjoin(CameraRTSP)

        # Apply filters based on user input
        if request.location_id:
            query = (
                query.join(Location)
                .join(UserLocation)
                .filter(UserLocation.c.location_id.in_(request.location_id))
            )

        if request.camera_id:
            query = query.filter(Result.camera_id.in_(request.camera_id))

        if request.result_type:
            query = query.filter(Result.result_type_id == request.result_type)

        if request.start_datetime:
            query = query.filter(Result.created_date >= request.start_datetime)

        if request.end_datetime:
            query = query.filter(Result.created_date <= request.end_datetime)

        # Get total count for pagination
        total_count = query.count()
        if not total_count:
            return PaginatedResultsSchema(
                results=[],
                pagination=PaginationMeta(
                    total_page=0,
                    next_page=None,
                    pre_page=None,
                    page_size=request.page_size,
                    total_count=total_count,
                ),
            )

        # Calculate pagination details
        total_page = (total_count + request.page_size - 1) // request.page_size
        current_page = request.page_number
        next_page = current_page + 1 if current_page < total_page else None
        pre_page = current_page - 1 if current_page > 1 else None

        # Apply pagination to query
        query = query.offset((current_page - 1) * request.page_size).limit(
            request.page_size
        )
        results = query.all()

        # Return paginated results
        return PaginatedResultsSchema(
            results=results,
            pagination=PaginationMeta(
                total_page=total_page,
                next_page=next_page,
                pre_page=pre_page,
                page_size=request.page_size,
                total_count=total_count,
            ),
        )

    def get_graph_results(self, db: Session, filter_request: GraphResultRequestSchema):
        if len(filter_request.label) > 1:
            filter_request.get_id = False
        try:
            duration_type_enum_object = QueryDurationTypeEnum[
                filter_request.duration_type.upper()
            ]
        except KeyError as ex:
            raise HTTPException(status_code=422, detail="Invalid Duration Type.")
        get_data_query = [
            get_time_filter(
                field=Result.created_date,
                time_zone=filter_request.time_zone,
                duration_type=duration_type_enum_object,
            )
        ]
        for label_name in filter_request.label:
            get_data_query.append(
                func.sum(
                    func.json_extract(Result.label_count, f"$.{label_name}")
                ).label(label_name)
            )
        if filter_request.get_id:
            get_data_query.append(
                func.group_concat(Result.id).label("id_list"),
            )
        query = db.query(*get_data_query).select_from(Result)
        query = query.where(Result.deleted == False)
        if filter_request.start_date and filter_request.end_date:
            query = query.where(
                Result.created_date.between(
                    filter_request.start_date, filter_request.end_date
                )
            )
        if filter_request.get_id:
            query = query.filter(
                Result.label_count.isnot(None),  # Check label_count is not NULL
                func.json_extract(
                    Result.label_count, f"$.{filter_request.label[0]}"
                ).isnot(None),
            )
        query = query.group_by("date_time").order_by("date_time")
        db_result = db.execute(query)
        response = {}
        for result in db_result:
            for index in range(len(filter_request.label)):
                if result[index + 1]:
                    result_dict = {
                        "name": result[0],
                        "y": int(result[index + 1]) if result[index + 1] else 0,
                    }
                    if filter_request.get_id:
                        result_dict["id"] = result[-1].split(",") if result[-1] else []
                    if filter_request.label[index] not in response:
                        response[filter_request.label[index]] = []
                    response[filter_request.label[index]].append(result_dict)
        return response


result_crud_obj = CRUDResult(Result)

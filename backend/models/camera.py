from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Sequence,
    JSON,
)
from sqlalchemy.orm import relationship

from db.base_class import Base

from .case import CaseCameraRTSPMapping

# class Camera(Base):
#     __tablename__ = "camera"
#     id = Column(Integer, primary_key=True, index=True)
#     nvr_id = Column(String(255), nullable=False)
#     camera_name = Column(String(255), nullable=False)
#     created_date = Column(DateTime, nullable=False)
#     updated_date = Column(DateTime, nullable=False)
#     status = Column(Boolean, nullable=False)
#     deleted = Column(Boolean, nullable=False)
#     location_id = Column(Integer, ForeignKey("location.id"))
#     locations = relationship("Location", back_populates="cameras")
#     cases = relationship(
#         "Case",
#         secondary=CaseCameraMapping,
#         back_populates="cameras",
#     )
# suspect = relationship("Suspect")

CameraRTSPResultTypeMapping = Table(
    "camera_rtsp_result_type_mapping",
    Base.metadata,
    # Column(
    #     "id",
    #     Integer,
    #     Sequence("case_camera_rtsp_id_seq"),
    #     primary_key=True,
    #     autoincrement=True,
    # ),
    Column("result_type_id", Integer, ForeignKey("result_type.id"), nullable=False),
    Column("camera_rtsp_id", Integer, ForeignKey("camera_rtsp.id"), nullable=False),
    Column("roi", JSON, nullable=False, default=[]),
)


class CameraRTSP(Base):
    __tablename__ = "camera_rtsp"
    id = Column(Integer, primary_key=True, index=True)
    camera_name = Column(String(255), nullable=False)
    rtsp_url = Column(String(255), nullable=False)
    process_fps = Column(Integer, nullable=False)
    is_tcp = Column(Boolean, nullable=True)
    camera_resolution = Column(String(255), nullable=False)
    camera_ip = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    is_processing = Column(Boolean, default=False, nullable=False)
    roi_type = Column(Boolean, default=False, nullable=False)
    roi_url = Column(String(255), default=False, nullable=True)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    location_id = Column(Integer, ForeignKey("location.id"))
    location = relationship("Location", back_populates="cameras_rtsp")
    result = relationship("Result", back_populates="cameras_rtsp")
    cases = relationship(
        "Case",
        secondary=CaseCameraRTSPMapping,
        back_populates="cameras_rtsp",
    )
    result_types = relationship(
        "ResultType",
        secondary=CameraRTSPResultTypeMapping,
        # back_populates="camera_rtsp",
    )

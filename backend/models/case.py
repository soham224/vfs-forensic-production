from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from db.base_class import Base

CaseCameraRTSPMapping = Table(
    "case_camera_rtsp_mapping",
    Base.metadata,
    Column("case_id", Integer, ForeignKey("case.id")),
    Column("camera_rtsp_id", Integer, ForeignKey("camera_rtsp.id")),
)

# New: Mapping table between Case and Videos
CaseVideoMapping = Table(
    "case_video_mapping",
    Base.metadata,
    Column("case_id", Integer, ForeignKey("case.id")),
    Column("video_id", Integer, ForeignKey("videos.id")),
)


class Case(Base):
    __tablename__ = "case"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(255), nullable=False, unique=True)
    case_name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    case_description = Column(String(255))
    case_status = Column(String(255), nullable=False)
    case_report = Column(String(255))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    suspects = relationship("Suspect", back_populates="cases")
    cameras_rtsp = relationship(
        "CameraRTSP", secondary=CaseCameraRTSPMapping, back_populates="cases"
    )
    # New: videos relationship through CaseVideoMapping
    videos = relationship("Videos", secondary=CaseVideoMapping, back_populates="cases")

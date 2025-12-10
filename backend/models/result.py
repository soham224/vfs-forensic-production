from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.base_class import Base


class Result(Base):
    __tablename__ = "result"
    id = Column(Integer, primary_key=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_url = Column(String(255), nullable=False)
    bounding_box = Column(JSON, nullable=False)
    suspect_id = Column(Integer, ForeignKey("suspect.id"))
    result_type_id = Column(Integer, ForeignKey("result_type.id"))
    frame_time = Column(DateTime)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    label = Column(JSON, nullable=False)
    label_count = Column(JSON, nullable=False)
    camera_id = Column(Integer, ForeignKey("camera_rtsp.id"), nullable=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    suspect = relationship("Suspect", back_populates="result")
    result_type = relationship("ResultType", back_populates="result")
    cameras_rtsp = relationship("CameraRTSP", back_populates="result")
    video = relationship("Videos", back_populates="results")

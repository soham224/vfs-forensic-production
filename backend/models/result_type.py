from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from db.base_class import Base
from models.camera import CameraRTSPResultTypeMapping


class ResultType(Base):
    __tablename__ = "result_type"
    id = Column(Integer, primary_key=True, index=True)
    result_type = Column(String(255), nullable=False)
    roi_status = Column(Boolean, nullable=False)
    result = relationship("Result", back_populates="result_type")
    result_types = relationship(
        "CameraRTSP",
        secondary=CameraRTSPResultTypeMapping,
        # back_populates="camera_rtsp",
    )

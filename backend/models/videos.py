from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from db.base_class import Base
from .case import CaseVideoMapping


class Videos(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    main_dir = Column(String(255))
    des_video_path = Column(String(255))
    status = Column(Boolean, server_default="1", default=True)
    created_date = Column(DateTime)
    des_url = Column(String(255))
    # New: relationship back to Case through mapping
    cases = relationship("Case", secondary=CaseVideoMapping, back_populates="videos")
    # New: back-populated relationship to Result entries referencing this video
    results = relationship("Result", back_populates="video")

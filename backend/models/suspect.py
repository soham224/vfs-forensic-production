from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.base_class import Base


class Suspect(Base):
    __tablename__ = "suspect"
    id = Column(Integer, primary_key=True, index=True)
    suspect_name = Column(String(255), nullable=False)
    suspect_image_path = Column(String(255), nullable=False)
    suspect_image_url = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    case_id = Column(Integer, ForeignKey("case.id"))
    cases = relationship("Case", back_populates="suspects")
    result = relationship("Result", back_populates="suspect")

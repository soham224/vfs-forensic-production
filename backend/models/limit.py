from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from db.base_class import Base

from .license import LicenseLimitUser


class Limit(Base):
    __tablename__ = "limit"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False, unique=True)
    subtype = Column(String(255), nullable=False)
    current_limit = Column(Integer, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    licenses = relationship("License", back_populates="limits")

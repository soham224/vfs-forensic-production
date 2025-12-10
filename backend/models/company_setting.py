from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from db.base_class import Base


class CompanySetting(Base):
    __tablename__ = "company_setting"
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(String(255), nullable=False)
    end_time = Column(String(255), nullable=False)
    buffer_time = Column(String(255), nullable=False)
    is_used_camera = Column(Boolean, nullable=False)
    status = Column(Boolean, nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)

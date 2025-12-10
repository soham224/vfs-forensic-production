from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from db.base_class import Base

LicenseLimitUser = Table(
    "user_license_mapping",
    Base.metadata,
    Column("license_id", Integer, ForeignKey("license.id")),
    Column("user_id", Integer, ForeignKey("user.id")),
)


class License(Base):
    __tablename__ = "license"
    id = Column(Integer, primary_key=True, index=True)
    license_key = Column(String(255), index=True)
    key_status = Column(String(20), index=True)
    start_date = Column(DateTime)
    expiry_date = Column(DateTime)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    deleted = Column(Boolean, nullable=False)
    limit_id = Column(Integer, ForeignKey("limit.id"))
    users = relationship("User", secondary=LicenseLimitUser, back_populates="licenses")
    limits = relationship("Limit", back_populates="licenses")

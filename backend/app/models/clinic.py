"""
Clinic model
"""
from sqlalchemy import Column, Integer, String, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Clinic(Base):
    """Clinic model"""
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50))
    email = Column(String(255))
    address = Column(String(500))
    working_hours_start = Column(Time, default="09:00")
    working_hours_end = Column(Time, default="17:00")
    slot_duration = Column(Integer, default=30)  # minutes
    timezone = Column(String(50), default="Europe/Belgrade")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", back_populates="clinic")
    patients = relationship("Patient", back_populates="clinic")
    service_types = relationship("ServiceType", back_populates="clinic")
    appointments = relationship("Appointment", back_populates="clinic")

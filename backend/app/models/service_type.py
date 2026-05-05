"""
Service Type model
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class ServiceType(Base):
    __tablename__ = "service_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False, default=30)  # Duration in minutes
    price = Column(Numeric(10, 2), nullable=True)  # Price (optional)
    color = Column(String(7), nullable=False, default="#3B82F6")  # Hex color for calendar
    is_active = Column(Boolean, nullable=False, default=True)

    # Foreign key to clinic
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship
    clinic = relationship("Clinic", back_populates="service_types")

    def __repr__(self):
        return f"<ServiceType {self.name}>"

"""
Appointment model
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class AppointmentStatus(str, enum.Enum):
    """Appointment status enum"""
    SCHEDULED = "scheduled"    # Zakazan
    CONFIRMED = "confirmed"    # Potvrđen
    COMPLETED = "completed"    # Završen
    CANCELLED = "cancelled"    # Otkazan
    NO_SHOW = "no_show"        # Nije se pojavio


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign keys
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    service_type_id = Column(Integer, ForeignKey("service_types.id"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)

    # Appointment details
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=False, index=True)
    status = Column(Enum(AppointmentStatus), nullable=False, default=AppointmentStatus.SCHEDULED)
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient")
    service_type = relationship("ServiceType")
    clinic = relationship("Clinic", back_populates="appointments")

    def __repr__(self):
        return f"<Appointment {self.id} - {self.patient_id} at {self.start_time}>"

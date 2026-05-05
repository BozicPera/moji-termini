"""
Patient model
"""
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    # Foreign key to clinic
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship
    clinic = relationship("Clinic", back_populates="patients")

    def __repr__(self):
        return f"<Patient {self.first_name} {self.last_name}>"

"""
Appointment Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    """Base appointment schema"""
    patient_id: int
    service_type_id: int
    start_time: datetime
    end_time: datetime
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    """Schema for creating an appointment"""
    pass


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment (all fields optional)"""
    patient_id: Optional[int] = None
    service_type_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None


class PatientInfo(BaseModel):
    """Patient info for appointment response"""
    id: int
    first_name: str
    last_name: str
    phone: str

    class Config:
        from_attributes = True


class ServiceTypeInfo(BaseModel):
    """Service type info for appointment response"""
    id: int
    name: str
    duration: int
    color: str

    class Config:
        from_attributes = True


class AppointmentResponse(AppointmentBase):
    """Schema for appointment response with related data"""
    id: int
    clinic_id: int
    patient: PatientInfo
    service_type: ServiceTypeInfo
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

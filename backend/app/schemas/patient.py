"""
Patient Pydantic schemas
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime


class PatientBase(BaseModel):
    """Base patient schema"""
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=9, max_length=20)
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    notes: Optional[str] = None


class PatientCreate(PatientBase):
    """Schema for creating a patient"""
    pass


class PatientUpdate(BaseModel):
    """Schema for updating a patient (all fields optional)"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=9, max_length=20)
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    notes: Optional[str] = None


class PatientResponse(PatientBase):
    """Schema for patient response"""
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

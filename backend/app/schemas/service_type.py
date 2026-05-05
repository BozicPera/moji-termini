"""
Service Type Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class ServiceTypeBase(BaseModel):
    """Base service type schema"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    duration: int = Field(30, ge=5, le=480, description="Duration in minutes")
    price: Optional[Decimal] = Field(None, ge=0, description="Price in RSD")
    color: str = Field("#3B82F6", pattern="^#[0-9A-Fa-f]{6}$", description="Hex color code")
    is_active: bool = True


class ServiceTypeCreate(ServiceTypeBase):
    """Schema for creating a service type"""
    pass


class ServiceTypeUpdate(BaseModel):
    """Schema for updating a service type (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    duration: Optional[int] = Field(None, ge=5, le=480)
    price: Optional[Decimal] = Field(None, ge=0)
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    is_active: Optional[bool] = None


class ServiceTypeResponse(ServiceTypeBase):
    """Schema for service type response"""
    id: int
    clinic_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

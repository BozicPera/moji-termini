"""
User Pydantic schemas
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=6)
    clinic_id: int


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    role: str
    clinic_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

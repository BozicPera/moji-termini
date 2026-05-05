"""
Appointment endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.service_type import ServiceType
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/appointments", response_model=List[AppointmentResponse])
def get_appointments(
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    patient_id: Optional[int] = Query(None, description="Filter by patient"),
    status: Optional[str] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all appointments for current user's clinic

    Args:
        start_date: Optional start date filter
        end_date: Optional end date filter
        patient_id: Optional patient filter
        status: Optional status filter
        current_user: Authenticated user
        db: Database session

    Returns:
        List of appointments
    """
    query = db.query(Appointment).filter(Appointment.clinic_id == current_user.clinic_id)

    # Apply date filters
    if start_date:
        query = query.filter(Appointment.start_time >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Appointment.start_time <= datetime.combine(end_date, datetime.max.time()))

    # Apply patient filter
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)

    # Apply status filter
    if status:
        query = query.filter(Appointment.status == status)

    # Order by start time
    appointments = query.order_by(Appointment.start_time).all()

    return appointments


@router.post("/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new appointment

    Args:
        appointment_data: Appointment data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created appointment

    Raises:
        HTTPException: If validation fails
    """
    # Verify patient belongs to clinic
    patient = db.query(Patient).filter(
        Patient.id == appointment_data.patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    # Verify service type belongs to clinic
    service_type = db.query(ServiceType).filter(
        ServiceType.id == appointment_data.service_type_id,
        ServiceType.clinic_id == current_user.clinic_id
    ).first()

    if not service_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service type not found"
        )

    # Check for time slot conflicts
    conflict = db.query(Appointment).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.status.in_(["scheduled", "confirmed"]),
        or_(
            and_(
                Appointment.start_time <= appointment_data.start_time,
                Appointment.end_time > appointment_data.start_time
            ),
            and_(
                Appointment.start_time < appointment_data.end_time,
                Appointment.end_time >= appointment_data.end_time
            ),
            and_(
                Appointment.start_time >= appointment_data.start_time,
                Appointment.end_time <= appointment_data.end_time
            )
        )
    ).first()

    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is already occupied"
        )

    # Create appointment
    appointment = Appointment(
        **appointment_data.model_dump(),
        clinic_id=current_user.clinic_id
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


@router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific appointment by ID

    Args:
        appointment_id: Appointment ID
        current_user: Authenticated user
        db: Database session

    Returns:
        Appointment data

    Raises:
        HTTPException: If appointment not found
    """
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return appointment


@router.put("/appointments/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an appointment

    Args:
        appointment_id: Appointment ID
        appointment_data: Updated appointment data
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated appointment

    Raises:
        HTTPException: If appointment not found or validation fails
    """
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Check for time slot conflicts if time is being changed
    if appointment_data.start_time or appointment_data.end_time:
        new_start = appointment_data.start_time or appointment.start_time
        new_end = appointment_data.end_time or appointment.end_time

        conflict = db.query(Appointment).filter(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.id != appointment_id,
            Appointment.status.in_(["scheduled", "confirmed"]),
            or_(
                and_(
                    Appointment.start_time <= new_start,
                    Appointment.end_time > new_start
                ),
                and_(
                    Appointment.start_time < new_end,
                    Appointment.end_time >= new_end
                ),
                and_(
                    Appointment.start_time >= new_start,
                    Appointment.end_time <= new_end
                )
            )
        ).first()

        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Time slot is already occupied"
            )

    # Update appointment fields
    update_data = appointment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)

    db.commit()
    db.refresh(appointment)

    return appointment


@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an appointment

    Args:
        appointment_id: Appointment ID
        current_user: Authenticated user
        db: Database session

    Raises:
        HTTPException: If appointment not found
    """
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    db.delete(appointment)
    db.commit()

    return None

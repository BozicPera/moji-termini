"""
Patient endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/patients", response_model=List[PatientResponse])
def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by name, phone, or email"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all patients for current user's clinic

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        search: Optional search query
        current_user: Authenticated user
        db: Database session

    Returns:
        List of patients
    """
    query = db.query(Patient).filter(Patient.clinic_id == current_user.clinic_id)

    # Apply search filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Patient.first_name.ilike(search_filter)) |
            (Patient.last_name.ilike(search_filter)) |
            (Patient.phone.ilike(search_filter)) |
            (Patient.email.ilike(search_filter))
        )

    # Apply pagination
    patients = query.order_by(Patient.last_name, Patient.first_name).offset(skip).limit(limit).all()

    return patients


@router.post("/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_data: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new patient

    Args:
        patient_data: Patient data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created patient
    """
    # Check if patient with same phone already exists in clinic
    existing_patient = db.query(Patient).filter(
        Patient.clinic_id == current_user.clinic_id,
        Patient.phone == patient_data.phone
    ).first()

    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient with this phone number already exists"
        )

    # Create patient
    patient = Patient(
        **patient_data.model_dump(),
        clinic_id=current_user.clinic_id
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific patient by ID

    Args:
        patient_id: Patient ID
        current_user: Authenticated user
        db: Database session

    Returns:
        Patient data

    Raises:
        HTTPException: If patient not found or doesn't belong to user's clinic
    """
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    return patient


@router.put("/patients/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a patient

    Args:
        patient_id: Patient ID
        patient_data: Updated patient data
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated patient

    Raises:
        HTTPException: If patient not found or doesn't belong to user's clinic
    """
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    # Check if phone number is being changed and already exists
    if patient_data.phone and patient_data.phone != patient.phone:
        existing_patient = db.query(Patient).filter(
            Patient.clinic_id == current_user.clinic_id,
            Patient.phone == patient_data.phone,
            Patient.id != patient_id
        ).first()

        if existing_patient:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient with this phone number already exists"
            )

    # Update patient fields
    update_data = patient_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return patient


@router.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a patient

    Args:
        patient_id: Patient ID
        current_user: Authenticated user
        db: Database session

    Raises:
        HTTPException: If patient not found or doesn't belong to user's clinic
    """
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return None

"""
Service Type endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.service_type import ServiceType
from app.schemas.service_type import ServiceTypeCreate, ServiceTypeUpdate, ServiceTypeResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/service-types", response_model=List[ServiceTypeResponse])
def get_service_types(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(False, description="Show only active service types"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all service types for current user's clinic

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        active_only: Filter only active service types
        current_user: Authenticated user
        db: Database session

    Returns:
        List of service types
    """
    query = db.query(ServiceType).filter(ServiceType.clinic_id == current_user.clinic_id)

    # Apply active filter
    if active_only:
        query = query.filter(ServiceType.is_active == True)

    # Apply pagination and ordering
    service_types = query.order_by(ServiceType.name).offset(skip).limit(limit).all()

    return service_types


@router.post("/service-types", response_model=ServiceTypeResponse, status_code=status.HTTP_201_CREATED)
def create_service_type(
    service_type_data: ServiceTypeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new service type

    Args:
        service_type_data: Service type data
        current_user: Authenticated user
        db: Database session

    Returns:
        Created service type
    """
    # Check if service type with same name already exists in clinic
    existing_service_type = db.query(ServiceType).filter(
        ServiceType.clinic_id == current_user.clinic_id,
        ServiceType.name == service_type_data.name
    ).first()

    if existing_service_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service type with this name already exists"
        )

    # Create service type
    service_type = ServiceType(
        **service_type_data.model_dump(),
        clinic_id=current_user.clinic_id
    )

    db.add(service_type)
    db.commit()
    db.refresh(service_type)

    return service_type


@router.get("/service-types/{service_type_id}", response_model=ServiceTypeResponse)
def get_service_type(
    service_type_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific service type by ID

    Args:
        service_type_id: Service type ID
        current_user: Authenticated user
        db: Database session

    Returns:
        Service type data

    Raises:
        HTTPException: If service type not found or doesn't belong to user's clinic
    """
    service_type = db.query(ServiceType).filter(
        ServiceType.id == service_type_id,
        ServiceType.clinic_id == current_user.clinic_id
    ).first()

    if not service_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service type not found"
        )

    return service_type


@router.put("/service-types/{service_type_id}", response_model=ServiceTypeResponse)
def update_service_type(
    service_type_id: int,
    service_type_data: ServiceTypeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a service type

    Args:
        service_type_id: Service type ID
        service_type_data: Updated service type data
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated service type

    Raises:
        HTTPException: If service type not found or doesn't belong to user's clinic
    """
    service_type = db.query(ServiceType).filter(
        ServiceType.id == service_type_id,
        ServiceType.clinic_id == current_user.clinic_id
    ).first()

    if not service_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service type not found"
        )

    # Check if name is being changed and already exists
    if service_type_data.name and service_type_data.name != service_type.name:
        existing_service_type = db.query(ServiceType).filter(
            ServiceType.clinic_id == current_user.clinic_id,
            ServiceType.name == service_type_data.name,
            ServiceType.id != service_type_id
        ).first()

        if existing_service_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Service type with this name already exists"
            )

    # Update service type fields
    update_data = service_type_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service_type, field, value)

    db.commit()
    db.refresh(service_type)

    return service_type


@router.delete("/service-types/{service_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service_type(
    service_type_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a service type

    Args:
        service_type_id: Service type ID
        current_user: Authenticated user
        db: Database session

    Raises:
        HTTPException: If service type not found or doesn't belong to user's clinic
    """
    service_type = db.query(ServiceType).filter(
        ServiceType.id == service_type_id,
        ServiceType.clinic_id == current_user.clinic_id
    ).first()

    if not service_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service type not found"
        )

    db.delete(service_type)
    db.commit()

    return None

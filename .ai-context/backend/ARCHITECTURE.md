# Backend Architecture - Moji Termini

## Overview

**Pattern:** Layered Architecture (Routes → Services → Models)  
**Framework:** FastAPI  
**Database ORM:** SQLAlchemy 2.0  
**Authentication:** JWT-based

---

## Architecture Layers

```
┌─────────────────────────────────────┐
│   API Layer (Routes/Endpoints)     │  ← HTTP requests/responses
├─────────────────────────────────────┤
│   Service Layer (Business Logic)   │  ← Orchestration, validation
├─────────────────────────────────────┤
│   Data Access Layer (Models/ORM)   │  ← Database queries
├─────────────────────────────────────┤
│   Database (PostgreSQL)             │  ← Data storage
└─────────────────────────────────────┘

External:
├── SMS Gateway (Serpent.rs)          ← Background jobs
└── Scheduler (APScheduler)           ← Cron jobs
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app initialization
│   ├── config.py                     # Settings (Pydantic BaseSettings)
│   ├── database.py                   # SQLAlchemy setup, session management
│   │
│   ├── models/                       # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py                   # User model
│   │   ├── clinic.py                 # Clinic model
│   │   ├── patient.py                # Patient model
│   │   ├── service_type.py           # ServiceType model
│   │   ├── appointment.py            # Appointment model
│   │   └── sms_log.py                # SMSLog model
│   │
│   ├── schemas/                      # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py                   # UserCreate, UserResponse, etc.
│   │   ├── patient.py                # PatientCreate, PatientResponse
│   │   ├── appointment.py            # AppointmentCreate, AppointmentResponse
│   │   ├── service_type.py           # ServiceTypeCreate, ServiceTypeResponse
│   │   └── auth.py                   # LoginRequest, TokenResponse
│   │
│   ├── api/                          # API routes
│   │   ├── __init__.py
│   │   ├── deps.py                   # Dependency injection (get_db, get_current_user)
│   │   └── v1/                       # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py               # POST /login, GET /me
│   │       ├── patients.py           # CRUD for patients
│   │       ├── appointments.py       # CRUD for appointments + calendar
│   │       ├── services.py           # CRUD for service types
│   │       ├── clinic.py             # GET/PUT clinic settings
│   │       └── stats.py              # GET statistics
│   │
│   ├── services/                     # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py           # Authentication logic (JWT, password)
│   │   ├── patient_service.py        # Patient CRUD logic
│   │   ├── appointment_service.py    # Appointment logic (validation, conflicts)
│   │   ├── service_type_service.py   # Service type logic
│   │   ├── clinic_service.py         # Clinic settings logic
│   │   ├── stats_service.py          # Statistics calculation
│   │   └── sms_service.py            # SMS gateway integration
│   │
│   ├── utils/                        # Utility functions
│   │   ├── __init__.py
│   │   ├── security.py               # Password hashing, JWT creation/validation
│   │   └── datetime_helpers.py       # Date/time utilities
│   │
│   └── tasks/                        # Background jobs
│       ├── __init__.py
│       └── sms_reminders.py          # APScheduler job for SMS reminders
│
├── alembic/                          # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/                            # Tests
│   ├── __init__.py
│   ├── conftest.py                   # Test fixtures
│   ├── test_auth.py
│   ├── test_patients.py
│   └── test_appointments.py
│
├── requirements.txt                  # Python dependencies
├── .env                              # Environment variables (not committed)
├── .env.example                      # Example env vars
└── alembic.ini                       # Alembic configuration
```

---

## Layer Responsibilities

### 1. API Layer (`app/api/v1/`)

**Purpose:** Handle HTTP requests/responses

**Responsibilities:**
- Define API endpoints (routes)
- Parse request data (path params, query params, body)
- Validate input using Pydantic schemas
- Call service layer for business logic
- Return HTTP responses (200, 404, 500, etc.)
- Handle authentication/authorization (via dependencies)

**Example:**
```python
# app/api/v1/patients.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.patient_service import PatientService

router = APIRouter()

@router.post("/patients", response_model=PatientResponse, status_code=201)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = PatientService(db)
    patient = service.create_patient(patient_data, current_user.clinic_id)
    return patient
```

**Key Principles:**
- ✅ Thin controllers - minimal logic, delegate to services
- ✅ Use dependency injection (Depends)
- ✅ Return Pydantic schemas (not SQLAlchemy models directly)
- ✅ Handle exceptions with HTTPException

---

### 2. Service Layer (`app/services/`)

**Purpose:** Business logic and orchestration

**Responsibilities:**
- Implement business rules and validation
- Coordinate between multiple models/services
- Transaction management
- Error handling (raise domain-specific errors)
- Call external services (SMS gateway, email, etc.)

**Example:**
```python
# app/services/appointment_service.py

from datetime import datetime
from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate
from fastapi import HTTPException

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_appointment(
        self, 
        data: AppointmentCreate, 
        clinic_id: int
    ) -> Appointment:
        # Business logic: check for conflicts
        existing = self.db.query(Appointment).filter(
            Appointment.clinic_id == clinic_id,
            Appointment.appointment_date == data.appointment_date,
            Appointment.appointment_time == data.appointment_time,
            Appointment.status == "scheduled"
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=409, 
                detail="Time slot already booked"
            )
        
        # Create appointment
        appointment = Appointment(
            clinic_id=clinic_id,
            patient_id=data.patient_id,
            service_type_id=data.service_type_id,
            appointment_date=data.appointment_date,
            appointment_time=data.appointment_time,
            reason_for_visit=data.reason_for_visit,
            notes=data.notes
        )
        
        self.db.add(appointment)
        self.db.commit()
        self.db.refresh(appointment)
        
        return appointment
```

**Key Principles:**
- ✅ Single Responsibility - one service per domain entity
- ✅ Stateless - no instance variables (except db session)
- ✅ Testable - easy to mock dependencies
- ✅ Reusable - can be called from multiple routes

---

### 3. Data Access Layer (`app/models/`)

**Purpose:** Database schema and ORM models

**Responsibilities:**
- Define database tables (SQLAlchemy models)
- Define relationships (ForeignKey, relationship)
- Data validation at DB level (constraints, defaults)

**Example:**
```python
# app/models/appointment.py

from sqlalchemy import Column, Integer, String, Date, Time, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    service_type_id = Column(Integer, ForeignKey("service_types.id"), nullable=False)
    
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    duration = Column(Integer, default=30)
    
    reason_for_visit = Column(Text)
    notes = Column(Text)
    
    status = Column(String(50), default="scheduled")
    sms_sent = Column(Boolean, default=False)
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    service_type = relationship("ServiceType")
    clinic = relationship("Clinic")
```

**Key Principles:**
- ✅ One model per table
- ✅ Use relationships for joins (avoid manual JOINs)
- ✅ Add indexes for frequently queried columns
- ✅ Use database constraints (nullable, unique, ForeignKey)

---

### 4. Schema Layer (`app/schemas/`)

**Purpose:** Request/response data validation

**Responsibilities:**
- Define API request schemas (Pydantic models)
- Define API response schemas
- Data validation (types, formats, ranges)
- Serialization/deserialization

**Example:**
```python
# app/schemas/appointment.py

from pydantic import BaseModel, Field
from datetime import date, time
from typing import Optional

# Request schemas (input)
class AppointmentCreate(BaseModel):
    patient_id: int
    service_type_id: int
    appointment_date: date
    appointment_time: time
    reason_for_visit: Optional[str] = None
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    reason_for_visit: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

# Response schemas (output)
class AppointmentResponse(BaseModel):
    id: int
    clinic_id: int
    patient_id: int
    service_type_id: int
    appointment_date: date
    appointment_time: time
    duration: int
    reason_for_visit: Optional[str]
    notes: Optional[str]
    status: str
    sms_sent: bool
    
    class Config:
        from_attributes = True  # For SQLAlchemy compatibility
```

**Key Principles:**
- ✅ Separate Create, Update, Response schemas
- ✅ Use `from_attributes = True` to work with SQLAlchemy models
- ✅ Validate data at API boundary (not in service layer)

---

## Dependency Injection

**Located in:** `app/api/deps.py`

### Database Session

```python
# app/api/deps.py

from app.database import SessionLocal
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Usage:**
```python
@router.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()
```

### Current User Authentication

```python
# app/api/deps.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_jwt
from app.models.user import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_jwt(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
```

**Usage:**
```python
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

---

## Authentication Flow

```
1. User sends POST /auth/login with email/password
   ↓
2. API validates credentials (check password hash)
   ↓
3. If valid, create JWT token (contains user_id, clinic_id)
   ↓
4. Return token to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client includes token in all subsequent requests:
   Authorization: Bearer <token>
   ↓
7. get_current_user dependency validates token
   ↓
8. If valid, inject current_user into route handler
```

**JWT Token Payload:**
```json
{
  "sub": "1",            // user_id
  "clinic_id": 5,
  "exp": 1672531200      // expiration timestamp
}
```

---

## Database Session Management

### Session Lifecycle

```python
# Per-request session (via dependency injection)
@router.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    # db session is created at request start
    patients = db.query(Patient).all()
    # db session is closed at request end (in finally block)
    return patients
```

### Transaction Management

**Automatic commit in services:**
```python
# Service method
def create_patient(self, data: PatientCreate) -> Patient:
    patient = Patient(**data.dict())
    self.db.add(patient)
    self.db.commit()           # Explicit commit
    self.db.refresh(patient)   # Refresh to get DB-generated values
    return patient
```

**Rollback on error:**
```python
def create_multiple_patients(self, patients_data: list):
    try:
        for data in patients_data:
            patient = Patient(**data.dict())
            self.db.add(patient)
        self.db.commit()
    except Exception as e:
        self.db.rollback()     # Rollback on error
        raise
```

---

## Background Jobs (APScheduler)

**Located in:** `app/tasks/sms_reminders.py`

### Job Definition

```python
# app/tasks/sms_reminders.py

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import date, timedelta

async def send_appointment_reminders():
    """
    Runs every hour, sends SMS for appointments tomorrow
    """
    tomorrow = date.today() + timedelta(days=1)
    
    # Query appointments
    # Send SMS
    # Update sms_sent flag

def start_scheduler():
    scheduler = AsyncIOScheduler()
    
    # Run every hour
    scheduler.add_job(
        send_appointment_reminders,
        trigger="cron",
        hour="*",
        minute=0
    )
    
    scheduler.start()
    return scheduler
```

### Initialize in FastAPI

```python
# app/main.py

from fastapi import FastAPI
from app.tasks.sms_reminders import start_scheduler

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    start_scheduler()
```

---

## Error Handling

### HTTP Exceptions

```python
from fastapi import HTTPException

# 404 Not Found
raise HTTPException(status_code=404, detail="Patient not found")

# 400 Bad Request
raise HTTPException(status_code=400, detail="Invalid phone number")

# 401 Unauthorized
raise HTTPException(status_code=401, detail="Invalid credentials")

# 409 Conflict
raise HTTPException(status_code=409, detail="Time slot already booked")
```

### Global Exception Handler

```python
# app/main.py

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

---

## Database Migrations (Alembic)

### Create Migration

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "add sms_log table"
```

### Apply Migration

```bash
# Upgrade to latest
alembic upgrade head

# Upgrade one step
alembic upgrade +1
```

### Rollback Migration

```bash
# Downgrade one step
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade abc123
```

### Migration File Structure

```python
# alembic/versions/abc123_add_sms_log_table.py

def upgrade():
    op.create_table(
        'sms_log',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('appointment_id', sa.Integer(), sa.ForeignKey('appointments.id')),
        sa.Column('phone', sa.String(50)),
        sa.Column('message', sa.Text()),
        sa.Column('status', sa.String(50)),
        sa.Column('sent_at', sa.TIMESTAMP(), server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('sms_log')
```

---

## Testing Strategy

### Test Structure

```
tests/
├── conftest.py              # Fixtures (test DB, test client)
├── test_auth.py             # Auth endpoint tests
├── test_patients.py         # Patient CRUD tests
└── test_appointments.py     # Appointment logic tests
```

### Test Database

```python
# tests/conftest.py

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app
from app.api.deps import get_db

TEST_DATABASE_URL = "postgresql://test:test@localhost:5432/test_db"

@pytest.fixture
def db():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    
    yield db
    
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        yield db
    
    app.dependency_overrides[get_db] = override_get_db
    
    from fastapi.testclient import TestClient
    yield TestClient(app)
```

### Example Test

```python
# tests/test_patients.py

def test_create_patient(client, db):
    response = client.post(
        "/api/v1/patients",
        json={
            "full_name": "Test Patient",
            "phone": "+381641234567",
            "email": "test@example.com"
        },
        headers={"Authorization": "Bearer <test_token>"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Test Patient"
    assert data["phone"] == "+381641234567"
```

---

## Performance Considerations

### Database Query Optimization

**Use eager loading to avoid N+1 queries:**
```python
# Bad - N+1 queries
appointments = db.query(Appointment).all()
for appt in appointments:
    print(appt.patient.full_name)  # Separate query each time

# Good - eager loading
from sqlalchemy.orm import joinedload

appointments = (
    db.query(Appointment)
    .options(joinedload(Appointment.patient))
    .all()
)
for appt in appointments:
    print(appt.patient.full_name)  # No extra queries
```

### Connection Pooling

```python
# app/database.py

from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=10,           # Number of connections to maintain
    max_overflow=20,        # Max connections beyond pool_size
    pool_pre_ping=True      # Check connection health
)
```

### Indexing

```python
# Add indexes for frequently queried columns

# In models
class Appointment(Base):
    __tablename__ = "appointments"
    
    appointment_date = Column(Date, nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
```

---

## Security Best Practices

1. **Never commit secrets** - use environment variables
2. **Hash passwords** - use bcrypt (never store plaintext)
3. **Validate all inputs** - use Pydantic schemas
4. **Use parameterized queries** - SQLAlchemy ORM prevents SQL injection
5. **Implement rate limiting** (future) - prevent abuse
6. **Use HTTPS** - encrypt data in transit
7. **Set JWT expiration** - don't use infinite tokens

---

**Last Updated:** 2026-05-04  
**Maintained By:** Backend Team

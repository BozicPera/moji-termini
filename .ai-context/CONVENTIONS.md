# Code Conventions - Moji Termini

## General Principles

1. **Readability over cleverness** - Code is read more than written
2. **Explicit over implicit** - Prefer clarity over magic
3. **Consistency** - Follow existing patterns in the codebase
4. **KISS** - Keep it simple, avoid premature optimization
5. **DRY** - Don't repeat yourself (but don't over-abstract)

---

## Python (Backend) Conventions

### Code Formatting

**Tool:** Black (line length: 100)

```bash
# Format all files
black app/

# Check formatting
black --check app/
```

**Settings (pyproject.toml):**
```toml
[tool.black]
line-length = 100
target-version = ['py311']
```

### Linting

**Tool:** Ruff

```bash
# Lint code
ruff check app/

# Auto-fix
ruff check --fix app/
```

### Import Order

**Standard order (enforced by Ruff):**
1. Standard library imports
2. Third-party imports
3. Local application imports

**Example:**
```python
# Standard library
import os
from datetime import datetime
from typing import Optional

# Third-party
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Local
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate
from app.api.deps import get_current_user
```

### Naming Conventions

**Variables & Functions:** `snake_case`
```python
def get_appointments(clinic_id: int) -> list[Appointment]:
    appointment_list = []
    return appointment_list
```

**Classes:** `PascalCase`
```python
class AppointmentService:
    pass

class User:
    pass
```

**Constants:** `UPPER_SNAKE_CASE`
```python
MAX_RETRIES = 3
SMS_TIMEOUT = 10
DEFAULT_SLOT_DURATION = 30
```

**Private attributes/methods:** Prefix with `_`
```python
class UserService:
    def _hash_password(self, password: str) -> str:
        return hash(password)
```

### Type Hints

**Always use type hints for:**
- Function parameters
- Function return values
- Class attributes

```python
# Good
def create_appointment(
    patient_id: int,
    date: str,
    time: str
) -> Appointment:
    pass

# Bad
def create_appointment(patient_id, date, time):
    pass
```

**Use Optional for nullable values:**
```python
from typing import Optional

def find_patient(patient_id: int) -> Optional[Patient]:
    return db.query(Patient).filter(Patient.id == patient_id).first()
```

**Use modern syntax (Python 3.10+):**
```python
# Good (Python 3.10+)
def get_list() -> list[str]:
    pass

def get_optional(id: int) -> Patient | None:
    pass

# Old style (avoid)
from typing import List, Optional
def get_list() -> List[str]:
    pass
```

### Docstrings

**Use for:**
- Complex functions
- Public API endpoints
- Service methods
- Utility functions

**Format:** Google style

```python
def send_sms_reminder(appointment: Appointment) -> bool:
    """
    Send SMS reminder to patient for an appointment.
    
    Args:
        appointment: The appointment to send reminder for
        
    Returns:
        True if SMS sent successfully, False otherwise
        
    Raises:
        SMSGatewayError: If SMS gateway is unavailable
    """
    pass
```

**Don't over-document:**
```python
# Bad - obvious function
def get_patient_name(patient: Patient) -> str:
    """
    Gets the patient name.
    
    Args:
        patient: The patient object
        
    Returns:
        The patient's name
    """
    return patient.full_name

# Good - no docstring needed
def get_patient_name(patient: Patient) -> str:
    return patient.full_name
```

### Error Handling

**Be specific with exceptions:**
```python
# Good
try:
    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
except SQLAlchemyError as e:
    logger.error(f"Database error: {e}")
    raise HTTPException(status_code=500, detail="Database error")

# Bad - catching everything
try:
    appointment = get_appointment(id)
except Exception:
    pass
```

**Use HTTPException for API errors:**
```python
from fastapi import HTTPException

# 404 Not Found
raise HTTPException(status_code=404, detail="Patient not found")

# 400 Bad Request
raise HTTPException(status_code=400, detail="Invalid phone number format")

# 401 Unauthorized
raise HTTPException(status_code=401, detail="Invalid credentials")
```

### Logging

**Use Python logging module:**
```python
import logging

logger = logging.getLogger(__name__)

# Log levels
logger.debug("Debug info")
logger.info("User logged in")
logger.warning("SMS quota at 80%")
logger.error("Failed to send SMS")
logger.critical("Database connection lost")
```

**Log format:**
```python
# Good - include context
logger.info(f"Appointment created: id={appointment.id}, patient={patient.full_name}")

# Bad - not enough context
logger.info("Appointment created")
```

### Database Queries

**Use SQLAlchemy ORM (not raw SQL):**
```python
# Good
patients = db.query(Patient).filter(Patient.clinic_id == clinic_id).all()

# Bad (avoid raw SQL)
patients = db.execute("SELECT * FROM patients WHERE clinic_id = ?", clinic_id)
```

**Optimize queries:**
```python
# Good - eager loading
appointments = (
    db.query(Appointment)
    .options(joinedload(Appointment.patient))
    .options(joinedload(Appointment.service_type))
    .filter(Appointment.clinic_id == clinic_id)
    .all()
)

# Bad - N+1 query problem
appointments = db.query(Appointment).filter(Appointment.clinic_id == clinic_id).all()
for appt in appointments:
    print(appt.patient.full_name)  # Triggers separate query each time
```

### File Structure

**One class per file (models, schemas):**
```
models/
├── user.py          # User model only
├── patient.py       # Patient model only
└── appointment.py   # Appointment model only
```

**Group related functions:**
```python
# app/services/appointment_service.py
class AppointmentService:
    def create_appointment(self, ...):
        pass
    
    def update_appointment(self, ...):
        pass
    
    def delete_appointment(self, ...):
        pass
```

---

## TypeScript (Frontend) Conventions

### Code Formatting

**Tool:** Prettier

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

**Settings (.prettierrc):**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Linting

**Tool:** ESLint

```bash
# Lint code
npm run lint

# Auto-fix
npm run lint:fix
```

### Naming Conventions

**Variables & Functions:** `camelCase`
```typescript
const patientList = [];
function getAppointments() {}
```

**Components & Types:** `PascalCase`
```typescript
function PatientList() {}
interface Appointment {}
type AppointmentStatus = 'scheduled' | 'completed';
```

**Constants:** `UPPER_SNAKE_CASE`
```typescript
const API_BASE_URL = 'http://localhost:8000';
const MAX_APPOINTMENTS_PER_DAY = 20;
```

**Private class members:** Prefix with `#` (or `_` for TypeScript convention)
```typescript
class UserService {
  #apiKey: string;
  
  private hashPassword(password: string): string {
    return hash(password);
  }
}
```

### Type Annotations

**Always define types:**
```typescript
// Good
interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
}

function createPatient(data: Patient): Promise<Patient> {
  return api.post('/patients', data);
}

// Bad
function createPatient(data) {
  return api.post('/patients', data);
}
```

**Use `interface` for objects, `type` for unions/primitives:**
```typescript
// Interfaces for objects
interface Appointment {
  id: number;
  date: string;
  time: string;
}

// Types for unions
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

// Types for utility types
type PartialAppointment = Partial<Appointment>;
```

**Prefer explicit over implicit:**
```typescript
// Good
const appointments: Appointment[] = [];

// Acceptable if type is obvious
const name = 'John'; // string inferred
```

### React Component Structure

**Functional components with TypeScript:**
```typescript
import React from 'react';

interface PatientCardProps {
  patient: Patient;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PatientCard({ patient, onEdit, onDelete }: PatientCardProps) {
  return (
    <div className="patient-card">
      <h3>{patient.full_name}</h3>
      <p>{patient.phone}</p>
      <button onClick={() => onEdit(patient.id)}>Edit</button>
      <button onClick={() => onDelete(patient.id)}>Delete</button>
    </div>
  );
}
```

**Component file structure:**
```typescript
// Imports (grouped)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPatients } from '@/api/patients';
import { PatientCard } from '@/components/patients/PatientCard';

// Types/Interfaces
interface PatientsPageProps {
  initialFilter?: string;
}

// Component
export function PatientsPage({ initialFilter }: PatientsPageProps) {
  // State
  const [filter, setFilter] = useState(initialFilter || '');
  
  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['patients', filter],
    queryFn: () => fetchPatients(filter),
  });
  
  // Effects
  useEffect(() => {
    // ...
  }, [filter]);
  
  // Event handlers
  const handleSearch = (value: string) => {
    setFilter(value);
  };
  
  // Early returns
  if (isLoading) return <Spinner />;
  if (!data) return <Error />;
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Hooks

**Custom hooks start with `use`:**
```typescript
// useAppointments.ts
export function useAppointments(date: string) {
  return useQuery({
    queryKey: ['appointments', date],
    queryFn: () => fetchAppointments(date),
  });
}
```

**Hook dependencies:**
```typescript
// Good - all dependencies listed
useEffect(() => {
  fetchData(id, filter);
}, [id, filter]);

// Bad - missing dependencies (ESLint will warn)
useEffect(() => {
  fetchData(id, filter);
}, [id]);
```

### File Naming

**Components:** `PascalCase.tsx`
```
PatientList.tsx
AppointmentForm.tsx
DayView.tsx
```

**Utilities, hooks, API:** `camelCase.ts`
```
useAppointments.ts
dateHelpers.ts
formatters.ts
```

**Pages:** `PascalCase.tsx` with `Page` suffix
```
LoginPage.tsx
CalendarPage.tsx
PatientsPage.tsx
```

### Imports

**Use absolute imports with `@/` alias:**
```typescript
// Good
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { Appointment } from '@/types/appointment';

// Bad
import { Button } from '../../../components/common/Button';
```

**vite.config.ts:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Comments

**JSDoc for complex functions:**
```typescript
/**
 * Generate time slots for a given date based on clinic settings
 * @param date - The date to generate slots for
 * @param settings - Clinic settings (working hours, slot duration)
 * @returns Array of time slot strings (e.g., ['09:00', '09:30', ...])
 */
export function generateTimeSlots(
  date: Date,
  settings: ClinicSettings
): string[] {
  // Implementation
}
```

**Inline comments for non-obvious logic:**
```typescript
// Filter out appointments that are more than 30 days old
const recentAppointments = appointments.filter(
  (appt) => differenceInDays(new Date(), parseISO(appt.date)) <= 30
);
```

### Error Handling

**Try-catch in async functions:**
```typescript
async function createAppointment(data: AppointmentCreateInput) {
  try {
    const response = await api.post('/appointments', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle API errors
      const message = error.response?.data?.detail || 'Failed to create appointment';
      throw new Error(message);
    }
    throw error;
  }
}
```

**React Query error handling:**
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['appointments'],
  queryFn: fetchAppointments,
});

if (isError) {
  return <ErrorAlert message={error.message} />;
}
```

---

## Git Conventions

### Branch Naming

**Format:** `<type>/<description>`

**Types:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation only
- `test/` - Adding tests
- `chore/` - Build, dependencies, etc.

**Examples:**
```
feature/appointment-calendar
fix/sms-reminder-timezone
refactor/patient-service
docs/api-documentation
test/appointment-validation
chore/update-dependencies
```

### Commit Messages

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Build, dependencies
- `style:` - Formatting (not CSS)

**Examples:**
```
feat: add SMS reminder background job
fix: prevent double booking on same time slot
refactor: extract appointment validation logic
docs: update API endpoint documentation
test: add tests for patient service
chore: update FastAPI to 0.110.0
style: format code with Black
```

**Good commit messages:**
```
✅ feat: add patient search by phone number
✅ fix: timezone issue in SMS reminder scheduling
✅ refactor: simplify appointment creation logic
✅ docs: add API usage examples to README

❌ update code
❌ fix bug
❌ changes
```

### Pull Request Titles

**Same format as commit messages:**
```
feat: Add appointment calendar view
fix: Resolve SMS sending timeout issue
refactor: Improve database query performance
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
- [ ] Manual testing completed
- [ ] Tests added/updated

## Screenshots (if UI changes)
[Screenshots here]
```

---

## API Conventions

### REST Endpoints

**Naming:** Use plural nouns, lowercase, hyphens for multi-word
```
✅ GET /api/v1/appointments
✅ POST /api/v1/service-types
✅ GET /api/v1/patients/{id}

❌ GET /api/v1/getAppointments
❌ POST /api/v1/create_patient
```

### HTTP Methods

- `GET` - Retrieve resource(s)
- `POST` - Create resource
- `PUT` - Update entire resource (replace)
- `PATCH` - Partial update (rarely used in this project)
- `DELETE` - Delete resource

### Status Codes

**Success:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE (no body)

**Client Errors:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Conflict (e.g., double booking)

**Server Errors:**
- `500 Internal Server Error` - Unexpected error

### Response Format

**Success (single resource):**
```json
{
  "id": 1,
  "full_name": "Marko Marković",
  "phone": "+381641234567"
}
```

**Success (list):**
```json
{
  "total": 2,
  "patients": [
    { "id": 1, "full_name": "Marko Marković" },
    { "id": 2, "full_name": "Ana Anić" }
  ]
}
```

**Error:**
```json
{
  "detail": "Patient not found"
}
```

**Validation Error (FastAPI default):**
```json
{
  "detail": [
    {
      "loc": ["body", "phone"],
      "msg": "Invalid phone number format",
      "type": "value_error"
    }
  ]
}
```

---

## Database Conventions

### Table Names

**Lowercase, plural, snake_case:**
```sql
users
patients
appointments
service_types
sms_log
```

### Column Names

**Lowercase, snake_case:**
```sql
id
full_name
appointment_date
appointment_time
created_at
updated_at
```

### Timestamps

**Always include:**
- `created_at TIMESTAMP DEFAULT NOW()`
- `updated_at TIMESTAMP` (optional, for resources that change)

### Foreign Keys

**Naming:** `<table>_id`
```sql
patient_id
clinic_id
service_type_id
```

### Indexes

**Naming:** `idx_<table>_<column(s)>`
```sql
idx_patients_clinic_id
idx_appointments_date
idx_appointments_date_time
```

---

## File Organization

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Settings
│   ├── database.py             # DB connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   └── appointment.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── patient.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependencies (auth, DB)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── patients.py
│   │       └── appointments.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── patient_service.py
│   │   └── sms_service.py
│   ├── utils/                  # Utilities
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── datetime_helpers.py
│   └── tasks/                  # Background jobs
│       ├── __init__.py
│       └── sms_reminders.py
├── tests/
├── alembic/                    # Migrations
├── requirements.txt
└── .env
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── patients/
│   │   ├── appointments/
│   │   └── common/             # Reusable components
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── PatientsPage.tsx
│   ├── api/                    # API client
│   │   ├── client.ts           # Axios setup
│   │   ├── patients.ts
│   │   └── appointments.ts
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useAppointments.ts
│   ├── types/                  # TypeScript types
│   │   ├── index.ts
│   │   ├── patient.ts
│   │   └── appointment.ts
│   ├── utils/                  # Utilities
│   │   ├── dateHelpers.ts
│   │   └── formatters.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── vite.config.ts
```

---

## Testing Conventions

### Backend Tests

**File naming:** `test_<module>.py`
```
tests/
├── test_auth.py
├── test_patients.py
└── test_appointments.py
```

**Test naming:** `test_<what_it_does>`
```python
def test_create_patient_success():
    pass

def test_create_patient_invalid_phone():
    pass

def test_login_with_invalid_credentials():
    pass
```

### Frontend Tests (Post-MVP)

**File naming:** `<Component>.test.tsx`
```
PatientCard.test.tsx
AppointmentForm.test.tsx
```

---

## Environment Variables

**Naming:** `UPPER_SNAKE_CASE`
```bash
DATABASE_URL=...
JWT_SECRET=...
SMS_API_KEY=...
VITE_API_URL=...
```

**Never commit `.env` files** - use `.env.example` as template

---

## Documentation

### README Structure

1. Project Title & Description
2. Features
3. Tech Stack
4. Setup Instructions
5. Usage
6. API Documentation (link to OpenAPI)
7. Contributing
8. License

### Code Comments

**When to comment:**
- ✅ Complex algorithms
- ✅ Non-obvious business logic
- ✅ Workarounds for bugs/limitations
- ✅ Why a decision was made (not what the code does)

**When NOT to comment:**
- ❌ Obvious code
- ❌ Repeating what the code says
- ❌ Outdated comments

```python
# Bad
# Loop through patients
for patient in patients:
    # Print patient name
    print(patient.full_name)

# Good
# Serbian phone numbers must include country code (+381) for SMS gateway
if not phone.startswith('+381'):
    raise ValueError('Phone must include +381 country code')
```

---

**Last Updated:** 2026-05-04  
**Enforced By:** Black, Ruff, Prettier, ESLint  
**Review:** Update when team conventions change

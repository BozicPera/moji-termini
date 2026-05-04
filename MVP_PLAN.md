# Moji Termini - MVP Plan

**Version:** 1.0  
**Last Updated:** 2026-05-04  
**Target Market:** Small clinics in Serbia (dental, general practice, physiotherapy)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [MVP Scope](#mvp-scope)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Structure](#frontend-structure)
6. [Key User Flows](#key-user-flows)
7. [Tech Stack](#tech-stack)
8. [Development Phases](#development-phases)
9. [Deployment Architecture](#deployment-architecture)
10. [SMS Integration](#sms-integration)

---

## Project Overview

### Problem Statement
Small clinics in Serbia struggle with:
- ❌ Double bookings and scheduling conflicts
- ❌ Patients forgetting appointments
- ❌ Constant phone call interruptions
- ❌ Chaotic paper calendars
- ❌ No automated reminders

### Solution
"Moji Termini" - A simple, web-based appointment scheduling system with automated SMS reminders.

### Target Users
- **Primary:** Solo practitioners and small clinics (1-3 staff members)
- **Clinic Types:** Dental, general practice, physiotherapy
- **Setup:** Typically one treatment room with fixed time slots

---

## MVP Scope

### ✅ Version 1.0 Features (MVP)

1. **Authentication & User Management**
   - Staff login with email/password (JWT-based)
   - Multi-user support (each staff member has own login)
   - Basic role: staff (admin role for future)

2. **Patient Management**
   - Create, read, update, delete patients
   - Basic info: name, phone, email
   - Search functionality

3. **Service Types**
   - Define clinic services (e.g., "Pregled", "Čišćenje zuba", "Fizioterapija")
   - Each service has a name and color (for calendar visualization)
   - Fixed duration for MVP

4. **Appointment Scheduling**
   - Calendar view (daily view with time slots)
   - Fixed time slot duration (configurable per clinic, e.g., 30 minutes)
   - Book appointments: select patient, date, time, service
   - Fields: patient, service type, date, time, reason for visit, notes
   - Edit/cancel appointments
   - Prevent double bookings (unique constraint)

5. **SMS Reminders**
   - Automated SMS sent 24 hours before appointment
   - One-way notification (no patient response/confirmation)
   - SMS logging for tracking

6. **Clinic Settings**
   - Configure working hours (same schedule every day for MVP)
   - Set time slot duration (e.g., 15, 30, 60 minutes)
   - Clinic basic info (name, phone, email, address)

7. **Basic Statistics**
   - Total appointments count
   - Appointments by status (scheduled, completed, cancelled, no-show)
   - Daily/weekly utilization rate
   - Simple dashboard view

### 🔮 Post-MVP Features (Version 2.0+)

- Patient self-booking with clinic approval workflow
- Patient recognition (returning patients auto-suggest info)
- Custom time slot durations per service
- Flexible scheduling (drag-and-drop, manual time selection)
- Different working hours per day of week
- Days off / vacation mode
- Payment tracking
- Patient medical history/notes
- Waiting list management
- Recurring appointments
- Advanced reports and analytics
- Multi-location support
- Email notifications
- Two-way SMS (patient confirmation/cancellation)

---

## Database Schema

### ERD Overview
```
clinics (1) ─────< users (N)
clinics (1) ─────< patients (N)
clinics (1) ─────< service_types (N)
clinics (1) ─────< appointments (N)
patients (1) ─────< appointments (N)
service_types (1) ─────< appointments (N)
appointments (1) ─────< sms_log (N)
```

### Tables

#### **users** (Clinic Staff)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff', -- 'admin', 'staff'
    clinic_id INTEGER REFERENCES clinics(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clinic_id ON users(clinic_id);
```

#### **clinics**
```sql
CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    working_hours_start TIME DEFAULT '09:00',
    working_hours_end TIME DEFAULT '17:00',
    slot_duration INTEGER DEFAULT 30, -- minutes
    timezone VARCHAR(50) DEFAULT 'Europe/Belgrade',
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **patients**
```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER REFERENCES clinics(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_full_name ON patients(full_name);
```

#### **service_types**
```sql
CREATE TABLE service_types (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER REFERENCES clinics(id),
    name VARCHAR(255) NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes (for future use)
    color VARCHAR(7), -- hex color for calendar display (e.g., '#3B82F6')
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_types_clinic_id ON service_types(clinic_id);
```

#### **appointments**
```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER REFERENCES clinics(id),
    patient_id INTEGER REFERENCES patients(id),
    service_type_id INTEGER REFERENCES service_types(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    reason_for_visit TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
    sms_sent BOOLEAN DEFAULT false,
    sms_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(clinic_id, appointment_date, appointment_time) -- prevent double booking
);

CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_sms_pending ON appointments(appointment_date, sms_sent) 
    WHERE sms_sent = false AND status = 'scheduled';
```

#### **sms_log**
```sql
CREATE TABLE sms_log (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50), -- 'sent', 'failed', 'pending'
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sms_log_appointment_id ON sms_log(appointment_id);
CREATE INDEX idx_sms_log_sent_at ON sms_log(sent_at);
```

---

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Staff login (email, password) → returns JWT token | No |
| POST | `/auth/logout` | Logout (invalidate token) | Yes |
| GET | `/auth/me` | Get current user info | Yes |

**Request/Response Examples:**

```json
// POST /auth/login
Request:
{
  "email": "doctor@clinic.rs",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "doctor@clinic.rs",
    "full_name": "Dr. Petar Petrović",
    "role": "admin",
    "clinic_id": 1
  }
}

// GET /auth/me
Response:
{
  "id": 1,
  "email": "doctor@clinic.rs",
  "full_name": "Dr. Petar Petrović",
  "role": "admin",
  "clinic_id": 1,
  "clinic": {
    "id": 1,
    "name": "Ordinacija Dr. Petrović"
  }
}
```

---

### Patients

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/patients` | List all patients (with search, pagination) | Yes |
| POST | `/patients` | Create new patient | Yes |
| GET | `/patients/{id}` | Get patient details | Yes |
| PUT | `/patients/{id}` | Update patient | Yes |
| DELETE | `/patients/{id}` | Delete patient | Yes |

**Query Parameters for GET /patients:**
- `search` (string): Search by name or phone
- `limit` (int): Results per page (default: 50)
- `offset` (int): Pagination offset

**Request/Response Examples:**

```json
// POST /patients
Request:
{
  "full_name": "Marko Marković",
  "phone": "+381641234567",
  "email": "marko@example.com"
}

Response:
{
  "id": 15,
  "clinic_id": 1,
  "full_name": "Marko Marković",
  "phone": "+381641234567",
  "email": "marko@example.com",
  "created_at": "2026-05-04T10:30:00Z",
  "created_by": 1
}

// GET /patients?search=marko&limit=10
Response:
{
  "total": 1,
  "patients": [
    {
      "id": 15,
      "full_name": "Marko Marković",
      "phone": "+381641234567",
      "email": "marko@example.com",
      "created_at": "2026-05-04T10:30:00Z"
    }
  ]
}
```

---

### Service Types

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | List all service types | Yes |
| POST | `/services` | Create service type | Yes |
| PUT | `/services/{id}` | Update service type | Yes |
| DELETE | `/services/{id}` | Delete service type (soft delete) | Yes |

**Request/Response Examples:**

```json
// POST /services
Request:
{
  "name": "Pregled",
  "color": "#3B82F6"
}

Response:
{
  "id": 3,
  "clinic_id": 1,
  "name": "Pregled",
  "duration": 30,
  "color": "#3B82F6",
  "is_active": true,
  "created_at": "2026-05-04T10:35:00Z"
}

// GET /services
Response:
[
  {
    "id": 1,
    "name": "Pregled",
    "color": "#3B82F6",
    "is_active": true
  },
  {
    "id": 2,
    "name": "Čišćenje zuba",
    "color": "#10B981",
    "is_active": true
  }
]
```

---

### Appointments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/appointments` | List appointments (filter by date range) | Yes |
| POST | `/appointments` | Create appointment | Yes |
| GET | `/appointments/{id}` | Get appointment details | Yes |
| PUT | `/appointments/{id}` | Update appointment | Yes |
| DELETE | `/appointments/{id}` | Cancel appointment | Yes |
| GET | `/appointments/calendar/{date}` | Get all slots for a specific date | Yes |
| GET | `/appointments/available-slots` | Get available time slots | Yes |

**Query Parameters for GET /appointments:**
- `start_date` (date): Filter from date (YYYY-MM-DD)
- `end_date` (date): Filter to date (YYYY-MM-DD)
- `status` (string): Filter by status
- `patient_id` (int): Filter by patient

**Request/Response Examples:**

```json
// POST /appointments
Request:
{
  "patient_id": 15,
  "service_type_id": 1,
  "appointment_date": "2026-05-10",
  "appointment_time": "10:00",
  "reason_for_visit": "Rutinski pregled",
  "notes": "Pacijent alergičan na penicilin"
}

Response:
{
  "id": 42,
  "clinic_id": 1,
  "patient_id": 15,
  "service_type_id": 1,
  "appointment_date": "2026-05-10",
  "appointment_time": "10:00:00",
  "duration": 30,
  "reason_for_visit": "Rutinski pregled",
  "notes": "Pacijent alergičan na penicilin",
  "status": "scheduled",
  "sms_sent": false,
  "created_at": "2026-05-04T10:40:00Z",
  "patient": {
    "id": 15,
    "full_name": "Marko Marković",
    "phone": "+381641234567"
  },
  "service_type": {
    "id": 1,
    "name": "Pregled",
    "color": "#3B82F6"
  }
}

// GET /appointments/calendar/2026-05-10
Response:
{
  "date": "2026-05-10",
  "working_hours": {
    "start": "09:00",
    "end": "17:00"
  },
  "slot_duration": 30,
  "appointments": [
    {
      "id": 42,
      "time": "10:00",
      "patient": {
        "id": 15,
        "full_name": "Marko Marković"
      },
      "service_type": {
        "name": "Pregled",
        "color": "#3B82F6"
      },
      "reason_for_visit": "Rutinski pregled",
      "status": "scheduled"
    }
  ],
  "available_slots": [
    "09:00", "09:30", "10:30", "11:00", "11:30", "12:00", 
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30"
  ]
}

// GET /appointments/available-slots?date=2026-05-10
Response:
{
  "date": "2026-05-10",
  "slots": [
    {
      "time": "09:00",
      "available": true
    },
    {
      "time": "09:30",
      "available": true
    },
    {
      "time": "10:00",
      "available": false
    },
    // ... more slots
  ]
}
```

---

### Clinic Settings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/clinic/settings` | Get clinic settings | Yes |
| PUT | `/clinic/settings` | Update clinic settings | Yes (admin) |

**Request/Response Examples:**

```json
// GET /clinic/settings
Response:
{
  "id": 1,
  "name": "Ordinacija Dr. Petrović",
  "phone": "+381112345678",
  "email": "info@clinic.rs",
  "address": "Kneza Miloša 15, Beograd",
  "working_hours_start": "09:00",
  "working_hours_end": "17:00",
  "slot_duration": 30,
  "timezone": "Europe/Belgrade"
}

// PUT /clinic/settings
Request:
{
  "name": "Ordinacija Dr. Petrović",
  "working_hours_start": "08:00",
  "working_hours_end": "18:00",
  "slot_duration": 30
}

Response:
{
  "id": 1,
  "name": "Ordinacija Dr. Petrović",
  "working_hours_start": "08:00",
  "working_hours_end": "18:00",
  "slot_duration": 30,
  "updated_at": "2026-05-04T11:00:00Z"
}
```

---

### Statistics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats/overview` | Basic stats (total appointments, by status) | Yes |
| GET | `/stats/daily` | Daily breakdown (date range) | Yes |

**Request/Response Examples:**

```json
// GET /stats/overview?start_date=2026-05-01&end_date=2026-05-31
Response:
{
  "period": {
    "start": "2026-05-01",
    "end": "2026-05-31"
  },
  "total_appointments": 124,
  "by_status": {
    "scheduled": 45,
    "completed": 68,
    "cancelled": 8,
    "no_show": 3
  },
  "utilization_rate": 0.78, // 78% of available slots booked
  "total_patients": 87,
  "new_patients": 12
}

// GET /stats/daily?start_date=2026-05-01&end_date=2026-05-07
Response:
{
  "daily_stats": [
    {
      "date": "2026-05-01",
      "total": 8,
      "completed": 7,
      "cancelled": 1,
      "utilization_rate": 0.5
    },
    {
      "date": "2026-05-02",
      "total": 12,
      "completed": 11,
      "no_show": 1,
      "utilization_rate": 0.75
    }
    // ... more days
  ]
}
```

---

### SMS

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/sms/test` | Send test SMS (for debugging) | Yes (admin) |

**Request/Response Examples:**

```json
// POST /sms/test
Request:
{
  "phone": "+381641234567",
  "message": "Test poruka"
}

Response:
{
  "success": true,
  "message": "SMS sent successfully",
  "sms_id": "abc123"
}
```

---

## Frontend Structure

### Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── patients/
│   │   │   ├── PatientList.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── PatientSearch.tsx
│   │   │   └── PatientCard.tsx
│   │   ├── appointments/
│   │   │   ├── Calendar.tsx              # Main calendar container
│   │   │   ├── DayView.tsx               # Single day time slots
│   │   │   ├── AppointmentForm.tsx       # Book/edit modal
│   │   │   ├── AppointmentCard.tsx       # Single appointment display
│   │   │   ├── TimeSlot.tsx              # Individual time slot component
│   │   │   └── AppointmentDetails.tsx    # Detail view modal
│   │   ├── services/
│   │   │   ├── ServiceList.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   └── ServiceBadge.tsx
│   │   ├── settings/
│   │   │   ├── ClinicSettings.tsx
│   │   │   └── WorkingHoursForm.tsx
│   │   ├── stats/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── DailyChart.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       ├── DatePicker.tsx
│   │       ├── Spinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── PatientsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── StatsPage.tsx
│   ├── api/
│   │   ├── client.ts                     # Axios client with interceptors
│   │   ├── auth.ts                       # Auth API calls
│   │   ├── patients.ts                   # Patient API calls
│   │   ├── appointments.ts               # Appointment API calls
│   │   ├── services.ts                   # Service API calls
│   │   ├── clinic.ts                     # Clinic settings API calls
│   │   └── stats.ts                      # Statistics API calls
│   ├── hooks/
│   │   ├── useAuth.ts                    # Authentication hook
│   │   ├── usePatients.ts                # Patient data hook
│   │   ├── useAppointments.ts            # Appointment data hook
│   │   ├── useServices.ts                # Service types hook
│   │   ├── useClinicSettings.ts          # Settings hook
│   │   └── useStats.ts                   # Statistics hook
│   ├── types/
│   │   ├── index.ts                      # Global type exports
│   │   ├── auth.ts                       # Auth types
│   │   ├── patient.ts                    # Patient types
│   │   ├── appointment.ts                # Appointment types
│   │   ├── service.ts                    # Service types
│   │   └── api.ts                        # API response types
│   ├── utils/
│   │   ├── dateHelpers.ts                # Date formatting, manipulation
│   │   ├── validators.ts                 # Form validation
│   │   ├── formatters.ts                 # Phone, text formatters
│   │   └── constants.ts                  # App constants
│   ├── context/
│   │   └── AuthContext.tsx               # Auth context provider
│   ├── styles/
│   │   └── globals.css                   # Global Tailwind styles
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

### Key Components Description

#### **Calendar.tsx**
- Main container for calendar view
- Handles date navigation (prev/next day, date picker)
- Fetches appointments for selected date
- Renders DayView component

#### **DayView.tsx**
- Displays time slots for a single day
- Generates slots based on clinic settings (start/end time, duration)
- Shows booked vs. available slots
- Click handlers for booking new appointments

#### **AppointmentForm.tsx**
- Modal for creating/editing appointments
- Form fields: patient select, service select, date, time, reason, notes
- Patient search/create inline
- Form validation with react-hook-form + zod

#### **PatientSearch.tsx**
- Autocomplete search for existing patients
- Option to create new patient inline
- Used within AppointmentForm

### TypeScript Types

```typescript
// types/auth.ts
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'staff';
  clinic_id: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// types/patient.ts
export interface Patient {
  id: number;
  clinic_id: number;
  full_name: string;
  phone: string;
  email?: string;
  created_at: string;
  created_by?: number;
}

export interface PatientCreateInput {
  full_name: string;
  phone: string;
  email?: string;
}

// types/appointment.ts
export interface Appointment {
  id: number;
  clinic_id: number;
  patient_id: number;
  service_type_id: number;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason_for_visit?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  sms_sent: boolean;
  sms_sent_at?: string;
  created_at: string;
  patient?: Patient;
  service_type?: ServiceType;
}

export interface AppointmentCreateInput {
  patient_id: number;
  service_type_id: number;
  appointment_date: string;
  appointment_time: string;
  reason_for_visit?: string;
  notes?: string;
}

// types/service.ts
export interface ServiceType {
  id: number;
  clinic_id: number;
  name: string;
  duration: number;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface ServiceTypeCreateInput {
  name: string;
  color: string;
}
```

---

## Key User Flows

### 1. Staff Login Flow

**Steps:**
1. User navigates to login page (`/login`)
2. Enters email and password
3. Frontend calls `POST /api/v1/auth/login`
4. Backend validates credentials
5. If valid: returns JWT token + user info
6. Frontend stores token in localStorage
7. Redirect to Calendar page (`/calendar`)
8. All subsequent API calls include `Authorization: Bearer <token>` header

**Error Handling:**
- Invalid credentials → Show error message
- Network error → Show retry option
- Token expiration → Redirect to login with message

---

### 2. Book New Appointment Flow

**Steps:**
1. Staff is on Calendar page, viewing a specific date
2. Clicks on an available time slot (e.g., 10:00 AM)
3. Modal opens with AppointmentForm
4. **Patient Selection:**
   - Option A: Search for existing patient (autocomplete)
   - Option B: Click "Add New Patient" → inline form appears
5. Select service type from dropdown
6. Date and time are pre-filled (from clicked slot)
7. Enter optional reason for visit and notes
8. Click "Book Appointment"
9. Frontend validates form (zod schema)
10. Frontend calls `POST /api/v1/appointments`
11. Backend validates:
    - Patient exists
    - Service exists
    - Time slot is available (not double booked)
    - Date is valid
12. If valid: creates appointment, returns data
13. Frontend closes modal, refreshes calendar
14. Success toast notification shown

**Error Handling:**
- Slot already booked → "Time slot no longer available. Please choose another time."
- Validation errors → Show field-specific errors
- Network error → Show retry option

---

### 3. View & Edit Appointment Flow

**Steps:**
1. Staff clicks on a booked time slot in calendar
2. Modal opens showing appointment details
3. Display: patient info, service, time, reason, notes, status
4. Actions available: Edit | Cancel | Mark as Completed
5. **Edit:**
   - Click "Edit" button
   - Modal switches to edit mode (form becomes editable)
   - Modify fields
   - Click "Save Changes"
   - Frontend calls `PUT /api/v1/appointments/{id}`
   - Calendar refreshes
6. **Cancel:**
   - Click "Cancel Appointment"
   - Confirmation dialog: "Are you sure?"
   - If confirmed: `DELETE /api/v1/appointments/{id}`
   - Calendar refreshes, slot becomes available
7. **Mark as Completed:**
   - Click "Mark as Completed"
   - Frontend calls `PUT /api/v1/appointments/{id}` with `status: 'completed'`
   - Appointment visual changes (e.g., greyed out)

---

### 4. SMS Reminder Flow (Background Process)

**Steps:**
1. **Scheduled Job** (APScheduler running in FastAPI)
   - Runs every hour (or every 30 minutes)
2. Query database for appointments:
   ```sql
   SELECT * FROM appointments
   WHERE appointment_date = CURRENT_DATE + INTERVAL '1 day'
     AND sms_sent = false
     AND status = 'scheduled'
   ```
3. For each appointment found:
   - Fetch patient phone number
   - Construct SMS message:
     ```
     Podsetnik: Imate zakazan termin sutra u [TIME] u [CLINIC_NAME].
     Usluga: [SERVICE_NAME]
     Adresa: [CLINIC_ADDRESS]
     ```
   - Call SMS gateway API (e.g., Serpent.rs)
   - If successful:
     - Update appointment: `sms_sent = true`, `sms_sent_at = NOW()`
     - Log in `sms_log` table: `status = 'sent'`
   - If failed:
     - Log in `sms_log` table: `status = 'failed'`, `error_message = <error>`
     - Retry logic (optional): retry 2 more times with exponential backoff
4. Log summary: "Sent 15 SMS reminders, 2 failed"

**Error Handling:**
- SMS API down → Log error, retry later
- Invalid phone number → Log error, skip
- Quota exceeded → Alert admin via email/log

---

### 5. Manage Patients Flow

**Steps:**
1. Navigate to Patients page (`/patients`)
2. View paginated list of all patients
3. **Search:** Type in search box → filters by name or phone (debounced)
4. **Add New Patient:**
   - Click "Add Patient" button
   - Modal opens with PatientForm
   - Enter name, phone, email
   - Click "Save"
   - Frontend calls `POST /api/v1/patients`
   - Modal closes, list refreshes
5. **Edit Patient:**
   - Click on patient card/row
   - Modal opens with pre-filled form
   - Modify fields
   - Click "Save Changes"
   - Frontend calls `PUT /api/v1/patients/{id}`
6. **Delete Patient:**
   - Click "Delete" button
   - Confirmation dialog: "Delete [name]? This cannot be undone."
   - If confirmed: `DELETE /api/v1/patients/{id}`
   - List refreshes

**Notes:**
- Deleting a patient with existing appointments should show warning
- Consider soft delete (is_active flag) instead of hard delete

---

### 6. Configure Clinic Settings Flow

**Steps:**
1. Navigate to Settings page (`/settings`)
2. View current clinic settings (read-only for non-admin)
3. **Admin can edit:**
   - Clinic name, phone, email, address
   - Working hours (start time, end time)
   - Time slot duration (15, 30, 45, 60 minutes)
4. Click "Save Settings"
5. Frontend calls `PUT /api/v1/clinic/settings`
6. Success toast: "Settings updated successfully"
7. **Impact on calendar:**
   - If slot duration changed, calendar re-generates slots
   - If working hours changed, available slots adjust

**Validation:**
- End time must be after start time
- Slot duration must be divisible (e.g., 15, 30, 60)

---

## Tech Stack

### Backend (Python/FastAPI)

**Core Framework:**
```
fastapi==0.110.0
uvicorn[standard]==0.29.0
```

**Database:**
```
sqlalchemy==2.0.29
psycopg2-binary==2.9.9
alembic==1.13.1              # Database migrations
```

**Authentication & Security:**
```
python-jose[cryptography]==3.3.0  # JWT
passlib[bcrypt]==1.7.4            # Password hashing
python-multipart==0.0.9           # Form data
```

**Background Jobs:**
```
apscheduler==3.10.4          # Cron jobs for SMS reminders
```

**HTTP Client (for SMS API):**
```
httpx==0.27.0
```

**Validation:**
```
pydantic==2.7.0
pydantic-settings==2.2.1     # Environment variables
```

**Development:**
```
pytest==8.1.1
pytest-asyncio==0.23.6
black==24.3.0                # Code formatter
ruff==0.3.5                  # Linter
```

**Project Structure:**
```
backend/
├── alembic/
│   ├── versions/
│   └── env.py
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization
│   ├── config.py                  # Settings (pydantic-settings)
│   ├── database.py                # SQLAlchemy engine, session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── clinic.py
│   │   ├── patient.py
│   │   ├── service_type.py
│   │   ├── appointment.py
│   │   └── sms_log.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic schemas
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   ├── service_type.py
│   │   └── auth.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependencies (get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── patients.py
│   │       ├── appointments.py
│   │       ├── services.py
│   │       ├── clinic.py
│   │       └── stats.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py        # Business logic for auth
│   │   ├── patient_service.py
│   │   ├── appointment_service.py
│   │   └── sms_service.py         # SMS gateway integration
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py            # Password hashing, JWT
│   │   └── datetime_helpers.py
│   └── tasks/
│       ├── __init__.py
│       └── sms_reminders.py       # Background job for SMS
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_patients.py
│   └── test_appointments.py
├── .env.example
├── .gitignore
├── alembic.ini
├── pyproject.toml
└── requirements.txt
```

---

### Frontend (React + TypeScript)

**Core:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.2",
  "vite": "^5.2.0"
}
```

**Routing:**
```json
{
  "react-router-dom": "^6.22.3"
}
```

**API & State Management:**
```json
{
  "axios": "^1.6.8",
  "@tanstack/react-query": "^5.29.0"
}
```

**Forms:**
```json
{
  "react-hook-form": "^7.51.2",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.4"
}
```

**Date Handling:**
```json
{
  "date-fns": "^3.6.0"
}
```

**UI Components:**
```json
{
  "tailwindcss": "^3.4.3",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.38",
  "@headlessui/react": "^1.7.18",
  "@heroicons/react": "^2.1.3"
}
```

**Calendar (Optional Libraries):**
- Build custom with Tailwind
- OR use: `react-big-calendar` (heavy, feature-rich)
- OR use: `react-calendar` (lightweight)

**Development:**
```json
{
  "eslint": "^8.57.0",
  "prettier": "^3.2.5",
  "@types/react": "^18.2.66",
  "@types/react-dom": "^18.2.22"
}
```

---

### Database

**PostgreSQL 15+**
- Production: Managed PostgreSQL (e.g., DigitalOcean, AWS RDS, or local VPS)
- Development: Local PostgreSQL via Docker

---

### DevOps & Deployment

**Containerization:**
```
Docker
Docker Compose
```

**CI/CD:**
- GitLab CI (since you have experience)
- GitHub Actions (alternative)

**Hosting Options (Serbia):**
1. **VPS Providers:**
   - Hetzner (Germany, good latency to Serbia)
   - DigitalOcean
   - Local Serbian providers (e.g., ServerNet.rs, Host.rs)
2. **Cloud Platforms:**
   - AWS (eu-central-1 Frankfurt)
   - Render.com (simple deployment)
   - Railway.app (simple deployment)

**SSL:**
- Let's Encrypt (free, auto-renewal with certbot)

**Reverse Proxy:**
- Nginx

---

## Development Phases

### **Phase 1: Foundation (Week 1-2)**

**Backend:**
- [ ] Setup FastAPI project structure
- [ ] Configure PostgreSQL connection (SQLAlchemy)
- [ ] Create database models (all tables)
- [ ] Setup Alembic migrations
- [ ] Implement authentication:
  - Password hashing (bcrypt)
  - JWT token generation/validation
  - Login endpoint
  - Get current user endpoint
- [ ] Setup CORS for frontend development

**Frontend:**
- [ ] Setup React + Vite + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Setup React Router
- [ ] Create basic layout (Navbar, Sidebar)
- [ ] Implement login page + auth context
- [ ] Setup Axios client with JWT interceptors
- [ ] Create PrivateRoute component

**Database:**
- [ ] Initial migration with all tables
- [ ] Seed script for development data (test clinic, users, patients)

**Goal:** Staff can log in, see empty calendar page

---

### **Phase 2: Patient Management (Week 3)**

**Backend:**
- [ ] Implement patient endpoints (CRUD)
- [ ] Add search/filter functionality
- [ ] Add pagination
- [ ] Write tests for patient endpoints

**Frontend:**
- [ ] Create Patients page
- [ ] Patient list component with search
- [ ] Patient form modal (create/edit)
- [ ] Patient card component
- [ ] Integrate with backend API
- [ ] Form validation (zod)

**Goal:** Staff can manage patients (create, edit, delete, search)

---

### **Phase 3: Service Types & Clinic Settings (Week 3-4)**

**Backend:**
- [ ] Implement service type endpoints (CRUD)
- [ ] Implement clinic settings endpoints (GET, PUT)
- [ ] Add validation for working hours

**Frontend:**
- [ ] Create Settings page
- [ ] Clinic settings form (name, hours, slot duration)
- [ ] Service types management (list, add, edit, delete)
- [ ] Color picker for service types
- [ ] Integrate with backend API

**Goal:** Staff can configure clinic settings and service types

---

### **Phase 4: Appointment Scheduling (Week 4-5)**

**Backend:**
- [ ] Implement appointment endpoints (CRUD)
- [ ] Calendar endpoint (get all slots for a date)
- [ ] Available slots endpoint
- [ ] Double booking prevention (unique constraint + validation)
- [ ] Appointment status transitions
- [ ] Write tests for appointment logic

**Frontend:**
- [ ] Create Calendar page
- [ ] Date navigation (prev/next day, date picker)
- [ ] DayView component (render time slots)
- [ ] TimeSlot component (booked vs. available)
- [ ] AppointmentForm modal (create/edit)
- [ ] Patient search within appointment form
- [ ] Inline patient creation
- [ ] Appointment details modal
- [ ] Cancel/complete appointment actions
- [ ] Real-time calendar refresh
- [ ] Form validation

**Goal:** Staff can book, view, edit, and cancel appointments

---

### **Phase 5: SMS Reminders (Week 6)**

**Backend:**
- [ ] Research and choose SMS gateway (Serpent.rs, SMS Broker, Twilio)
- [ ] Implement SMS service (httpx client for gateway API)
- [ ] Create SMS template with dynamic data
- [ ] Implement background job (APScheduler):
  - Query appointments for next day
  - Send SMS reminders
  - Update sms_sent flag
  - Log results
- [ ] Error handling and retry logic
- [ ] SMS logging
- [ ] Test SMS endpoint for debugging

**Frontend:**
- [ ] Display SMS sent status in appointment details
- [ ] Admin page to view SMS logs (optional for MVP)

**Goal:** Automated SMS reminders sent 24 hours before appointments

---

### **Phase 6: Statistics & Dashboard (Week 7)**

**Backend:**
- [ ] Implement statistics endpoints:
  - Overview (total appointments, by status)
  - Daily breakdown
  - Utilization rate calculation
- [ ] Optimize queries for performance

**Frontend:**
- [ ] Create Dashboard/Stats page
- [ ] Stats cards (total appointments, completed, cancelled, etc.)
- [ ] Date range picker
- [ ] Simple bar/line chart (optional: use recharts or chart.js)
- [ ] Utilization rate visualization

**Goal:** Staff can view basic appointment statistics

---

### **Phase 7: Polish & Testing (Week 8)**

**Backend:**
- [ ] End-to-end testing
- [ ] Error handling improvements
- [ ] API documentation (FastAPI auto-docs)
- [ ] Performance optimization (query optimization, indexes)
- [ ] Security audit (input validation, SQL injection prevention)

**Frontend:**
- [ ] Error boundary implementation
- [ ] Loading states for all API calls
- [ ] Toast notifications (success/error)
- [ ] Responsive design testing (mobile, tablet)
- [ ] Accessibility improvements
- [ ] Browser testing (Chrome, Firefox, Safari)

**Deployment:**
- [ ] Setup Docker Compose for production
- [ ] Configure Nginx reverse proxy
- [ ] SSL certificate setup (Let's Encrypt)
- [ ] Environment variables configuration
- [ ] Database backup strategy
- [ ] Monitoring setup (logs, uptime)

**Goal:** Production-ready MVP

---

### **Phase 8: Beta Testing (Week 9-10)**

- [ ] Deploy to staging environment
- [ ] Onboard 2-3 beta clinics
- [ ] Collect feedback
- [ ] Bug fixes
- [ ] Usability improvements
- [ ] Documentation (user guide, admin guide)

**Goal:** Validated MVP with real users

---

## Deployment Architecture

### Production Setup (Docker Compose)

```
[Domain: mojitermini.rs]
          |
    [CloudFlare CDN] (optional)
          |
    [Nginx (Port 80/443)]
          |
    [SSL Termination]
          |
    ┌─────┴─────┐
    |           |
[Frontend]  [Backend API]
(Static)    (Port 8000)
            |
    [PostgreSQL]
    (Port 5432)
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: mojitermini_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - mojitermini_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mojitermini_backend
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      JWT_ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 1440
      SMS_GATEWAY_URL: ${SMS_GATEWAY_URL}
      SMS_API_KEY: ${SMS_API_KEY}
      SMS_SENDER_NAME: ${SMS_SENDER_NAME}
      ENVIRONMENT: production
    volumes:
      - ./backend/logs:/app/logs
    ports:
      - "8000:8000"
    networks:
      - mojitermini_network
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.mojitermini.rs
    container_name: mojitermini_frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "3000:80"
    networks:
      - mojitermini_network

  nginx:
    image: nginx:alpine
    container_name: mojitermini_nginx
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - mojitermini_network

  certbot:
    image: certbot/certbot
    container_name: mojitermini_certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  mojitermini_network:
    driver: bridge

volumes:
  postgres_data:
```

### Nginx Configuration

```nginx
# /nginx/nginx.conf

upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:80;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    server_name mojitermini.rs www.mojitermini.rs;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Frontend
server {
    listen 443 ssl http2;
    server_name mojitermini.rs www.mojitermini.rs;

    ssl_certificate /etc/letsencrypt/live/mojitermini.rs/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mojitermini.rs/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPS - Backend API
server {
    listen 443 ssl http2;
    server_name api.mojitermini.rs;

    ssl_certificate /etc/letsencrypt/live/mojitermini.rs/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mojitermini.rs/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 10M;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run migrations and start server
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables (.env)

```bash
# Database
DB_NAME=mojitermini
DB_USER=admin
DB_PASSWORD=<strong_password>

# JWT
JWT_SECRET=<generated_secret_key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# SMS Gateway (example for Serpent.rs)
SMS_GATEWAY_URL=https://api.serpent.rs/v1/send
SMS_API_KEY=<your_api_key>
SMS_SENDER_NAME=MojiTermini

# Application
ENVIRONMENT=production
CORS_ORIGINS=https://mojitermini.rs,https://www.mojitermini.rs
```

---

## SMS Integration

### Serbian SMS Providers

#### **1. Serpent (serpent.rs)** - RECOMMENDED
- **Pros:** Serbian company, good documentation, reliable
- **Pricing:** ~0.50-1.00 RSD per SMS
- **API:** RESTful API with JSON
- **Documentation:** https://serpent.rs/api-dokumentacija

**Example Integration:**

```python
# app/services/sms_service.py

import httpx
from app.config import settings

class SMSService:
    def __init__(self):
        self.api_url = settings.SMS_GATEWAY_URL
        self.api_key = settings.SMS_API_KEY
        self.sender_name = settings.SMS_SENDER_NAME

    async def send_sms(self, phone: str, message: str) -> dict:
        """
        Send SMS via Serpent.rs API
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "to": phone,
            "from": self.sender_name,
            "text": message
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.api_url,
                    json=payload,
                    headers=headers,
                    timeout=10.0
                )
                response.raise_for_status()
                return {
                    "success": True,
                    "data": response.json()
                }
            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "error": str(e)
                }

    def format_reminder_message(
        self, 
        patient_name: str,
        appointment_time: str,
        clinic_name: str,
        service_name: str
    ) -> str:
        """
        Format SMS reminder message
        """
        return (
            f"Poštovani/a {patient_name}, "
            f"podsetnik da imate zakazan termin sutra u {appointment_time} "
            f"u {clinic_name}. "
            f"Usluga: {service_name}. "
            f"Hvala!"
        )

sms_service = SMSService()
```

#### **2. SMS Broker (smsbroker.rs)**
- Similar to Serpent, alternative option

#### **3. Twilio (International)**
- **Pros:** Excellent documentation, reliable
- **Cons:** More expensive for Serbian numbers
- **Pricing:** ~$0.05 per SMS (~5.50 RSD)

### Background Job for SMS Reminders

```python
# app/tasks/sms_reminders.py

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.sms_log import SMSLog
from app.services.sms_service import sms_service
import logging

logger = logging.getLogger(__name__)

async def send_appointment_reminders():
    """
    Send SMS reminders for appointments scheduled for tomorrow
    """
    db: Session = SessionLocal()
    try:
        tomorrow = date.today() + timedelta(days=1)
        
        # Query appointments for tomorrow that haven't been sent SMS
        appointments = db.query(Appointment).filter(
            Appointment.appointment_date == tomorrow,
            Appointment.sms_sent == False,
            Appointment.status == "scheduled"
        ).all()
        
        logger.info(f"Found {len(appointments)} appointments to send reminders for")
        
        sent_count = 0
        failed_count = 0
        
        for appointment in appointments:
            patient = appointment.patient
            service = appointment.service_type
            clinic = appointment.clinic
            
            # Format message
            message = sms_service.format_reminder_message(
                patient_name=patient.full_name.split()[0],  # First name only
                appointment_time=appointment.appointment_time.strftime("%H:%M"),
                clinic_name=clinic.name,
                service_name=service.name
            )
            
            # Send SMS
            result = await sms_service.send_sms(
                phone=patient.phone,
                message=message
            )
            
            # Log result
            sms_log = SMSLog(
                appointment_id=appointment.id,
                phone=patient.phone,
                message=message,
                status="sent" if result["success"] else "failed",
                error_message=result.get("error")
            )
            db.add(sms_log)
            
            # Update appointment
            if result["success"]:
                appointment.sms_sent = True
                appointment.sms_sent_at = datetime.now()
                sent_count += 1
            else:
                failed_count += 1
                logger.error(f"Failed to send SMS to {patient.phone}: {result.get('error')}")
        
        db.commit()
        logger.info(f"SMS reminder job completed. Sent: {sent_count}, Failed: {failed_count}")
        
    except Exception as e:
        logger.error(f"Error in SMS reminder job: {str(e)}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    """
    Initialize and start the APScheduler
    """
    scheduler = AsyncIOScheduler()
    
    # Run every hour
    scheduler.add_job(
        send_appointment_reminders,
        trigger="cron",
        hour="*",
        minute=0,
        id="sms_reminders",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("SMS reminder scheduler started")
    return scheduler
```

### Initialize Scheduler in FastAPI

```python
# app/main.py

from fastapi import FastAPI
from app.tasks.sms_reminders import start_scheduler

app = FastAPI(title="Moji Termini API")

@app.on_event("startup")
async def startup_event():
    """
    Run on application startup
    """
    # Start SMS reminder scheduler
    start_scheduler()
    logger.info("Application startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    """
    Run on application shutdown
    """
    logger.info("Application shutting down")
```

---

## Next Steps

### Immediate Actions

1. **Setup Development Environment:**
   ```bash
   mkdir moji-termini
   cd moji-termini
   mkdir backend frontend docs
   ```

2. **Initialize Git Repository:**
   ```bash
   git init
   git remote add origin <your_repo_url>
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm create vite@latest . -- --template react-ts
   npm install
   ```

5. **Database Setup:**
   ```bash
   docker run --name mojitermini-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

### Questions to Finalize

1. **Domain name:** Do you already have a domain (e.g., mojitermini.rs)?
2. **SMS Provider:** Which SMS gateway would you prefer? (Serpent.rs recommended)
3. **Hosting:** Where will you host? (VPS, cloud platform?)
4. **Timeline:** When do you want to launch beta?
5. **Budget:** Budget for SMS costs, hosting, domain?

---

## Resources

### Learning Resources
- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Documentation: https://react.dev/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- Tailwind CSS: https://tailwindcss.com/docs

### Tools
- Database Design: https://dbdiagram.io/
- API Testing: Postman, Insomnia, or FastAPI auto-docs
- Figma/Excalidraw: UI mockups

### Serbian Business Resources
- Domain registration: https://www.rnids.rs/ (.rs domain)
- Business registration: Serbian Business Registers Agency (APR)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-04  
**Author:** Claude Code  
**Status:** Draft - Ready for Development

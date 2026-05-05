# Moji Termini - Backend

FastAPI backend for Moji Termini appointment scheduling system.

## Tech Stack

- **FastAPI** 0.110.0 - Modern Python web framework
- **PostgreSQL** 15+ - Database
- **SQLAlchemy** 2.0 - ORM
- **Alembic** - Database migrations
- **JWT** - Authentication
- **Pydantic** - Validation

## Setup

### 1. Start PostgreSQL (Docker)

From project root:
```bash
docker-compose up -d
```

Verify it's running:
```bash
docker ps
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update if needed (default values should work).

### 5. Run Database Migrations

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial tables"

# Apply migration
alembic upgrade head
```

### 6. Create Initial Data (Optional)

Create a seed script or manually insert a test clinic and user.

Example SQL:
```sql
-- Connect to database
docker exec -it mojitermini_db psql -U admin -d mojitermini

-- Insert test clinic
INSERT INTO clinics (name, phone, email, address) 
VALUES ('Test Ordinacija', '+381111234567', 'test@clinic.rs', 'Beograd');

-- Insert test user (password: "password123")
INSERT INTO users (email, password_hash, full_name, role, clinic_id, is_active)
VALUES (
    'doctor@clinic.rs',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5pXuxU9W.jS0m',
    'Dr. Test',
    'admin',
    1,
    true
);
```

### 7. Run Development Server

```bash
uvicorn app.main:app --reload
```

Server runs on: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

### Test Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor@clinic.rs", "password": "password123"}'
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Use Token

```bash
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
backend/
├── app/
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── api/            
│   │   ├── v1/         # API v1 routes
│   │   └── deps.py     # Dependencies (auth)
│   ├── services/       # Business logic (empty for now)
│   ├── utils/          # Utilities (security, etc.)
│   ├── tasks/          # Background jobs (empty for now)
│   ├── config.py       # Settings
│   ├── database.py     # DB connection
│   └── main.py         # FastAPI app
├── alembic/            # Database migrations
├── tests/              # Tests (empty for now)
├── requirements.txt    
├── .env.example
└── README.md
```

## Development Workflow

### Create New Migration

After changing models:
```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Run Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
ruff check app/
```

## Common Issues

### Database Connection Error

Make sure PostgreSQL is running:
```bash
docker ps
```

If not:
```bash
docker-compose up -d
```

### Port Already in Use

If port 8000 is taken, use different port:
```bash
uvicorn app.main:app --reload --port 8001
```

### Import Errors

Make sure virtual environment is activated:
```bash
source venv/bin/activate
```

## Next Steps

Phase 1 (Foundation) is complete! Next:

1. Test authentication endpoints
2. Add patient management (Phase 2)
3. Add service types and settings (Phase 3)
4. Add appointment scheduling (Phase 4)

See `../MVP_PLAN.md` for full roadmap.

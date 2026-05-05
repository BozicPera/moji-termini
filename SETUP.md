# 🚀 Moji Termini - Complete Setup Guide

**Phase 1 (Foundation) - Backend + Frontend + Authentication**

---

## 📋 Prerequisites

Before starting, make sure you have:

- [x] **Python 3.11+** - `python --version`
- [x] **Node.js 20+** - `node --version`
- [x] **PostgreSQL 15+** OR **Docker** (for DB)
- [x] **Git** - `git --version`

---

## 🏗️ Project Structure

```
moji-termini/
├── backend/               # FastAPI backend
├── frontend/              # React frontend
├── landing-page/          # Landing page (separate)
├── docker-compose.yml     # PostgreSQL container
├── MVP_PLAN.md           # Complete MVP plan
├── QUICKSTART.md         # Quick reference
└── SETUP.md              # This file
```

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Start PostgreSQL

```bash
# From project root
docker-compose up -d
```

Verify:
```bash
docker ps  # Should see mojitermini_db
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run database migrations
alembic revision --autogenerate -m "Initial tables"
alembic upgrade head
```

### Step 3: Seed Database

```bash
# Connect to database
docker exec -it mojitermini_db psql -U admin -d mojitermini

# Insert test clinic
INSERT INTO clinics (name, phone, email, address) 
VALUES ('Test Ordinacija', '+381111234567', 'test@clinic.rs', 'Beograd, Srbija');

# Insert test user (password: "password123")
INSERT INTO users (email, password_hash, full_name, role, clinic_id, is_active)
VALUES (
    'doctor@clinic.rs',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5pXuxU9W.jS0m',
    'Dr. Petar Petrović',
    'admin',
    1,
    true
);

# Exit
\q
```

### Step 4: Start Backend

```bash
# In backend/ directory (with venv activated)
uvicorn app.main:app --reload --port 8001
```

Backend: `http://localhost:8001`  
API Docs: `http://localhost:8001/docs`

### Step 5: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

Frontend: `http://localhost:5173`

### Step 6: Test Login

1. Go to `http://localhost:5173`
2. Login with:
   - **Email:** `doctor@clinic.rs`
   - **Password:** `password123`
3. You should see dashboard! ✅

---

## 🔧 Detailed Setup Instructions

### Backend Setup (Expanded)

#### 1. Virtual Environment

```bash
cd backend
python -m venv venv

# Activate
source venv/bin/activate       # Linux/Mac
# or
venv\Scripts\activate          # Windows
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Dependencies installed:
- FastAPI, Uvicorn
- SQLAlchemy, Alembic, psycopg2
- JWT (python-jose), passlib
- APScheduler (for SMS jobs)
- Pydantic, httpx

#### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed:
```bash
DATABASE_URL=postgresql://admin:postgres@localhost:5432/mojitermini
JWT_SECRET=your-secret-key-change-in-production
```

#### 4. Database Migrations

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial tables: users, clinics"

# Apply migration
alembic upgrade head
```

This creates:
- `users` table
- `clinics` table

#### 5. Seed Data (Manual for now)

```sql
-- Connect to database
docker exec -it mojitermini_db psql -U admin -d mojitermini

-- Insert clinic
INSERT INTO clinics (name, phone, email, address, working_hours_start, working_hours_end, slot_duration) 
VALUES ('Ordinacija Dr. Petrović', '+381111234567', 'info@clinic.rs', 'Kneza Miloša 15, Beograd', '09:00', '17:00', 30);

-- Insert admin user
INSERT INTO users (email, password_hash, full_name, role, clinic_id, is_active)
VALUES (
    'doctor@clinic.rs',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5pXuxU9W.jS0m',  -- password123
    'Dr. Petar Petrović',
    'admin',
    1,
    true
);

-- Verify
SELECT * FROM clinics;
SELECT id, email, full_name, role FROM users;

-- Exit
\q
```

#### 6. Run Backend

```bash
uvicorn app.main:app --reload
```

Test endpoints:
```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor@clinic.rs", "password": "password123"}'
```

---

### Frontend Setup (Expanded)

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React, React Router
- TanStack React Query
- Axios, Zod, React Hook Form
- Tailwind CSS
- TypeScript

#### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

#### 3. Run Frontend

```bash
npm run dev
```

Vite dev server starts on `http://localhost:5173`

#### 4. Test Authentication

1. Open `http://localhost:5173`
2. Should redirect to `/login`
3. Enter credentials:
   - Email: `doctor@clinic.rs`
   - Password: `password123`
4. Click "Prijavite se"
5. Should redirect to `/dashboard`
6. See welcome message with user info

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] **PostgreSQL running:** `docker ps` shows `mojitermini_db`
- [ ] **Backend running:** `http://localhost:8000/docs` loads
- [ ] **Frontend running:** `http://localhost:5173` loads
- [ ] **Login works:** Can login with test credentials
- [ ] **Token persists:** Refresh page, still logged in
- [ ] **Logout works:** Click logout, redirects to login
- [ ] **API docs work:** `http://localhost:8000/docs` shows all endpoints

---

## 🐛 Troubleshooting

### Backend Issues

#### Port 8000 Already in Use

```bash
# Use different port
uvicorn app.main:app --reload --port 8001

# Update frontend .env
VITE_API_URL=http://localhost:8001
```

#### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps

# Check logs
docker logs mojitermini_db

# Restart container
docker-compose restart db
```

#### Import Errors

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### Alembic Migration Error

```bash
# Reset migrations (CAUTION: drops all tables)
docker exec -it mojitermini_db psql -U admin -d mojitermini -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
alembic upgrade head
```

### Frontend Issues

#### Port 5173 Already in Use

Edit `vite.config.ts`:
```typescript
server: {
  port: 3000,  // or any other port
}
```

#### API Connection Error (CORS)

Check backend `.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Restart backend after changing.

#### npm install Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstall
npm install
```

---

## 🎯 What's Next?

### Phase 1 Complete! ✅

You now have:
- ✅ Backend API with FastAPI
- ✅ PostgreSQL database with migrations
- ✅ JWT authentication
- ✅ React frontend with login
- ✅ Protected routes
- ✅ Full auth flow working

### Phase 2: Patient Management

Next steps:
1. Create Patient model (`backend/app/models/patient.py`)
2. Create Patient API endpoints (`backend/app/api/v1/patients.py`)
3. Create Patient pages in frontend
4. Add patient list, search, create, edit

See `MVP_PLAN.md` for full roadmap.

---

## 📚 Useful Commands

### Backend

```bash
# Start backend
uvicorn app.main:app --reload

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Format code
black app/

# Lint code
ruff check app/

# Run tests (when added)
pytest
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format
npm run format
```

### Database

```bash
# Connect to database
docker exec -it mojitermini_db psql -U admin -d mojitermini

# Backup database
docker exec mojitermini_db pg_dump -U admin mojitermini > backup.sql

# Restore database
cat backup.sql | docker exec -i mojitermini_db psql -U admin -d mojitermini

# Stop database
docker-compose down

# Stop and remove volumes (DELETES DATA)
docker-compose down -v
```

---

## 📞 Need Help?

- **Backend docs:** `backend/README.md`
- **Frontend docs:** `frontend/README.md`
- **MVP Plan:** `MVP_PLAN.md`
- **API Docs:** `http://localhost:8000/docs` (when running)

---

## 🎉 Success!

If you made it here, your development environment is ready!

**Current Status:**
- ✅ Phase 1 (Foundation) - COMPLETE
- 🚧 Phase 2 (Patient Management) - NEXT
- ⏳ Phase 3-8 (Coming soon)

Start building! 🚀

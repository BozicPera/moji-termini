# Moji Termini - Quick Start Guide

## 📋 What You Have

You now have a complete MVP plan and AI-context structure for developing **Moji Termini** - an appointment scheduling system for small clinics in Serbia.

---

## 📁 Project Structure

```
moji-termini/
├── MVP_PLAN.md                      # Complete MVP specification
├── QUICKSTART.md                    # This file
└── .ai-context/                     # AI assistant context files
    ├── README.md                    # How to use AI context
    ├── PROJECT_OVERVIEW.md          # Vision, goals, features
    ├── TECH_STACK.md                # Technologies and dependencies
    ├── CONVENTIONS.md               # Code style and standards
    └── backend/
        └── ARCHITECTURE.md          # Backend structure and patterns
```

---

## 🎯 Next Steps

### Step 1: Review the Plan

Read these files in order:
1. **`MVP_PLAN.md`** - Complete technical specification
   - Database schema
   - API endpoints
   - Frontend structure
   - Development phases
2. **`.ai-context/PROJECT_OVERVIEW.md`** - Business context
3. **`.ai-context/TECH_STACK.md`** - Technologies

### Step 2: Set Up Development Environment

#### Prerequisites
- Python 3.11+
- Node.js 20 LTS
- PostgreSQL 15+
- Docker (optional but recommended)

#### Backend Setup

```bash
# Create backend directory
mkdir -p backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install FastAPI and core dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-jose passlib httpx apscheduler pydantic-settings

# Save dependencies
pip freeze > requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://admin:postgres@localhost:5432/mojitermini
JWT_SECRET=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development
EOF
```

#### Frontend Setup

```bash
# Create frontend directory
cd ../
mkdir -p frontend
cd frontend

# Initialize React + TypeScript project with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install react-router-dom @tanstack/react-query axios react-hook-form zod @hookform/resolvers date-fns @headlessui/react @heroicons/react

# Install dev dependencies
npm install -D tailwindcss autoprefixer postcss

# Initialize Tailwind
npx tailwindcss init -p

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF
```

#### Database Setup (Docker)

```bash
# Start PostgreSQL in Docker
docker run --name mojitermini-db \
  -e POSTGRES_DB=mojitermini \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine

# Verify database is running
docker ps
```

### Step 3: Initialize Backend Project Structure

```bash
cd backend

# Create directory structure
mkdir -p app/{models,schemas,api/v1,services,utils,tasks}
touch app/__init__.py
touch app/main.py
touch app/config.py
touch app/database.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/api/__init__.py
touch app/api/deps.py
touch app/api/v1/__init__.py
touch app/services/__init__.py
touch app/utils/__init__.py
touch app/tasks/__init__.py

# Initialize Alembic (database migrations)
alembic init alembic
```

### Step 4: Start with Phase 1 (Foundation)

**Goal:** Authentication and basic database setup

1. **Define database models** (see `MVP_PLAN.md` for schema)
   - `app/models/user.py`
   - `app/models/clinic.py`

2. **Create Pydantic schemas**
   - `app/schemas/user.py`
   - `app/schemas/auth.py`

3. **Implement authentication**
   - `app/utils/security.py` (JWT + password hashing)
   - `app/api/v1/auth.py` (login endpoint)

4. **Setup FastAPI app**
   - `app/main.py` (initialize app, include routers)

5. **Create first migration**
   ```bash
   alembic revision --autogenerate -m "initial tables"
   alembic upgrade head
   ```

6. **Test authentication**
   ```bash
   uvicorn app.main:app --reload
   # Visit http://localhost:8000/docs for API docs
   ```

### Step 5: Continue with Remaining Phases

Follow the **Development Phases** in `MVP_PLAN.md`:
- Week 1-2: Foundation ✅ (you'll be here)
- Week 3: Patient Management
- Week 4: Service Types & Settings
- Week 5-6: Appointment Scheduling
- Week 7: SMS Reminders
- Week 8: Polish & Testing

---

## 🤖 Using AI Context During Development

When working with Claude Code or other AI assistants:

### Example Prompts

**Starting a new feature:**
```
I need to implement patient management (CRUD).
Please read:
- .ai-context/backend/ARCHITECTURE.md
- .ai-context/CONVENTIONS.md
- MVP_PLAN.md (Patient Management section)

Then create:
1. app/models/patient.py
2. app/schemas/patient.py
3. app/services/patient_service.py
4. app/api/v1/patients.py
```

**Reviewing code:**
```
Review this appointment service code against our standards.
Check:
- .ai-context/CONVENTIONS.md (Python conventions)
- .ai-context/backend/ARCHITECTURE.md (service layer patterns)
```

**Adding a feature:**
```
I want to add SMS reminders. Reference:
- MVP_PLAN.md (SMS Integration section)
- .ai-context/TECH_STACK.md (APScheduler setup)
```

---

## 📚 Key Documents Reference

| File | Use When |
|------|----------|
| `MVP_PLAN.md` | Understanding requirements, API structure, DB schema |
| `.ai-context/PROJECT_OVERVIEW.md` | Understanding business goals, target users |
| `.ai-context/TECH_STACK.md` | Setting up dependencies, understanding technology choices |
| `.ai-context/CONVENTIONS.md` | Writing code (naming, formatting, patterns) |
| `.ai-context/backend/ARCHITECTURE.md` | Understanding backend structure, layers |

---

## 🎬 Development Workflow

### Daily Workflow

1. **Pick a task** from current phase
2. **Read relevant context** files
3. **Implement feature** following conventions
4. **Test manually** (use FastAPI `/docs` or frontend)
5. **Commit** with conventional commit message
   ```bash
   git add .
   git commit -m "feat: add patient CRUD endpoints"
   ```

### Using AI Assistants

**Before implementing:**
- Share relevant `.ai-context` files
- Reference specific sections of `MVP_PLAN.md`

**During implementation:**
- Ask AI to follow conventions
- Request code that matches existing patterns

**After implementation:**
- Ask AI to review against standards
- Check for missing error handling, validation

---

## 🧪 Testing Your Work

### Backend Testing

```bash
# Start backend server
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Access API docs
# http://localhost:8000/docs

# Test endpoints manually via Swagger UI
```

### Frontend Testing

```bash
# Start frontend dev server
cd frontend
npm run dev

# Visit http://localhost:5173
```

### Database Inspection

```bash
# Connect to database
docker exec -it mojitermini-db psql -U admin -d mojitermini

# Run queries
\dt                    # List tables
SELECT * FROM users;   # Query data
\q                     # Exit
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# Check logs
docker logs mojitermini-db

# Restart container
docker restart mojitermini-db
```

### Backend Issues

```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt

# Check environment variables
cat .env
```

### Frontend Issues

```bash
# Check Node version
node --version  # Should be 20+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 SMS Provider Setup (Later)

When you reach Week 7 (SMS Integration):

1. **Sign up for Serpent.rs**
   - Visit: https://serpent.rs
   - Create account
   - Get API key

2. **Add to environment variables**
   ```bash
   # backend/.env
   SMS_GATEWAY_URL=https://api.serpent.rs/v1/send
   SMS_API_KEY=your_api_key_here
   SMS_SENDER_NAME=MojiTermini
   ```

3. **Test SMS sending**
   - Use test endpoint in API

---

## 🚀 Deployment (After MVP Complete)

When ready to deploy (Week 8+):

1. **Setup VPS** (Hetzner, DigitalOcean, or Serbian provider)
2. **Install Docker & Docker Compose** on VPS
3. **Clone repository** to VPS
4. **Configure production environment variables**
5. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```
6. **Setup SSL** with Let's Encrypt
7. **Configure domain** (e.g., mojitermini.rs)

See `MVP_PLAN.md` → Deployment Architecture section for details.

---

## 📊 Progress Tracking

Create a simple checklist:

```markdown
## Phase 1: Foundation (Week 1-2)
- [ ] PostgreSQL setup
- [ ] Backend project structure
- [ ] Database models (User, Clinic)
- [ ] Authentication (login, JWT)
- [ ] Frontend project structure
- [ ] Login page
- [ ] Protected routes

## Phase 2: Patient Management (Week 3)
- [ ] Patient model
- [ ] Patient API endpoints
- [ ] Patient UI (list, form)
- [ ] Search functionality

... (continue for all phases)
```

---

## 💡 Tips for Success

1. **Start small** - Don't try to build everything at once
2. **Test frequently** - Use `/docs` endpoint to test backend
3. **Commit often** - Small, focused commits
4. **Follow conventions** - Use Black, Prettier for formatting
5. **Read context files** - They contain important decisions
6. **Ask questions** - Use AI assistants with context files
7. **Keep it simple** - MVP first, polish later

---

## 📝 Questions to Answer Before Starting

1. **Domain name:** Do you have a domain? (e.g., mojitermini.rs)
2. **SMS provider:** Will you use Serpent.rs or another provider?
3. **Hosting:** Where will you deploy? (VPS provider?)
4. **Timeline:** When do you want to launch beta?
5. **Beta testers:** Do you have clinics willing to test?

---

## 🎓 Learning Resources

- **FastAPI Tutorial:** https://fastapi.tiangolo.com/tutorial/
- **React Docs:** https://react.dev/learn
- **SQLAlchemy Tutorial:** https://docs.sqlalchemy.org/en/20/tutorial/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🤝 Contributing (Future)

If you plan to work with a team later:

1. Create CONTRIBUTING.md
2. Setup CI/CD (GitLab CI recommended)
3. Code review process
4. Testing requirements

---

## 📄 License

Decide on license:
- **Proprietary** (closed source, commercial)
- **MIT** (open source, permissive)
- **GPL** (open source, copyleft)

---

## ✅ Ready to Start?

**Your immediate next actions:**

1. ✅ Review `MVP_PLAN.md` thoroughly
2. ✅ Setup development environment (Step 2 above)
3. ✅ Create backend and frontend projects (Step 3-4)
4. ✅ Start Phase 1: Foundation
5. ✅ Use `.ai-context/` files when working with AI

---

**Questions?** Reference the documents or ask Claude Code for help!

**Good luck building Moji Termini! 🚀**

---

**Last Updated:** 2026-05-04  
**Status:** Ready for Development

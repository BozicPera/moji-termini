# Moji Termini

**Appointment Scheduling System for Small Clinics in Serbia**

---

## 📖 About

Moji Termini is a web-based appointment scheduling application designed specifically for small clinics in Serbia (dental, general practice, physiotherapy). 

**Key Features:**
- 📅 Visual appointment calendar with time slots
- 📱 Automated SMS reminders (24h before appointments)
- 👥 Patient database with search
- 🔐 Multi-user staff access
- 📊 Basic appointment statistics
- ⚙️ Configurable clinic settings

---

## 🚀 Project Status

**Current Phase:** Planning Complete, Ready for Development  
**MVP Timeline:** 8-10 weeks  
**Target Launch:** Beta testing with 3-5 clinics

---

## 📁 Documentation

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - Start here! Setup guide and first steps
- **[MVP_PLAN.md](./MVP_PLAN.md)** - Complete technical specification

### AI Context (for development with AI assistants)
- **[.ai-context/README.md](./.ai-context/README.md)** - How to use AI context files
- **[.ai-context/PROJECT_OVERVIEW.md](./.ai-context/PROJECT_OVERVIEW.md)** - Vision, goals, users
- **[.ai-context/TECH_STACK.md](./.ai-context/TECH_STACK.md)** - Technologies and tools
- **[.ai-context/CONVENTIONS.md](./.ai-context/CONVENTIONS.md)** - Code style and standards
- **[.ai-context/backend/ARCHITECTURE.md](./.ai-context/backend/ARCHITECTURE.md)** - Backend structure

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL 15
- **ORM:** SQLAlchemy 2.0
- **Auth:** JWT (python-jose)
- **Background Jobs:** APScheduler
- **SMS:** Serpent.rs (Serbian SMS gateway)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **State:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI

### DevOps
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (Certbot)
- **Hosting:** VPS (Hetzner/DigitalOcean)

---

## 🏗️ Project Structure (Planned)

```
moji-termini/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── api/            # API routes
│   │   ├── services/       # Business logic
│   │   └── tasks/          # Background jobs
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   └── requirements.txt
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── .ai-context/            # AI assistant context files
├── docs/                   # Additional documentation
├── docker-compose.yml      # Docker orchestration
└── README.md               # This file
```

---

## 🎯 MVP Features

### Version 1.0 (8 weeks)

**Authentication & Users**
- Staff login with email/password
- Multi-user support (each staff member has own login)

**Patient Management**
- Create, edit, delete patients
- Search by name/phone
- Basic info: name, phone, email

**Appointment Scheduling**
- Calendar view with time slots
- Book, edit, cancel appointments
- Prevent double bookings
- Fields: patient, service, date, time, reason, notes

**Service Types**
- Define clinic services (e.g., "Pregled", "Čišćenje zuba")
- Color-coded for calendar

**SMS Reminders**
- Automated SMS sent 24 hours before appointment
- One-way notification

**Clinic Settings**
- Configure working hours
- Set time slot duration (15, 30, 60 min)
- Clinic basic info

**Statistics**
- Total appointments by status
- Utilization rate
- Daily/weekly breakdown

---

## 📅 Development Roadmap

### Phase 1: Foundation (Week 1-2)
- Setup FastAPI backend
- Setup React frontend
- Database schema & migrations
- Authentication (JWT)
- Basic layout

### Phase 2: Patient Management (Week 3)
- Patient CRUD endpoints
- Patient UI (list, form, search)

### Phase 3: Core Features (Week 4-5)
- Service types management
- Clinic settings
- Appointment calendar
- Appointment booking/editing

### Phase 4: SMS Integration (Week 6)
- SMS gateway integration (Serpent.rs)
- Background job for reminders
- SMS logging

### Phase 5: Polish (Week 7)
- Statistics dashboard
- Error handling
- Loading states
- Responsive design

### Phase 6: Testing & Deploy (Week 8)
- End-to-end testing
- Bug fixes
- Production deployment
- Documentation

### Phase 7: Beta Testing (Week 9-10)
- Onboard 3-5 beta clinics
- Gather feedback
- Iterate

---

## 🚦 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20 LTS
- PostgreSQL 15+
- Docker (optional)

### Quick Setup

```bash
# Clone repository (when created)
git clone <repo-url>
cd moji-termini

# Start database
docker run --name mojitermini-db \
  -e POSTGRES_DB=mojitermini \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:15-alpine

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

**For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)**

---

## 📚 Documentation Structure

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `README.md` | Project overview (you are here) | First time visiting repo |
| `QUICKSTART.md` | Development setup guide | Before starting development |
| `MVP_PLAN.md` | Complete technical spec | During implementation |
| `.ai-context/` | AI assistant context | When using AI for development |

---

## 🤝 Contributing

This is currently a solo project. Contributing guidelines will be added if the project opens to contributors.

---

## 📄 License

To be determined (proprietary/open source decision pending)

---

## 👤 Author

**Petar** - DevOps Engineer (10+ years experience)

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/username/moji-termini/issues) (when repo created)
- **Email:** [your-email@example.com]

---

## 🎯 Vision

To become the go-to appointment scheduling solution for small clinics across Serbia, reducing no-shows and simplifying clinic management through automation and excellent user experience.

**Mission:** Help clinic staff focus on patient care, not administrative chaos.

---

## 🙏 Acknowledgments

- FastAPI community for excellent documentation
- React community for modern frontend tools
- Serbian clinic owners who provided initial feedback

---

**Last Updated:** 2026-05-04  
**Status:** Planning Complete ✅ | Development Starting Soon 🚀

# Tech Stack - Moji Termini

## Overview

**Architecture:** Monolithic with separate frontend and backend  
**Deployment:** Docker Compose on VPS  
**Language:** Python (backend), TypeScript (frontend)

---

## Backend Stack

### Core Framework

**FastAPI 0.110.0**
- Modern Python web framework
- Automatic API documentation (Swagger/OpenAPI)
- High performance (comparable to Node.js)
- Built-in validation with Pydantic
- Async support

**Why FastAPI?**
- ✅ Fast development
- ✅ Type safety with Pydantic
- ✅ Auto-generated API docs
- ✅ Great for building REST APIs
- ✅ Active community

### Web Server

**Uvicorn 0.29.0** (ASGI server)
- Production-ready
- HTTP/2 support
- Auto-reload in development

**Configuration:**
```python
# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2

# Development
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Database

**PostgreSQL 15**
- Reliable, battle-tested
- ACID compliant
- JSON support (for future flexibility)
- Strong ecosystem

**ORM:** SQLAlchemy 2.0.29
- Python SQL toolkit and ORM
- Type-safe queries
- Migration support via Alembic

**Why PostgreSQL?**
- ✅ Open-source, no licensing costs
- ✅ Excellent for relational data (appointments, patients)
- ✅ Strong community support
- ✅ Great performance for small-medium workloads

### Database Migrations

**Alembic 1.13.1**
- Database migration tool for SQLAlchemy
- Version control for database schema
- Rollback support

**Commands:**
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Authentication

**JWT (JSON Web Tokens)**
- Stateless authentication
- Token-based (no server-side sessions)
- Secure, standard approach

**Libraries:**
- `python-jose[cryptography] 3.3.0` - JWT encoding/decoding
- `passlib[bcrypt] 1.7.4` - Password hashing (bcrypt algorithm)

**Security:**
- Passwords: bcrypt hashed (10 rounds)
- JWT: HS256 algorithm
- Token expiry: 24 hours (configurable)
- Refresh tokens: Post-MVP

### Background Jobs

**APScheduler 3.10.4**
- Python job scheduling library
- Cron-like scheduling
- In-process (for MVP, no separate worker needed)

**Use Cases:**
- SMS reminders (runs every hour)
- Cleanup old logs (runs daily)

**Alternative Considerations (Future):**
- Celery + Redis (if jobs become complex)
- Dramatiq (lighter than Celery)

### HTTP Client

**httpx 0.27.0**
- Modern HTTP client (successor to requests)
- Async support
- HTTP/2 support

**Use Case:**
- Calling SMS gateway API

### Validation & Settings

**Pydantic 2.7.0**
- Data validation using Python type hints
- Settings management

**Pydantic Settings 2.2.1**
- Environment variable management
- Type-safe configuration

### Testing

**pytest 8.1.1**
- Python testing framework
- Fixtures, parametrize, plugins

**pytest-asyncio 0.23.6**
- Async test support for FastAPI

**Coverage:**
```bash
pytest --cov=app --cov-report=html
```

### Code Quality

**Black 24.3.0**
- Code formatter (PEP 8 compliant)
- Zero-configuration

**Ruff 0.3.5**
- Fast Python linter (Rust-based)
- Replaces Flake8, isort, pyupgrade

**Configuration (.ruff.toml):**
```toml
line-length = 100
target-version = "py311"
```

### Backend Dependencies (requirements.txt)

```txt
# Core
fastapi==0.110.0
uvicorn[standard]==0.29.0
python-multipart==0.0.9

# Database
sqlalchemy==2.0.29
psycopg2-binary==2.9.9
alembic==1.13.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Background Jobs
apscheduler==3.10.4

# HTTP Client
httpx==0.27.0

# Validation & Settings
pydantic==2.7.0
pydantic-settings==2.2.1

# Testing
pytest==8.1.1
pytest-asyncio==0.23.6
pytest-cov==5.0.0

# Code Quality
black==24.3.0
ruff==0.3.5
```

---

## Frontend Stack

### Core Framework

**React 18.2.0**
- Component-based UI library
- Virtual DOM for performance
- Huge ecosystem

**TypeScript 5.2.2**
- Type safety
- Better IDE support
- Catch errors at compile time

**Why React + TypeScript?**
- ✅ Industry standard
- ✅ Large community
- ✅ Excellent for complex UIs (calendar, forms)
- ✅ Type safety reduces bugs

### Build Tool

**Vite 5.2.0**
- Fast development server (HMR)
- Optimized production builds
- Modern ESM-based

**Why Vite?**
- ✅ Much faster than Create React App
- ✅ Simple configuration
- ✅ Built-in TypeScript support

**Commands:**
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Routing

**React Router DOM 6.22.3**
- Client-side routing
- Protected routes
- Nested routes

**Routes Structure:**
```
/login              → LoginPage
/                   → DashboardPage (protected)
/calendar           → CalendarPage (protected)
/patients           → PatientsPage (protected)
/settings           → SettingsPage (protected)
/stats              → StatsPage (protected)
```

### State Management

**TanStack React Query 5.29.0**
- Server state management
- Automatic caching
- Background refetching
- Optimistic updates

**Why React Query?**
- ✅ Perfect for API-heavy apps
- ✅ Reduces boilerplate
- ✅ Built-in loading/error states
- ✅ Cache invalidation made easy

**Example:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['appointments', date],
  queryFn: () => fetchAppointments(date)
});
```

### HTTP Client

**Axios 1.6.8**
- HTTP client for API calls
- Request/response interceptors
- Automatic JSON parsing

**Configuration:**
```typescript
// JWT token automatically added to headers
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Forms

**React Hook Form 7.51.2**
- Performant form library
- Minimal re-renders
- Easy validation

**Zod 3.22.4**
- Schema validation
- TypeScript-first
- Integrates with React Hook Form

**Example:**
```typescript
const schema = z.object({
  full_name: z.string().min(2, 'Name too short'),
  phone: z.string().regex(/^\+381\d{8,9}$/, 'Invalid phone'),
  email: z.string().email().optional()
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### Date Handling

**date-fns 3.6.0**
- Modern date utility library
- Immutable, pure functions
- Tree-shakeable (small bundle size)

**Why date-fns?**
- ✅ Lighter than Moment.js
- ✅ Functional approach
- ✅ Great TypeScript support

**Common functions:**
```typescript
import { format, addDays, parseISO } from 'date-fns';

format(new Date(), 'yyyy-MM-dd');
addDays(new Date(), 1);
```

### UI & Styling

**Tailwind CSS 3.4.3**
- Utility-first CSS framework
- Rapid development
- Responsive design built-in

**Autoprefixer 10.4.19**
- Adds vendor prefixes automatically

**PostCSS 8.4.38**
- CSS processor (required by Tailwind)

**Why Tailwind?**
- ✅ Fast prototyping
- ✅ Consistent design system
- ✅ Small production bundle (unused classes purged)
- ✅ No CSS file management

**Headless UI 1.7.18**
- Unstyled, accessible UI components
- Modal, Dropdown, Tabs, etc.
- Made by Tailwind team

**Heroicons 2.1.3**
- Beautiful SVG icons
- Tailwind-friendly

### Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "@tanstack/react-query": "^5.29.0",
    "axios": "^1.6.8",
    "react-hook-form": "^7.51.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.6.0",
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  }
}
```

---

## Database

### PostgreSQL 15

**Connection:**
```python
# SQLAlchemy connection string
DATABASE_URL = "postgresql://user:password@localhost:5432/mojitermini"
```

**Docker:**
```bash
docker run --name mojitermini-db \
  -e POSTGRES_DB=mojitermini \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine
```

**Backup Strategy:**
```bash
# Daily backups via cron
pg_dump -U admin mojitermini > backup_$(date +%F).sql
```

---

## DevOps & Deployment

### Containerization

**Docker**
- Containerization platform
- Consistent environments (dev/prod)

**Docker Compose**
- Multi-container orchestration
- Services: frontend, backend, database, nginx

**docker-compose.yml:**
```yaml
services:
  db:
    image: postgres:15-alpine
  backend:
    build: ./backend
  frontend:
    build: ./frontend
  nginx:
    image: nginx:alpine
```

### Web Server (Production)

**Nginx**
- Reverse proxy
- SSL termination
- Static file serving
- Load balancing (future)

**Certbot**
- Free SSL certificates (Let's Encrypt)
- Auto-renewal

### Version Control

**Git**
- Version control system

**GitLab** (recommended, given your experience)
- Code repository
- CI/CD pipelines

**Branching Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Urgent fixes

### CI/CD

**GitLab CI** (recommended)
```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - pytest
    - npm run test

build:
  stage: build
  script:
    - docker build -t mojitermini:$CI_COMMIT_SHA .

deploy:
  stage: deploy
  script:
    - docker-compose up -d
  only:
    - main
```

**Alternative:** GitHub Actions (if using GitHub)

### Hosting Options

**VPS Providers (Recommended for Serbia):**
1. **Hetzner** (Germany) - €5-20/month
   - Good latency to Serbia
   - Excellent value
   
2. **DigitalOcean** - $6-20/month
   - Easy to use
   - Good documentation

3. **Serbian Providers:**
   - ServerNet.rs
   - Host.rs

**Requirements (MVP):**
- 2 CPU cores
- 4 GB RAM
- 50 GB SSD
- ~€10-15/month

**Alternative (Simple Deployment):**
- **Render.com** - Easy deployment, free tier available
- **Railway.app** - Similar to Render, PostgreSQL included

### Monitoring & Logging

**MVP (Simple):**
- Python logging to files
- Nginx access/error logs
- PostgreSQL logs

**Post-MVP (Advanced):**
- **Sentry** - Error tracking
- **Grafana + Prometheus** - Metrics
- **ELK Stack** - Log aggregation

---

## SMS Integration

### SMS Provider

**Serpent.rs** (Recommended)
- Serbian SMS gateway
- REST API
- ~0.50-1.00 RSD per SMS

**API:**
```python
POST https://api.serpent.rs/v1/send
Headers:
  Authorization: Bearer <api_key>
Body:
  {
    "to": "+381641234567",
    "from": "MojiTermini",
    "text": "Your appointment reminder..."
  }
```

**Alternatives:**
- SMS Broker (smsbroker.rs)
- Twilio (international, more expensive)

---

## Development Tools

### Code Editors

**VS Code** (Recommended)
- Extensions: Python, Pylance, ESLint, Prettier, Tailwind IntelliSense

**PyCharm** (Alternative)
- Full-featured Python IDE

### API Testing

**Built-in FastAPI Docs**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

**Postman** (Alternative)
- API testing and documentation

### Database Tools

**psql** (CLI)
```bash
psql -U admin -d mojitermini
```

**pgAdmin** (GUI)
- Web-based PostgreSQL admin

**DBeaver** (Alternative)
- Universal database tool

### Design Tools

**Figma** (UI Design)
- Mockups, wireframes

**Excalidraw** (Diagrams)
- Architecture diagrams, flowcharts

**dbdiagram.io** (Database Design)
- Entity-relationship diagrams

---

## Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/mojitermini

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# SMS
SMS_GATEWAY_URL=https://api.serpent.rs/v1/send
SMS_API_KEY=your-sms-api-key
SMS_SENDER_NAME=MojiTermini

# Application
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173

# Logging
LOG_LEVEL=INFO
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000
```

---

## Version Requirements

### Python
- **Version:** 3.11+
- **Why:** Modern Python features, performance improvements

### Node.js
- **Version:** 20 LTS
- **Why:** Active LTS, stable

### PostgreSQL
- **Version:** 15+
- **Why:** Latest stable, JSON support

---

## Browser Support

### Target Browsers
- Chrome/Edge 100+
- Firefox 100+
- Safari 15+

**No IE11 support** (use modern features)

---

## Performance Targets

### Backend
- API response time: < 200ms (p95)
- Database queries: < 50ms (p95)
- Concurrent users: 50+ (MVP)

### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Database
- Connection pooling: 10-20 connections
- Indexes on frequently queried columns

---

## Security

### Best Practices
- ✅ HTTPS everywhere (Let's Encrypt)
- ✅ Passwords hashed (bcrypt, 10 rounds)
- ✅ JWT tokens (HS256, 24h expiry)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS configuration (whitelist origins)
- ✅ Rate limiting (future: nginx or FastAPI middleware)
- ✅ Environment variables for secrets (no hardcoding)

### Compliance
- **GDPR considerations** (patient data)
  - Right to erasure (soft delete patients)
  - Data portability (export appointments)
  - Consent for SMS reminders

---

## Future Tech Stack Considerations

### Scaling (If needed)
- **Redis:** Caching, session storage
- **Celery:** Distributed task queue (replace APScheduler)
- **PostgreSQL Read Replicas:** Separate read/write databases
- **CDN:** CloudFlare for static assets

### Mobile Apps
- **React Native:** Cross-platform (iOS/Android)
- **Alternative:** Progressive Web App (PWA) first

### Advanced Features
- **WebSockets:** Real-time calendar updates (if multiple users)
- **Elasticsearch:** Advanced patient search
- **S3/MinIO:** File storage (patient documents, images)

---

**Last Updated:** 2026-05-04  
**Review Frequency:** Quarterly or after major stack changes

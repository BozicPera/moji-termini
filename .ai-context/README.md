# AI Context for Moji Termini Development

This directory contains structured context files to help AI assistants (like Claude Code) understand the project architecture, conventions, and development guidelines.

## Purpose

When working with AI coding assistants during development, reference these files to:
- Maintain consistency across the codebase
- Follow established patterns and conventions
- Understand the system architecture
- Make informed decisions about implementation details

## Directory Structure

```
.ai-context/
├── README.md                    # This file
├── PROJECT_OVERVIEW.md          # High-level project description
├── TECH_STACK.md                # Detailed tech stack and dependencies
├── CONVENTIONS.md               # Code style, naming, patterns
├── backend/
│   ├── ARCHITECTURE.md          # Backend architecture overview
│   ├── API_DESIGN.md            # API endpoint patterns and conventions
│   ├── DATABASE.md              # Database schema and relationships
│   ├── AUTHENTICATION.md        # Auth flow and security
│   └── SMS_INTEGRATION.md       # SMS service implementation
├── frontend/
│   ├── ARCHITECTURE.md          # Frontend structure and patterns
│   ├── COMPONENTS.md            # Component guidelines
│   ├── STATE_MANAGEMENT.md      # React Query patterns
│   └── ROUTING.md               # Route structure
├── database/
│   ├── SCHEMA.md                # Database schema documentation
│   └── MIGRATIONS.md            # Migration guidelines
└── deployment/
    ├── DOCKER.md                # Docker setup and configuration
    └── PRODUCTION.md            # Production deployment guide
```

## How to Use

### For Developers

When starting a new feature or fixing a bug, review relevant context files:

1. **New API endpoint?** → Read `backend/API_DESIGN.md` and `backend/ARCHITECTURE.md`
2. **New React component?** → Read `frontend/COMPONENTS.md` and `frontend/ARCHITECTURE.md`
3. **Database changes?** → Read `database/SCHEMA.md` and `database/MIGRATIONS.md`
4. **Deployment issues?** → Read `deployment/DOCKER.md` and `deployment/PRODUCTION.md`

### For AI Assistants

When assisting with development:

1. **Start with:** `PROJECT_OVERVIEW.md` and `TECH_STACK.md` for context
2. **Check conventions:** `CONVENTIONS.md` for code style
3. **Reference specific guides:** Based on the task at hand

Example prompts:
```
"I need to add a new API endpoint for exporting appointments. 
Please read .ai-context/backend/API_DESIGN.md and follow the patterns."

"Create a new React component for displaying patient history. 
Check .ai-context/frontend/COMPONENTS.md for our conventions."
```

## Keeping Context Updated

These files should be updated when:
- Architecture changes (new patterns, major refactoring)
- Tech stack changes (new dependencies, version upgrades)
- Conventions evolve (team decides on new standards)
- New features add significant complexity

## Files Overview

### Core Context Files

#### `PROJECT_OVERVIEW.md`
- Project goals and vision
- Target users
- Key features
- Problem being solved

#### `TECH_STACK.md`
- Backend stack (FastAPI, PostgreSQL, etc.)
- Frontend stack (React, TypeScript, etc.)
- Development tools
- Version requirements

#### `CONVENTIONS.md`
- Code formatting (Black, Prettier)
- Naming conventions
- File organization
- Comment standards
- Git commit messages

### Backend Context

#### `backend/ARCHITECTURE.md`
- Folder structure
- Layer separation (routes → services → models)
- Dependency injection patterns
- Error handling

#### `backend/API_DESIGN.md`
- REST conventions
- Request/response formats
- Error responses
- Pagination patterns
- Authentication headers

#### `backend/DATABASE.md`
- ORM patterns (SQLAlchemy)
- Query optimization
- Transaction handling
- Connection pooling

#### `backend/AUTHENTICATION.md`
- JWT implementation
- Password hashing
- Token refresh strategy
- Role-based access control

#### `backend/SMS_INTEGRATION.md`
- SMS provider setup
- Background job patterns
- Retry logic
- Error handling

### Frontend Context

#### `frontend/ARCHITECTURE.md`
- Component hierarchy
- State management strategy
- API client setup
- Routing structure

#### `frontend/COMPONENTS.md`
- Component patterns (presentational vs. container)
- Props conventions
- TypeScript types
- Styling approach (Tailwind)

#### `frontend/STATE_MANAGEMENT.md`
- React Query usage
- Cache invalidation
- Optimistic updates
- Error handling

#### `frontend/ROUTING.md`
- Route structure
- Protected routes
- Route parameters
- Navigation patterns

### Database Context

#### `database/SCHEMA.md`
- Entity relationships
- Indexes
- Constraints
- Data types

#### `database/MIGRATIONS.md`
- Alembic workflow
- Migration naming
- Rollback strategy
- Data migrations

### Deployment Context

#### `deployment/DOCKER.md`
- Docker Compose setup
- Environment variables
- Volume management
- Networking

#### `deployment/PRODUCTION.md`
- VPS setup
- Nginx configuration
- SSL/TLS setup
- Backup strategy
- Monitoring

## Examples

### Example 1: Adding a New API Endpoint

**Context to read:**
1. `.ai-context/backend/API_DESIGN.md` - Understand endpoint patterns
2. `.ai-context/backend/ARCHITECTURE.md` - Know where to place code
3. `.ai-context/CONVENTIONS.md` - Follow naming conventions

**Result:** Consistent API endpoint following project standards

### Example 2: Creating a New Feature (Patient History)

**Context to read:**
1. `.ai-context/PROJECT_OVERVIEW.md` - Understand if feature fits vision
2. `.ai-context/database/SCHEMA.md` - See if DB changes needed
3. `.ai-context/backend/ARCHITECTURE.md` - Plan backend changes
4. `.ai-context/frontend/ARCHITECTURE.md` - Plan frontend changes

**Result:** Well-architected feature integrated cleanly

### Example 3: Fixing a Bug in SMS Reminders

**Context to read:**
1. `.ai-context/backend/SMS_INTEGRATION.md` - Understand current implementation
2. `.ai-context/backend/ARCHITECTURE.md` - Understand background jobs

**Result:** Bug fix without breaking existing patterns

## Best Practices

1. **Always read context before implementing** - Don't guess patterns
2. **Update context when patterns change** - Keep it current
3. **Reference specific sections** - Link to relevant docs in PRs
4. **Ask questions if context is unclear** - Improve the docs
5. **Keep context concise** - Focus on decisions and patterns, not obvious details

## Maintenance

**Responsibility:** Lead developer or tech lead should review and update quarterly or after major changes.

**Review checklist:**
- [ ] Are architectural decisions still current?
- [ ] Do code examples still match codebase?
- [ ] Are new patterns documented?
- [ ] Are deprecated patterns removed?
- [ ] Is tech stack info up to date?

---

**Last Updated:** 2026-05-04  
**Maintained By:** Development Team

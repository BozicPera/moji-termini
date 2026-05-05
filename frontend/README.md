# Moji Termini - Frontend

React + TypeScript frontend for Moji Termini appointment scheduling system.

## Tech Stack

- **React** 18.2 - UI library
- **TypeScript** 5.2 - Type safety
- **Vite** 5.2 - Build tool
- **React Router** 6.22 - Routing
- **TanStack Query** 5.29 - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** 3.4 - Styling
- **React Hook Form** + **Zod** - Forms & validation

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # Auth components (PrivateRoute, etc.)
│   │   ├── layout/        # Layout components (future)
│   │   └── common/        # Reusable components (future)
│   ├── pages/
│   │   ├── LoginPage.tsx  # Login page
│   │   └── DashboardPage.tsx  # Dashboard (home)
│   ├── api/
│   │   ├── client.ts      # Axios client with interceptors
│   │   └── auth.ts        # Auth API calls
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── hooks/             # Custom hooks (future)
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── utils/             # Utility functions (future)
│   ├── styles/
│   │   └── globals.css    # Global styles + Tailwind
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## Features (Phase 1)

### ✅ Authentication
- Login page with email/password
- JWT token storage in localStorage
- Protected routes
- Auto-redirect on 401 (unauthorized)
- Logout functionality

### ✅ Routing
- `/login` - Login page (public)
- `/dashboard` - Dashboard (protected)
- `/` - Redirects to dashboard

### ✅ State Management
- Auth context for global auth state
- React Query for server state (ready for use)
- LocalStorage persistence

## Usage

### Test Login

1. Start backend (`uvicorn app.main:app --reload`)
2. Start frontend (`npm run dev`)
3. Go to `http://localhost:5173`
4. Login with:
   - Email: `doctor@clinic.rs`
   - Password: `password123`

### Adding New Pages

1. Create page in `src/pages/`:
```typescript
// src/pages/PatientsPage.tsx
export default function PatientsPage() {
  return <div>Patients Page</div>;
}
```

2. Add route in `App.tsx`:
```typescript
<Route
  path="/patients"
  element={
    <PrivateRoute>
      <PatientsPage />
    </PrivateRoute>
  }
/>
```

### Making API Calls

Use the API client with React Query:

```typescript
// src/api/patients.ts
import apiClient from './client';

export const patientsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/patients');
    return response.data;
  },
};

// In component
import { useQuery } from '@tanstack/react-query';
import { patientsAPI } from '@/api/patients';

function PatientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsAPI.getAll,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  return <div>{/* Render patients */}</div>;
}
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Styling

### Tailwind CSS

Primary color: `#3B82F6` (blue)

Usage:
```tsx
<button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
  Click me
</button>
```

Custom colors defined in `tailwind.config.js`:
- `primary` - Main blue color
- `primary-dark` - Darker blue
- `primary-light` - Lighter blue
- `secondary` - Green accent

## TypeScript

Types are defined in `src/types/index.ts`.

Example:
```typescript
import type { User, LoginCredentials } from '@/types';

const user: User = {
  id: 1,
  email: "test@example.com",
  full_name: "Test User",
  role: "admin",
  clinic_id: 1,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z"
};
```

## Common Issues

### API Connection Error

Make sure backend is running:
```bash
cd backend
uvicorn app.main:app --reload
```

### CORS Error

Check backend CORS settings in `backend/app/config.py`:
```python
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Port Already in Use

Change port in `vite.config.ts`:
```typescript
server: {
  port: 3000, // or any other port
}
```

## Next Steps (Phase 2)

1. **Patient Management**
   - Patient list page
   - Patient form (create/edit)
   - Patient search

2. **Layout Components**
   - Sidebar navigation
   - Header with user menu
   - Layout wrapper

3. **More Pages**
   - Calendar page
   - Settings page
   - Statistics page

See `../MVP_PLAN.md` for full roadmap.

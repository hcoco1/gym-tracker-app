
# Gym Tracker App

gym-tracker-app/
├── backend/                 # FastAPI backend
│   ├── alembic/            # Database migrations
│   ├── database.py         # SQLAlchemy models
│   ├── main.py             # FastAPI routes
│   └── ...                 # Other backend files
└── frontend/               # Next.js frontend
    ├── components/         # Reusable components
    │   ├── Navbar.tsx
    │   ├── WorkoutForm.tsx
    │   └── WorkoutHistory.tsx  # NEW - Add this
    ├── pages/              # Next.js pages
    │   ├── index.tsx       # Main dashboard
    │   └── ...
    ├── store/              # Zustand state management
    │   └── useWorkoutStore.ts
    └── ...                 # Other frontend files
    '

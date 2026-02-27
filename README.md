# MediTrack - Medical Appointment Management System

MERN-based project with:
- Role-Based Access Control (`patient`, `doctor`)
- Proper MVC backend architecture
- Dark, professional React frontend

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (with temporary in-memory fallback when `MONGO_URI` is not provided)

## Project Structure
```
appointment/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      store/
      utils/
  frontend/
    src/
      components/
      context/
      pages/
      services/
```

## Required API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Appointments
- `POST /api/appointments` (Patient only)
- `GET /api/appointments` (Patient & Doctor)
- `PUT /api/appointments/:id` (Doctor only, status = `approved` or `rejected`)

## Setup

### One Terminal (Recommended)
Run both backend + frontend together from project root:
```bash
npm run dev
```

Open app at:
- `http://localhost:5173`

### Separate Terminals (Optional)
### 1) Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Default Doctor Accounts (Auto-created)
On backend startup, the system automatically creates doctor accounts if they do not already exist:
- `meera.sharma@meditrack.com`
- `arjun.reddy@meditrack.com`
- `priya.nair@meditrack.com`

Password for all default doctors:
- `Doctor@123` (or value from `DEFAULT_DOCTOR_PASSWORD` in `backend/.env`)

## MongoDB Connection (Later)
When you are ready, open `backend/.env` and set:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
DEFAULT_DOCTOR_PASSWORD=Doctor@123
```

If `MONGO_URI` is missing, backend still starts in in-memory mode for demonstration and testing.

# AI INTERVIEW

Starter project for an AI-powered interview practice dashboard.

## Stack
- Frontend: React, Vite, Tailwind CSS v4, Recharts, Lucide React, Axios
- Backend: FastAPI, SQLAlchemy, PyMySQL
- Database: MySQL

## 1. Create MySQL database

Run in MySQL Workbench:

```sql
CREATE DATABASE ai_interview
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## 2. Start backend

Open terminal in `backend`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env`, then fill in your MySQL password.

```powershell
uvicorn main:app --reload
```

API docs: http://127.0.0.1:8000/docs
Connection test: http://127.0.0.1:8000/test-connection

## 3. Start frontend

Open another terminal in `frontend`:

```powershell
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## API routes
- `GET /api/dashboard`
- `GET /api/interviews`
- `POST /api/interviews`
- `GET /api/interviews/{id}`
- `PATCH /api/interviews/{id}`
- `DELETE /api/interviews/{id}`

The current project provides the dashboard and interview CRUD workflow. Actual AI question generation, speech recognition, and AI evaluation require integration with an AI provider and audio/video services.

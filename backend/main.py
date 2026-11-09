from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import Base, engine, SessionLocal
import models
from routers.interviews import router as interviews_router
from routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview API",
    description="API quản lý các buổi phỏng vấn cho hệ thống AI Interview.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interviews_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "AI Interview API is running"}


@app.get("/test-connection")
def test_connection():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"message": "MySQL connection successful"}
    finally:
        db.close()

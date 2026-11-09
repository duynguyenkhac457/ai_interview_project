from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Interview
from schemas import InterviewCreate, InterviewResponse, InterviewUpdate

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])


@router.get("", response_model=list[InterviewResponse])
def get_interviews(db: Session = Depends(get_db)):
    return db.query(Interview).order_by(Interview.created_at.desc()).all()


@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(payload: InterviewCreate, db: Session = Depends(get_db)):
    interview = Interview(
        title=payload.title.strip(),
        company=payload.company.strip() if payload.company else None,
        level=payload.level,
        status="scheduled",
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


@router.patch("/{interview_id}", response_model=InterviewResponse)
def update_interview(interview_id: int, payload: InterviewUpdate, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(interview, field, value)

    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.delete(interview)
    db.commit()
    return None

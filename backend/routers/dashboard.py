from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Interview

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    all_interviews = db.query(Interview).all()
    completed = [item for item in all_interviews if item.status == "completed"]
    scores = [item.score for item in completed if item.score is not None]
    average_score = round(sum(scores) / len(scores)) if scores else 0

    today = datetime.utcnow().date()
    start_of_week = today - timedelta(days=today.weekday())
    daily_counts = defaultdict(int)

    for item in all_interviews:
        if item.created_at.date() >= start_of_week:
            daily_counts[item.created_at.strftime("%a")] += 1

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_activity = [{"day": day, "interviews": daily_counts[day]} for day in days]

    monthly_scores = defaultdict(list)
    for item in completed:
        if item.score is not None:
            monthly_scores[item.created_at.strftime("%b")].append(item.score)

    month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    score_trend = [
        {"month": month, "score": round(sum(monthly_scores[month]) / len(monthly_scores[month]))}
        for month in month_order if monthly_scores.get(month)
    ]

    return {
        "total_interviews": len(all_interviews),
        "completed_interviews": len(completed),
        "average_score": average_score,
        "practice_hours": round(len(all_interviews) * 1.25, 1),
        "weekly_activity": weekly_activity,
        "score_trend": score_trend,
    }

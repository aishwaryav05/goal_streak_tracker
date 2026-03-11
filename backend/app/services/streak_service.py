from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.goal_completion import GoalCompletion


def calculate_streak(db: Session, goal_id: int) -> int:
    completions = (
        db.query(GoalCompletion)
        .filter(GoalCompletion.goal_id == goal_id, GoalCompletion.completed == True)
        .all()
    )

    if not completions:
        return 0

    completed_dates = {c.date for c in completions}

    streak = 0
    current = date.today()

    while current in completed_dates:
        streak += 1
        current -= timedelta(days=1)

    return streak

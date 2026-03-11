from datetime import date

from sqlalchemy.orm import Session

from app.models.goal_completion import GoalCompletion


def complete_goal(db: Session, goal_id: int) -> GoalCompletion:
    today = date.today()

    # Only one completion per goal per day
    existing = (
        db.query(GoalCompletion)
        .filter(GoalCompletion.goal_id == goal_id, GoalCompletion.date == today)
        .first()
    )

    if existing:
        return existing

    completion = GoalCompletion(
        goal_id=goal_id,
        date=today,
        completed=True,
    )
    db.add(completion)
    db.commit()
    db.refresh(completion)
    return completion

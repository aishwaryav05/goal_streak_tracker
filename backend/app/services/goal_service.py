from datetime import date, timedelta
from typing import List

from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.models.goal_completion import GoalCompletion
from app.schemas.goal_schema import GoalCreateSchema, GoalWithStatusSchema


def get_all_goals(db: Session, user_id: int | None) -> List[GoalWithStatusSchema]:
    query = db.query(Goal).filter(Goal.is_active == True)
    if user_id is not None:
        query = query.filter(Goal.user_id == user_id)
    goals = query.all()

    today = date.today()
    completed_goal_ids = {
        c.goal_id
        for c in db.query(GoalCompletion)
        .filter(
            GoalCompletion.date == today,
            GoalCompletion.completed == True,
            GoalCompletion.goal_id.in_([g.id for g in goals]),
        )
        .all()
    }

    return [
        GoalWithStatusSchema(
            id=g.id,
            title=g.title,
            description=g.description,
            is_active=g.is_active,
            completed_today=g.id in completed_goal_ids,
        )
        for g in goals
    ]


def create_goal(db: Session, user_id: int | None, goal_data: GoalCreateSchema) -> Goal:
    goal = Goal(
        user_id=user_id,
        title=goal_data.title,
        description=goal_data.description,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def delete_goal(db: Session, goal_id: int) -> None:
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if goal:
        goal.is_active = False
        db.commit()


def get_goal_history(db: Session, goal_id: int) -> List[dict]:
    completions = (
        db.query(GoalCompletion)
        .filter(GoalCompletion.goal_id == goal_id)
        .order_by(GoalCompletion.date.desc())
        .all()
    )
    return [
        {"date": str(c.date), "completed": c.completed,
         "miss_reason": c.miss_reason}
        for c in completions
    ]


def complete_yesterday(db: Session, goal_id: int, completed: bool, reason: str | None) -> dict:
    yesterday = date.today() - timedelta(days=1)
    existing = (
        db.query(GoalCompletion)
        .filter(GoalCompletion.goal_id == goal_id, GoalCompletion.date == yesterday)
        .first()
    )
    if existing:
        existing.completed = completed
        existing.miss_reason = reason
        db.commit()
        return {"date": str(yesterday), "completed": completed}
    record = GoalCompletion(
        goal_id=goal_id,
        date=yesterday,
        completed=completed,
        miss_reason=reason,
    )
    db.add(record)
    db.commit()
    return {"date": str(yesterday), "completed": completed}

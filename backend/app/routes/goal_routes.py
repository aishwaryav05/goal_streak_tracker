from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.goal_schema import (
    GoalCreateSchema,
    GoalResponseSchema,
    GoalWithStatusSchema,
    HistoryEntrySchema,
    YesterdaySchema,
)
from app.services.goal_service import (
    create_goal,
    delete_goal,
    get_all_goals,
    get_goal_history,
    complete_yesterday,
)
from app.services.completion_service import complete_goal
from app.services.streak_service import calculate_streak

router = APIRouter()


@router.get("/goals", response_model=List[GoalWithStatusSchema])
def get_goals_api(db: Session = Depends(get_db)):
    return get_all_goals(db=db, user_id=None)


@router.post("/goals", response_model=GoalResponseSchema)
def create_goal_api(goal_data: GoalCreateSchema, db: Session = Depends(get_db)):
    return create_goal(db=db, user_id=None, goal_data=goal_data)


@router.delete("/goals/{goal_id}")
def delete_goal_api(goal_id: int, db: Session = Depends(get_db)):
    delete_goal(db=db, goal_id=goal_id)
    return {"message": "Goal deleted"}


@router.post("/goals/{goal_id}/complete")
def complete_goal_api(goal_id: int, db: Session = Depends(get_db)):
    complete_goal(db=db, goal_id=goal_id)
    return {"message": "Goal marked complete for today"}


@router.get("/goals/{goal_id}/streak")
def get_streak_api(goal_id: int, db: Session = Depends(get_db)):
    streak = calculate_streak(db=db, goal_id=goal_id)
    return {"goal_id": goal_id, "current_streak": streak}


@router.get("/goals/{goal_id}/history", response_model=List[HistoryEntrySchema])
def get_history_api(goal_id: int, db: Session = Depends(get_db)):
    return get_goal_history(db=db, goal_id=goal_id)


@router.post("/goals/{goal_id}/yesterday")
def complete_yesterday_api(goal_id: int, body: YesterdaySchema, db: Session = Depends(get_db)):
    result = complete_yesterday(
        db=db, goal_id=goal_id, completed=body.completed, reason=body.reason)
    return result

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class GoalCreateSchema(BaseModel):
    title: str
    description: str


class GoalResponseSchema(BaseModel):
    id: int
    title: str
    description: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoalWithStatusSchema(BaseModel):
    id: int
    title: str
    description: str
    is_active: bool
    completed_today: bool


class YesterdaySchema(BaseModel):
    completed: bool
    reason: str | None = None


class HistoryEntrySchema(BaseModel):
    date: str
    completed: bool
    miss_reason: str | None = None

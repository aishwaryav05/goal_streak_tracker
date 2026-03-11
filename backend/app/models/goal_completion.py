from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean, String
from app.db.database import Base

class GoalCompletion(Base):
    __tablename__ = "goal_completions"

    id = Column(Integer, primary_key=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    date = Column(Date)
    completed = Column(Boolean)
    miss_reason = Column(String, nullable=True)
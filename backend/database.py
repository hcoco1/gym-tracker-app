from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, registry
from sqlalchemy import ForeignKey
from datetime import datetime
from sqlalchemy import DateTime

#SQLALCHEMY_DATABASE_URL = "sqlite:///./workouts.db"
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Ivan-7430@db.xxxx.supabase.co:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

mapper_registry = registry()

class WorkoutSet(Base):
    __tablename__ = "workout_sets"
    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workouts.id'))
    set_number = Column(Integer)
    workout = relationship("Workout", back_populates="sets")  # Add this
    reps = relationship("WorkoutRep", back_populates="set")

class WorkoutRep(Base):
    __tablename__ = "workout_reps"
    id = Column(Integer, primary_key=True)
    set_id = Column(Integer, ForeignKey('workout_sets.id'))
    rep_number = Column(Integer)
    weight = Column(Float)
    set = relationship("WorkoutSet", back_populates="reps")  # Add back_populates

class Workout(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True)
    exercise = Column(String)
    exercise_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    sets = relationship("WorkoutSet", back_populates="workout", cascade="all, delete-orphan")  # Add cascade

# Configure relationships after all models are defined
mapper_registry.configure()



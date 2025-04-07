from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os
from datetime import datetime



DATABASE_URL = f"mysql+pymysql://root:RIfLNVrLourqysbDvfNFCnGduWCylcsW@nozomi.proxy.rlwy.net:40677/railway"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users_in"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    query_history = relationship("Query_History", back_populates="user")

class Query_History(Base):
    __tablename__ = "query_history_"

    query_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_in.user_id"), nullable=False)
    query_exe = Column(String(510), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow) 
    user = relationship("User", back_populates="query_history")



Base.metadata.create_all(bind=engine)
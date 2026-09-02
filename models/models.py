from datetime import datetime
from typing import List
from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Association table for Analysis <-> News (Many-to-Many)
analysis_news = Table(
    "analysis_news",
    Base.metadata,
    Column("analysis_id", Integer, ForeignKey("analyses.id", ondelete="CASCADE"), primary_key=True),
    Column("news_id", Integer, ForeignKey("news.id", ondelete="CASCADE"), primary_key=True),
)


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_channel = Column(String(255), nullable=False)
    message_id = Column(BigInteger, nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String(50), nullable=True)
    priority = Column(String(50), nullable=True)
    state = Column(String(50), nullable=False, default="fetched")
    content_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("source_channel", "message_id", name="uq_channel_message"),
    )

    analyses = relationship("Analysis", secondary=analysis_news, back_populates="news_items")
    agent_states = relationship("AgentState", back_populates="news", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    final_text = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="pending")  # 'pending' or 'completed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    news_items = relationship("News", secondary=analysis_news, back_populates="analyses")
    predictions = relationship("Prediction", back_populates="analysis", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    timeframe = Column(String(50), nullable=False)  # 'short', 'mid', 'long'
    content = Column(Text, nullable=False)
    uncertainty = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    analysis = relationship("Analysis", back_populates="predictions")


class BackfillState(Base):
    __tablename__ = "backfill_states"

    channel = Column(String(255), primary_key=True, unique=True, nullable=False)
    last_message_id = Column(BigInteger, default=0, nullable=False)
    status = Column(String(50), default="idle", nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(Base):
    __tablename__ = "users"

    telegram_id = Column(BigInteger, primary_key=True, unique=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_interaction = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class GroupSettings(Base):
    __tablename__ = "group_settings"

    chat_id = Column(BigInteger, primary_key=True, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AgentState(Base):
    __tablename__ = "agent_states"

    id = Column(Integer, primary_key=True, autoincrement=True)
    news_id = Column(Integer, ForeignKey("news.id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)  # 'pending', 'in_progress', 'completed', 'failed'
    last_error = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    news = relationship("News", back_populates="agent_states")


class APIUsage(Base):
    __tablename__ = "api_usage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    prompt_tokens = Column(Integer, default=0, nullable=False)
    completion_tokens = Column(Integer, default=0, nullable=False)
    total_tokens = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

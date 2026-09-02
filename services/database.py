from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, update, func, desc
from models.models import Base, News, Analysis, Prediction, BackfillState, User, GroupSettings, AgentState, APIUsage
from utils.config import config
from utils.logger import logger

engine = create_async_engine(
    config.DATABASE_URL,
    echo=False,
    future=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized successfully.")


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# User & Group Helpers
async def upsert_user(telegram_id: int, is_admin: bool = False) -> User:
    async with get_db_session() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalar_one_or_none()
        now = datetime.utcnow()
        if not user:
            user = User(
                telegram_id=telegram_id,
                is_admin=is_admin or (telegram_id in config.ADMIN_IDS),
                created_at=now,
                last_interaction=now,
            )
            session.add(user)
        else:
            user.last_interaction = now
            if telegram_id in config.ADMIN_IDS:
                user.is_admin = True
        await session.commit()
        return user


async def ensure_group_settings(chat_id: int) -> GroupSettings:
    async with get_db_session() as session:
        result = await session.execute(select(GroupSettings).where(GroupSettings.chat_id == chat_id))
        group = result.scalar_one_or_none()
        if not group:
            group = GroupSettings(chat_id=chat_id, created_at=datetime.utcnow())
            session.add(group)
            await session.commit()
        return group


# News & Deduplication Helpers
async def is_news_duplicate(source_channel: str, message_id: int) -> bool:
    async with get_db_session() as session:
        result = await session.execute(
            select(News.id).where(News.source_channel == source_channel, News.message_id == message_id)
        )
        return result.scalar_one_or_none() is not None


async def save_news_item(
    source_channel: str,
    message_id: int,
    text: str,
    content_hash: str,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    state: str = "fetched",
) -> Optional[News]:
    async with get_db_session() as session:
        try:
            news = News(
                source_channel=source_channel,
                message_id=message_id,
                text=text,
                content_hash=content_hash,
                category=category,
                priority=priority,
                state=state,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(news)
            await session.commit()
            await session.refresh(news)
            return news
        except Exception as e:
            logger.warning(f"Error saving news item {source_channel}:{message_id} (likely duplicate): {e}")
            await session.rollback()
            return None


async def update_news_state(news_id: int, state: str, category: Optional[str] = None, priority: Optional[str] = None):
    async with get_db_session() as session:
        values = {"state": state, "updated_at": datetime.utcnow()}
        if category:
            values["category"] = category
        if priority:
            values["priority"] = priority
        await session.execute(update(News).where(News.id == news_id).values(**values))
        await session.commit()


# Agent State
async def record_agent_state(news_id: int, agent_name: str, status: str, last_error: Optional[str] = None):
    async with get_db_session() as session:
        state = AgentState(
            news_id=news_id,
            agent_name=agent_name,
            status=status,
            last_error=last_error,
            updated_at=datetime.utcnow(),
        )
        session.add(state)
        await session.commit()


# API Usage tracking
async def record_api_usage(provider: str, model: str, prompt_tokens: int, completion_tokens: int):
    async with get_db_session() as session:
        usage = APIUsage(
            provider=provider,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            created_at=datetime.utcnow(),
        )
        session.add(usage)
        await session.commit()


# Backfill state
async def get_backfill_state(channel: str) -> BackfillState:
    async with get_db_session() as session:
        result = await session.execute(select(BackfillState).where(BackfillState.channel == channel))
        state = result.scalar_one_or_none()
        if not state:
            state = BackfillState(channel=channel, last_message_id=0, status="idle", updated_at=datetime.utcnow())
            session.add(state)
            await session.commit()
            await session.refresh(state)
        return state


async def update_backfill_state(channel: str, last_message_id: int, status: str):
    async with get_db_session() as session:
        await session.execute(
            update(BackfillState)
            .where(BackfillState.channel == channel)
            .values(last_message_id=last_message_id, status=status, updated_at=datetime.utcnow())
        )
        await session.commit()

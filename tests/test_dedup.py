import pytest
import pytest_asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from models.models import Base, News


@pytest_asyncio.fixture
async def dedup_db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest.mark.asyncio
async def test_deduplication_constraint(dedup_db: AsyncSession):
    # Insert first message
    news1 = News(
        source_channel="@databaseradarj",
        message_id=999,
        text="مذاکرات وین و مواضع هیئت آمریکایی",
        state="fetched",
        content_hash="abc123hash",
        created_at=datetime.utcnow(),
    )
    dedup_db.add(news1)
    await dedup_db.commit()

    # Attempt to insert identical (source_channel, message_id)
    news2 = News(
        source_channel="@databaseradarj",
        message_id=999,
        text="مذاکرات وین و مواضع جدید",
        state="fetched",
        content_hash="def456hash",
        created_at=datetime.utcnow(),
    )
    dedup_db.add(news2)

    with pytest.raises(Exception):
        await dedup_db.commit()

    await dedup_db.rollback()

    # Query to verify only single record remains
    result = await dedup_db.execute(
        select(News).where(News.source_channel == "@databaseradarj", News.message_id == 999)
    )
    rows = result.scalars().all()
    assert len(rows) == 1
    assert rows[0].text == "مذاکرات وین و مواضع هیئت آمریکایی"

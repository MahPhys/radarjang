import pytest
import pytest_asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from models.models import Base, News, Analysis, Prediction, BackfillState, User, GroupSettings, AgentState, APIUsage


@pytest_asyncio.fixture
async def async_db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest.mark.asyncio
async def test_news_and_analysis_models(async_db: AsyncSession):
    # 1. Create News
    news = News(
        source_channel="@test_channel",
        message_id=101,
        text="آزمایش موشکی جدید در منطقه خلیج فارس گزارش شده است.",
        category="Military",
        priority="Critical",
        state="classified",
        content_hash="hash_123456",
        created_at=datetime.utcnow(),
    )
    async_db.add(news)
    await async_db.commit()

    # 2. Create Analysis
    analysis = Analysis(
        final_text="گزارش راهبردی در خصوص رزمایش‌های اخیر",
        status="completed",
        created_at=datetime.utcnow(),
    )
    analysis.news_items.append(news)
    async_db.add(analysis)
    await async_db.commit()

    # 3. Create Prediction
    prediction = Prediction(
        analysis_id=analysis.id,
        timeframe="short",
        content="احتمال افزایش تنش‌های کلامی در ۴۸ ساعت آینده",
        uncertainty="متوسط",
        created_at=datetime.utcnow(),
    )
    async_db.add(prediction)
    await async_db.commit()

    # Query and Assert
    result = await async_db.execute(select(Analysis).where(Analysis.id == analysis.id))
    fetched_analysis = result.scalar_one()
    assert fetched_analysis.status == "completed"
    assert len(fetched_analysis.news_items) == 1
    assert fetched_analysis.news_items[0].message_id == 101


@pytest.mark.asyncio
async def test_user_and_api_usage_models(async_db: AsyncSession):
    user = User(telegram_id=123456789, is_admin=True, created_at=datetime.utcnow(), last_interaction=datetime.utcnow())
    async_db.add(user)

    usage = APIUsage(
        provider="anthropic",
        model="claude-3-5-sonnet",
        prompt_tokens=150,
        completion_tokens=300,
        total_tokens=450,
        created_at=datetime.utcnow(),
    )
    async_db.add(usage)
    await async_db.commit()

    res_user = await async_db.execute(select(User).where(User.telegram_id == 123456789))
    assert res_user.scalar_one().is_admin is True

    res_usage = await async_db.execute(select(APIUsage).where(APIUsage.provider == "anthropic"))
    assert res_usage.scalar_one().total_tokens == 450

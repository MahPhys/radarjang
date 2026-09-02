import pytest
import pytest_asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from models.models import Base, News, AgentState
from services.database import record_agent_state, update_news_state


@pytest_asyncio.fixture
async def setup_state_db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with session_factory() as session:
        news = News(
            source_channel="@channel",
            message_id=200,
            text="تحلیل اولیه بازار انرژی و تحریم‌های نفتی",
            state="fetched",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(news)
        await session.commit()
        await session.refresh(news)
        news_id = news.id

    yield engine, session_factory, news_id
    await engine.dispose()


@pytest.mark.asyncio
async def test_agent_state_persistence(setup_state_db):
    engine, session_factory, news_id = setup_state_db

    # Manually simulate agent state record with custom session factory
    async with session_factory() as session:
        st = AgentState(
            news_id=news_id,
            agent_name="Analyst",
            status="completed",
            last_error=None,
            updated_at=datetime.utcnow(),
        )
        session.add(st)
        await session.commit()

        # Query back
        res = await session.execute(select(AgentState).where(AgentState.news_id == news_id))
        records = res.scalars().all()
        assert len(records) == 1
        assert records[0].agent_name == "Analyst"
        assert records[0].status == "completed"


def test_agents_instantiation_and_process_method():
    from agents.base import BaseAgent
    from agents.classifier import classifier_agent, ClassifierAgent
    from agents.analyst import analyst_agent, AnalystAgent
    from agents.historian import historian_agent, HistorianAgent
    from agents.synthesis import synthesis_agent, SynthesisAgent

    agents = [classifier_agent, analyst_agent, historian_agent, synthesis_agent]
    for ag in agents:
        assert isinstance(ag, BaseAgent)
        assert hasattr(ag, "process")
        assert callable(getattr(ag, "process"))


from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from utils.logger import logger
from services.database import record_agent_state


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    async def record_state(self, news_id: int, status: str, last_error: Optional[str] = None):
        try:
            await record_agent_state(news_id=news_id, agent_name=self.name, status=status, last_error=last_error)
        except Exception as e:
            logger.error(f"Failed to record agent state for agent '{self.name}', news_id={news_id}: {e}")

    @abstractmethod
    async def process(self, *args, **kwargs) -> Any:
        pass

import json
from typing import Dict, Any, Optional
from agents.base import BaseAgent
from services.llm_service import llm_service
from services.database import update_news_state
from services.vector_store import vector_store
from models.models import News
from utils.config import config
from utils.logger import logger

CLASSIFIER_SYSTEM_PROMPT = """شما یک تحلیلگر و دسته‌بندی‌کننده خبره در حوزه تحولات ژئوپلیتیک، نظامی، امنیتی و دیپلماتیک مرتبط با ایران و ایالات متحده آمریکا هستید.

وظیفه شما این است که متن خبر دریافتی را تحلیل کرده و خروجی را دقیقاً در قالب ساختار JSON زیر بازگردانید:
{
  "category": "Political|Military|Economic|Diplomatic",
  "priority": "Low|Medium|Critical",
  "reasoning": "توضیح مختصر در مورد دلایل انتخاب دسته‌بندی و اولویت"
}

قوانین:
1. دسته‌بندی فقط یکی از مقادیر Political, Military, Economic, Diplomatic باشد.
2. اولویت فقط یکی از مقادیر Low, Medium, Critical باشد (اخبار فوری، درگیری‌های مستقیم، تهدیدهای استراتژیک و هشدارهای امنیتی دارای اولویت Critical هستند).
3. پاسخ باید فقط و فقط ساختار JSON معتبر باشد و بدون هیچ توضیح اضافه."""


class ClassifierAgent(BaseAgent):
    def __init__(self):
        super().__init__("Classifier")
        self.preferred_models = [
            ("xai", config.GROK_MODEL),
        ]

    async def process(self, news: News) -> Dict[str, Any]:
        """Classifies a news item and persists its state."""
        await self.record_state(news.id, "in_progress")
        try:
            raw_response = await llm_service.generate(
                system_prompt=CLASSIFIER_SYSTEM_PROMPT,
                user_prompt=f"متن خبر:\n{news.text}",
                preferred_models=self.preferred_models,
                is_json=True,
            )
            result = llm_service.extract_json(raw_response)

            category = result.get("category", "Political")
            priority = result.get("priority", "Medium")

            # Validate categorical bounds
            if category not in ["Political", "Military", "Economic", "Diplomatic"]:
                category = "Political"
            if priority not in ["Low", "Medium", "Critical"]:
                priority = "Medium"

            # Update database state
            await update_news_state(news.id, state="classified", category=category, priority=priority)

            # Store / update in vector store with rich metadata
            vector_store.add_news_item(
                news_id=news.id,
                text=news.text,
                source_channel=news.source_channel,
                category=category,
                priority=priority,
                timestamp=news.created_at.timestamp() if news.created_at else None,
            )

            await self.record_state(news.id, "completed")
            return result
        except Exception as e:
            logger.error(f"ClassifierAgent error on news_id={news.id}: {e}")
            await self.record_state(news.id, "failed", last_error=str(e))
            raise e


classifier_agent = ClassifierAgent()

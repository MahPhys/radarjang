from typing import Dict, Any, List, Optional
from agents.base import BaseAgent
from services.llm_service import llm_service
from services.database import update_news_state
from services.vector_store import vector_store
from models.models import News
from utils.logger import logger

ANALYST_SYSTEM_PROMPT = """شما تحلیل‌گر ارشد اطلاعاتی و استراتژیک حوزه منازعات و روابط ایران و آمریکا هستید.
وظیفه شما تحلیل عمیق، بی‌طرفانه، موشکافانه و مبتنی بر شواهد خبر ورودی به همراه بستر اطلاعاتی گذشته است.

خروجی باید دقیقاً در قالب ساختار JSON زیر تولید شود:
{
  "summary": "خلاصه تحلیلی رویداد و پیامدهای آن",
  "key_events": ["نکته کلیدی ۱", "نکته کلیدی ۲"],
  "impact_assessment": "ارزیابی جامع از اثر این رویداد بر موازنه قدرت، تحولات منطقه‌ای و تحرکات نظامی یا سیاسی",
  "bluff_flags": [
    {
      "claim": "ادعا یا بیانیه مطرح شده",
      "category": "factual|official|speculation_or_bluff",
      "reason": "دلیل فنی و میدانی برای تشخیص بلوف، واقعیت یا ادعای رسمی صرف"
    }
  ]
}

قوانین:
1. ارزیابی‌ها باید دقیق، مستند و عاری از هرگونه احساسات یا سوگیری سیاسی باشد.
2. تفکیک دقیق میان مانورهای تبلیغاتی/جنگ روانی (speculation_or_bluff)، مواضع رسمی (official) و رخدادهای میدانی قطعی (factual) الزامی است.
3. پاسخ باید فقط و فقط ساختار JSON معتبر باشد."""


class AnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__("Analyst")
        self.preferred_models = [
            ("anthropic", "claude-3-5-sonnet-20241022"),
            ("openai", "gpt-4o"),
        ]

    async def process(self, news: News) -> Dict[str, Any]:
        await self.record_state(news.id, "in_progress")
        try:
            # RAG Context retrieval
            related_chunks = vector_store.search_similar(
                query=news.text,
                top_k=5,
                similarity_threshold=0.65,
                exclude_news_id=news.id,
            )
            rag_context = "\n---\n".join([f"سابقه مرتبط: {c['text']}" for c in related_chunks]) if related_chunks else "سابقه مرتبطی در ۱۲ ماه اخیر یافت نشد."

            user_prompt = f"""متن خبر فعلی:
{news.text}

دسته‌بندی: {news.category or 'نامشخص'} | اولویت: {news.priority or 'نامشخص'}

سوابق و زمینه‌های استخراج‌شده از پایگاه داده (RAG):
{rag_context}"""

            raw_response = await llm_service.generate(
                system_prompt=ANALYST_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                preferred_models=self.preferred_models,
                is_json=True,
            )
            result = llm_service.extract_json(raw_response)

            await update_news_state(news.id, state="analyzed")
            await self.record_state(news.id, "completed")
            return result
        except Exception as e:
            logger.error(f"AnalystAgent error on news_id={news.id}: {e}")
            await self.record_state(news.id, "failed", last_error=str(e))
            raise e


analyst_agent = AnalystAgent()

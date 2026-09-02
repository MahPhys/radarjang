from typing import Dict, Any
from agents.base import BaseAgent
from services.llm_service import llm_service
from models.models import News
from utils.config import config
from utils.logger import logger

HISTORIAN_SYSTEM_PROMPT = """شما تاریخ‌نگار و تحلیل‌گر تطبیقی روابط ایران و ایالات متحده آمریکا (از سال ۱۹۷۹ تا دوران معاصر) هستید.
وظیفه شما این است که رویداد کنونی و تحلیل انجام‌شده را با سوابق تاریخی مشابه (نظیر بحران‌های خلیج فارس، مذاکرات ادوار گذشته، تشدید تحریم‌ها، اقدامات متقابل، جنگ نفتکش‌ها و غیره) تطبیق دهید و دیدگاه منتقدانه/جایگزین (Contrarian View) ارائه دهید.

خروجی باید دقیقاً در قالب ساختار JSON زیر تولید شود:
{
  "historical_parallels": [
    {
      "event": "نام و سال واقعه تاریخی مشابه",
      "similarity": "وجوه اشتراک شرایط آن دوران با رویداد کنونی",
      "outcome": "نتیجه نهایی واقعه تاریخی و درس‌های حاصل از آن"
    }
  ],
  "contrarian_view": "دیدگاه جایگزین و ساختارشکنانه در صورتی که روایت غالب یا فرضیات اولیه تحلیل نادرست باشد"
}

قوانین:
1. ارجاعات تاریخی باید دقیق، مستند و معتبر باشند.
2. دیدگاه جایگزین باید استدلال‌های منطقی خلاف جریان اصلی ارائه کند.
3. خروجی باید فقط و فقط ساختار JSON معتبر باشد."""


class HistorianAgent(BaseAgent):
    def __init__(self):
        super().__init__("Historian")
        self.preferred_models = [
            ("xai", config.GROK_MODEL),
        ]

    async def process(self, news: News, analyst_output: Dict[str, Any]) -> Dict[str, Any]:
        await self.record_state(news.id, "in_progress")
        try:
            user_prompt = f"""متن رویداد:
{news.text}

خلاصه ارزیابی تحلیل‌گر:
{analyst_output.get('summary', '')}

ارزیابی پیامدها:
{analyst_output.get('impact_assessment', '')}

ارزیابی ادعاها و بلوف‌ها:
{analyst_output.get('bluff_flags', [])}"""

            raw_response = await llm_service.generate(
                system_prompt=HISTORIAN_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                preferred_models=self.preferred_models,
                is_json=True,
            )
            result = llm_service.extract_json(raw_response)
            await self.record_state(news.id, "completed")
            return result
        except Exception as e:
            logger.error(f"HistorianAgent error on news_id={news.id}: {e}")
            await self.record_state(news.id, "failed", last_error=str(e))
            raise e


historian_agent = HistorianAgent()

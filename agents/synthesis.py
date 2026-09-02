import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy import select, desc
from agents.base import BaseAgent
from agents.classifier import classifier_agent
from agents.analyst import analyst_agent
from agents.historian import historian_agent
from agents.fetcher import heavy_work_lock
from services.llm_service import llm_service
from services.database import get_db_session, update_news_state
from models.models import News, Analysis, Prediction, analysis_news
from utils.logger import logger

SYNTHESIS_SYSTEM_PROMPT = """شما دبیر ارشد تحلیل راهبردی دیدبان جنگ (رادار جنگ) در حوزه منازعات و روابط ایران و آمریکا هستید.
وظیفه شما تجمیع، نگارش و بازتولید گزارش جامع نهایی تحلیلی بر پایه تحلیل‌های انجام‌شده توسط تحلیل‌گر نظامی/سیاسی و تاریخ‌نگار تطبیقی است.

قوانین نگارش:
1. زبان خروجی: کاملاً فارسی رسمی، حرفه‌ای، فاخر، بدون هرگونه شکلک و ایموجی (emoji).
2. ساختار گزارش باید منظم و تفکیک‌شده با سرفصل‌های مشخص باشد:
   - گزارش راهبردی و ارزیابی وضعیت
   - رویدادهای کلیدی و تحرکات میدانی/دیپلماتیک
   - تفکیک بیانیه‌های رسمی از واقعیت‌های میدانی و بلوف‌های تبلیغاتی
   - تطبیق و عبرت‌های تاریخی
   - دیدگاه جایگزین (در صورتی که دیدگاه تاریخ‌نگار حاوی تعارض، سناریوی خلاف جریان یا هشدار خاصی باشد، حتماً تحت عنوان مستقل «دیدگاه جایگزین» درج شود)
   - افق پیش‌رو و برآورد جهت‌گیری تحولات
3. خروجی باید در قالب JSON زیر باشد:
{
  "final_text": "متن کامل و منسجم گزارش تحلیلی"
}"""

PREDICTION_SYSTEM_PROMPT = """شما تحلیل‌گر سناریوسازی و پیش‌بینی راهبردی موازنه منازعات ایران و آمریکا هستید.
بر اساس آخرین گزارش تحلیلی وضعیت، وظیفه شما تدوین پیش‌بینی‌های واقع‌بینانه در سه بازه زمانی (کوتاه‌مدت ۱ تا ۴ هفته، میان‌مدت ۱ تا ۶ ماه، بلندمدت ۶ ماه تا ۲ سال) به همراه سنجش سطح عدم‌قطعیت و ریسک‌های بحرانی است.

قوانین:
1. زبان کاملاً فارسی رسمی و بدون هرگونه ایموجی باشد.
2. برای هر بازه زمانی سناریوی اصلی و میزان قطعیت تخمین زده شود.
3. خروجی باید شامل بخش‌های مشخص زیر باشد:
   - چشم‌انداز کوتاه‌مدت (۱ تا ۴ هفته)
   - چشم‌انداز میان‌مدت (۱ تا ۶ ماه)
   - چشم‌انداز بلندمدت (۶ ماه تا ۲ سال)
   - متغیرهای عدم‌قطعیت و شاخص‌های شکنندگی"""


class SynthesisAgent(BaseAgent):
    def __init__(self):
        super().__init__("Synthesis")
        self.preferred_models = [
            ("anthropic", "claude-3-5-sonnet-20241022"),
            ("openai", "gpt-4o"),
        ]

    async def process(self, *args, **kwargs) -> Any:
        """
        Implementation of BaseAgent.process.
        If processed_items is provided (as first argument or keyword arg), synthesizes them.
        Otherwise, runs the full end-to-end pipeline.
        """
        if args and isinstance(args[0], list):
            return await self.synthesize(args[0])
        if "processed_items" in kwargs and kwargs["processed_items"] is not None:
            return await self.synthesize(kwargs["processed_items"])
        return await self.run_full_pipeline()

    async def synthesize(self, processed_items: List[Dict[str, Any]]) -> str:
        """Synthesizes batch of processed news and sub-agent analyses into a comprehensive final text."""
        items_summary = []
        for idx, item in enumerate(processed_items, start=1):
            news_obj = item["news"]
            analyst_res = item["analyst"]
            historian_res = item["historian"]
            
            items_summary.append(f"""### خبر شماره {idx} (منبع: {news_obj.source_channel} | دسته: {news_obj.category} | اولویت: {news_obj.priority})
متن خبر:
{news_obj.text}

یافته‌های تحلیل‌گر:
- خلاصه: {analyst_res.get('summary', '')}
- ارزیابی میدانی/پیامدها: {analyst_res.get('impact_assessment', '')}
- بررسی ادعاها/بلوف‌ها: {json.dumps(analyst_res.get('bluff_flags', []), ensure_ascii=False)}

یافته‌های تاریخ‌نگار:
- تطبیق تاریخی: {json.dumps(historian_res.get('historical_parallels', []), ensure_ascii=False)}
- دیدگاه منتقدانه/جایگزین: {historian_res.get('contrarian_view', '')}
""")

        combined_input = "\n\n".join(items_summary)

        raw_response = await llm_service.generate(
            system_prompt=SYNTHESIS_SYSTEM_PROMPT,
            user_prompt=f"مجموعه داده‌های گردآوری‌شده جهت تدوین گزارش تحلیلی:\n\n{combined_input}",
            preferred_models=self.preferred_models,
            is_json=True,
        )
        res_json = llm_service.extract_json(raw_response)
        return res_json.get("final_text", raw_response)

    async def run_full_pipeline(self) -> Dict[str, Any]:
        """Runs end-to-end multi-agent pipeline under heavy_work_lock."""
        async with heavy_work_lock:
            # 1. Fetch unanalyzed news
            async with get_db_session() as session:
                # Find last completed analysis timestamp
                last_analysis_res = await session.execute(
                    select(Analysis).where(Analysis.status == "completed").order_by(desc(Analysis.created_at)).limit(1)
                )
                last_analysis = last_analysis_res.scalar_one_or_none()
                cutoff_time = last_analysis.created_at if last_analysis else datetime(1970, 1, 1)

                # Fetch news created after cutoff with state in ('fetched', 'classified')
                news_query = select(News).where(
                    News.created_at >= cutoff_time,
                    News.state.in_(["fetched", "classified"])
                ).order_by(News.created_at.asc())
                news_items = (await session.execute(news_query)).scalars().all()

            if not news_items:
                # Check if there are any unanalyzed news regardless of cutoff
                async with get_db_session() as session:
                    fallback_query = select(News).where(
                        News.state.in_(["fetched", "classified"])
                    ).order_by(desc(News.created_at)).limit(15)
                    news_items = (await session.execute(fallback_query)).scalars().all()

            if not news_items:
                return {"status": "no_news", "message": "خبر جدیدی جهت تحلیل وجود ندارد."}

            # Create pending analysis record to ensure state persistence
            pending_analysis_id = None
            async with get_db_session() as session:
                analysis_rec = Analysis(final_text="در حال پردازش گزارش راهبردی...", status="pending", created_at=datetime.utcnow())
                session.add(analysis_rec)
                await session.commit()
                await session.refresh(analysis_rec)
                pending_analysis_id = analysis_rec.id

            try:
                processed_items = []
                news_ids_to_link = []

                for news in news_items:
                    # Classify if needed
                    if news.state == "fetched":
                        await classifier_agent.process(news)
                        # Refresh state
                        async with get_db_session() as session:
                            news = (await session.execute(select(News).where(News.id == news.id))).scalar_one()

                    # Analyst stage
                    analyst_output = await analyst_agent.process(news)

                    # Historian stage
                    historian_output = await historian_agent.process(news, analyst_output)

                    # Mark synthesized for news
                    await update_news_state(news.id, state="synthesized")
                    await self.record_state(news.id, "completed")

                    processed_items.append({
                        "news": news,
                        "analyst": analyst_output,
                        "historian": historian_output,
                    })
                    news_ids_to_link.append(news.id)

                # Final Synthesis
                final_report_text = await self.synthesize(processed_items)

                # Update Analysis record to completed
                async with get_db_session() as session:
                    res = await session.execute(select(Analysis).where(Analysis.id == pending_analysis_id))
                    analysis_rec = res.scalar_one()
                    analysis_rec.final_text = final_report_text
                    analysis_rec.status = "completed"
                    analysis_rec.created_at = datetime.utcnow()

                    # Associate news items
                    linked_news = (await session.execute(select(News).where(News.id.in_(news_ids_to_link)))).scalars().all()
                    analysis_rec.news_items.extend(linked_news)
                    await session.commit()

                return {
                    "status": "completed",
                    "analysis_id": pending_analysis_id,
                    "text": final_report_text,
                    "news_count": len(news_ids_to_link),
                }

            except Exception as e:
                logger.error(f"Error during full analysis pipeline: {e}")
                # Save as pending with error in log
                async with get_db_session() as session:
                    res = await session.execute(select(Analysis).where(Analysis.id == pending_analysis_id))
                    analysis_rec = res.scalar_one_or_none()
                    if analysis_rec:
                        analysis_rec.status = "pending"
                        await session.commit()
                raise e

    async def generate_prediction(self) -> str:
        """Generates short, mid, and long predictions based on latest completed analysis."""
        async with get_db_session() as session:
            res = await session.execute(
                select(Analysis).where(Analysis.status == "completed").order_by(desc(Analysis.created_at)).limit(1)
            )
            latest_analysis = res.scalar_one_or_none()

        if not latest_analysis or not latest_analysis.final_text:
            return "هنوز تحلیلی وجود ندارد. ابتدا /analyze را اجرا کنید."

        prompt = f"متن آخرین تحلیل راهبردی وضعیت:\n\n{latest_analysis.final_text}"

        prediction_text = await llm_service.generate(
            system_prompt=PREDICTION_SYSTEM_PROMPT,
            user_prompt=prompt,
            preferred_models=self.preferred_models,
            is_json=False,
        )

        # Save to predictions table
        async with get_db_session() as session:
            pred_record = Prediction(
                analysis_id=latest_analysis.id,
                timeframe="short_mid_long",
                content=prediction_text,
                uncertainty="ارزیابی شده بر اساس آخرین سناریوهای موازنه قوا",
                created_at=datetime.utcnow(),
            )
            session.add(pred_record)
            await session.commit()

        return prediction_text


synthesis_agent = SynthesisAgent()

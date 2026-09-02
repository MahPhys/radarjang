import asyncio
from datetime import datetime
import pytz
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    ChatMemberHandler,
    MessageHandler,
    filters,
)
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

from utils.config import config
from utils.logger import logger
from services.database import init_db
from services.vector_store import vector_store
from agents.synthesis import synthesis_agent
from handlers.commands import (
    start_command,
    help_command,
    analyze_command,
    predict_command,
    history_command,
    history_callback_handler,
    status_command,
    backfill_command,
)
from handlers.group_handlers import chat_member_update_handler, group_message_handler
from handlers.channel_handlers import channel_post_handler


async def scheduled_analysis_job():
    """Periodic analysis every 2 hours."""
    logger.info("Executing scheduled analysis job...")
    try:
        await synthesis_agent.run_full_pipeline()
    except Exception as e:
        logger.error(f"Error in scheduled analysis job: {e}")


async def scheduled_chroma_cleanup_job():
    """Weekly cleanup of ChromaDB records older than 12 months."""
    logger.info("Executing weekly ChromaDB cleanup...")
    try:
        vector_store.cleanup_old_documents(months=12)
    except Exception as e:
        logger.error(f"Error in scheduled ChromaDB cleanup: {e}")


def main():
    logger.info("Initializing Radar-e-Jang Telegram Bot...")

    if not config.BOT_TOKEN:
        logger.error("BOT_TOKEN is missing. Please set BOT_TOKEN in .env or environment.")
        return

    # Initialize Bot Application
    application = ApplicationBuilder().token(config.BOT_TOKEN).build()

    # 1. Register Command Handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("analyze", analyze_command))
    application.add_handler(CommandHandler("predict", predict_command))
    application.add_handler(CommandHandler("history", history_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("backfill", backfill_command))

    # 2. Callback Query Handler for history pagination
    application.add_handler(CallbackQueryHandler(history_callback_handler, pattern=r"^hist_page_"))

    # 3. Channel Post Handler for automated real-time news ingestion from SOURCE_CHANNEL
    application.add_handler(MessageHandler(filters.ChatType.CHANNEL, channel_post_handler))

    # 4. Chat Member Updated Handler (Bot added to group/channel)
    application.add_handler(ChatMemberHandler(chat_member_update_handler, ChatMemberHandler.MY_CHAT_MEMBER))

    # 5. Group message handler (filter mentions/replies in group/supergroup)
    group_filter = (filters.ChatType.GROUPS) & filters.TEXT & (~filters.COMMAND)
    application.add_handler(MessageHandler(group_filter, group_message_handler))

    # Post-init hook for database initialization and scheduler
    async def post_init(app):
        logger.info("Running post-initialization tasks...")
        # 1. Initialize SQLite/Postgres DB
        await init_db()

        # 2. Setup and start AsyncIOScheduler (Asia/Tehran timezone)
        tehran_tz = pytz.timezone("Asia/Tehran")
        scheduler = AsyncIOScheduler(timezone=tehran_tz)

        # Full analysis every N hours (default 2 hours)
        scheduler.add_job(scheduled_analysis_job, IntervalTrigger(hours=config.ANALYSIS_INTERVAL_HOURS))

        # Weekly ChromaDB cleanup (Sundays at 03:00 Tehran time)
        scheduler.add_job(scheduled_chroma_cleanup_job, CronTrigger(day_of_week="sun", hour=3, minute=0))

        scheduler.start()
        logger.info(f"AsyncIOScheduler started with Tehran timezone. Listening for posts in {config.SOURCE_CHANNEL}...")

    application.post_init = post_init

    # Run bot polling
    logger.info("Starting Telegram Bot Polling (with Channel Post Listener)...")
    application.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()

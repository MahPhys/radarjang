import asyncio
import hashlib
from datetime import datetime
from telegram import Update
from telegram.ext import ContextTypes
from utils.config import config
from utils.logger import logger
from services.database import is_news_duplicate, save_news_item
from services.vector_store import vector_store
from agents.classifier import classifier_agent


def compute_content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def is_matching_channel(chat) -> bool:
    """Checks if the update's chat matches the configured SOURCE_CHANNEL or SOURCE_CHANNELS."""
    if not chat:
        return False

    chat_id_str = str(chat.id)
    username = f"@{chat.username}" if chat.username else ""
    raw_username = chat.username or ""

    allowed_channels = config.SOURCE_CHANNELS + [config.SOURCE_CHANNEL]
    for target in allowed_channels:
        if not target:
            continue
        cleaned_target = target.strip()
        # Check by @username, username without @, or numeric chat ID
        if (
            cleaned_target == username
            or cleaned_target.lstrip("@").lower() == raw_username.lower()
            or cleaned_target == chat_id_str
        ):
            return True

    return False


async def channel_post_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handles incoming posts and edited posts in Telegram channels where the bot is an administrator.
    Extracts text/caption, deduplicates, stores in DB, chunks & embeds into ChromaDB,
    and runs the AI classifier agent pipeline.
    """
    post = update.channel_post or update.edited_channel_post
    if not post:
        return

    chat = post.chat
    if not is_matching_channel(chat):
        logger.debug(f"Received post from non-monitored channel: {chat.title} ({chat.id})")
        return

    # Extract pure text or media caption
    text = (post.text or post.caption or "").strip()
    if not text:
        logger.debug(f"Skipping media-only post without text/caption in msg_id={post.message_id}")
        return

    channel_identifier = f"@{chat.username}" if chat.username else str(chat.id)
    message_id = post.message_id

    # Deduplication check
    if await is_news_duplicate(channel_identifier, message_id):
        logger.info(f"Duplicate post detected: channel={channel_identifier}, msg_id={message_id}. Skipping.")
        return

    content_hash = compute_content_hash(text)
    logger.info(f"New channel post received from {channel_identifier} (msg_id={message_id})")

    try:
        # 1. Save to Database
        news = await save_news_item(
            source_channel=channel_identifier,
            message_id=message_id,
            text=text,
            content_hash=content_hash,
            state="fetched",
        )

        if not news:
            logger.warning(f"Could not persist news item for msg_id={message_id}")
            return

        # 2. Chunk & Embed into ChromaDB vector store
        msg_timestamp = post.date.timestamp() if post.date else datetime.utcnow().timestamp()
        vector_store.add_news_item(
            news_id=news.id,
            text=text,
            source_channel=channel_identifier,
            timestamp=msg_timestamp,
        )

        # 3. Trigger Classifier agent in background task
        asyncio.create_task(run_background_classification(news))

    except Exception as e:
        logger.error(f"Error processing channel post msg_id={message_id}: {e}")


async def run_background_classification(news):
    """Background task to classify news and update vector store metadata without blocking Bot API."""
    try:
        await classifier_agent.process(news)
        logger.info(f"News item #{news.id} classified successfully.")
    except Exception as e:
        logger.error(f"Background classification failed for news #{news.id}: {e}")

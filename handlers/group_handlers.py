import collections
from typing import Dict, Deque
from telegram import Update, ChatMemberUpdated
from telegram.ext import ContextTypes
from services.database import ensure_group_settings
from utils.logger import logger

# In-memory shared group context deque (maxlen=20 pure text, reset on restart)
group_contexts: Dict[int, Deque[str]] = collections.defaultdict(lambda: collections.deque(maxlen=20))

VALID_COMMANDS = ["/start", "/help", "/analyze", "/predict", "/history", "/status", "/backfill"]


async def chat_member_update_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Tracks when the bot is added to a group and registers GroupSettings."""
    result = update.my_chat_member
    if not result:
        return

    chat = update.effective_chat
    if chat and chat.type in ["group", "supergroup"]:
        new_status = result.new_chat_member.status
        if new_status in ["member", "administrator"]:
            await ensure_group_settings(chat.id)
            logger.info(f"Bot added to group {chat.id} ({chat.title}). GroupSettings registered.")


async def group_message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles text messages in groups when mentioned or replied to."""
    message = update.effective_message
    chat = update.effective_chat
    user = update.effective_user

    if not message or not message.text or not chat:
        return

    text = message.text.strip()
    bot_username = context.bot.username or ""

    # Record message in shared context
    group_contexts[chat.id].append(text)

    # Check if the message is directed at the bot (via reply or mention)
    is_reply_to_bot = (
        message.reply_to_message
        and message.reply_to_message.from_user
        and message.reply_to_message.from_user.id == context.bot.id
    )
    is_mentioned = f"@{bot_username}".lower() in text.lower() if bot_username else False

    if not (is_reply_to_bot or is_mentioned):
        return

    # Clean text from bot mention
    clean_text = text
    if bot_username:
        clean_text = clean_text.replace(f"@{bot_username}", "").strip()

    # Check if text is a command
    command_word = clean_text.split()[0].lower() if clean_text else ""
    if command_word in VALID_COMMANDS:
        # Handled by CommandHandlers or command routing
        return

    # If not a valid command -> polite help message
    polite_response = (
        "پیام شما دریافت شد. جهت استفاده از قابلیت‌های تحلیلی و اطلاعاتی سامانه دیدبان جنگ، "
        "لطفاً از دستورات مشخص‌شده نظیر /analyze ، /predict ، /status یا /help استفاده فرمایید.\n\n"
        "لازم به ذکر است این سامانه منحصراً در حوزه موازنه قوا و تحولات مرتبط با ایران و آمریکا فعالیت می‌کند."
    )
    await message.reply_text(polite_response)

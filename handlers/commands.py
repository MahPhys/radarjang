import time
import collections
from typing import Dict, List, Deque
from datetime import datetime, timedelta
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from sqlalchemy import select, desc, func
from models.models import User, Analysis, APIUsage, News
from services.database import get_db_session, upsert_user
from agents.synthesis import synthesis_agent
from agents.fetcher import fetcher_agent
from utils.config import config
from utils.logger import logger

# In-memory sliding window rate limiting
user_command_history: Dict[int, Deque[float]] = collections.defaultdict(collections.deque)
group_command_history: Dict[int, Deque[float]] = collections.defaultdict(collections.deque)
user_analyze_last_time: Dict[int, float] = {}


def check_rate_limit(user_id: int, chat_id: int, is_group: bool, is_analyze: bool = False) -> tuple[bool, str]:
    now = time.time()
    
    if is_analyze:
        last_time = user_analyze_last_time.get(user_id, 0)
        cooldown = config.HEAVY_ANALYZE_COOLDOWN_SECONDS
        if now - last_time < cooldown:
            remaining = int(cooldown - (now - last_time))
            return False, f"دستور تحلیل سنگین دارای محدودیت زمانی است. لطفاً {remaining} ثانیه دیگر مجدداً تلاش فرمایید."
        user_analyze_last_time[user_id] = now
        return True, ""

    # Normal command rate limit
    u_history = user_command_history[user_id]
    while u_history and now - u_history[0] > 60:
        u_history.popleft()
    if len(u_history) >= config.RATE_LIMIT_USER_PER_MIN:
        return False, "تعداد درخواست‌های شما بیش از حد مجاز در دقیقه است. لطفاً شکیبا باشید."
    u_history.append(now)

    if is_group:
        g_history = group_command_history[chat_id]
        while g_history and now - g_history[0] > 60:
            g_history.popleft()
        if len(g_history) >= config.RATE_LIMIT_GROUP_PER_MIN:
            return False, "تعداد درخواست‌های گروه بیش از حد مجاز در دقیقه است. لطفاً بعداً تلاش فرمایید."
        g_history.append(now)

    return True, ""


async def send_split_message(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str, title_prefix: str = "گزارش تحلیلی"):
    """Splits messages longer than 4000 characters into sequential parts."""
    max_len = 3900
    if len(text) <= max_len:
        await update.effective_message.reply_text(text)
        return

    parts = []
    lines = text.split("\n")
    current_part = ""

    for line in lines:
        if len(current_part) + len(line) + 1 > max_len:
            parts.append(current_part.strip())
            current_part = line + "\n"
        else:
            current_part += line + "\n"
    if current_part.strip():
        parts.append(current_part.strip())

    total_parts = len(parts)
    for idx, part in enumerate(parts, start=1):
        header = f"[{title_prefix} - بخش {idx} از {total_parts}]\n\n"
        await update.effective_message.reply_text(header + part)


# Command Handlers
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    # Upsert user into database
    await upsert_user(user.id, is_admin=(user.id in config.ADMIN_IDS))

    welcome_text = (
        "سامانه دیدبان جنگ (رادار جنگ) فعال است.\n\n"
        "این سامانه به صورت تخصصی به پایش، ارزیابی راهبردی، تحلیل داده‌محور و پیش‌بینی سناریوهای موازنه قوا، "
        "روابط دیپلماتیک، تحرکات نظامی و تنش‌های ژئوپلیتیک میان جمهوری اسلامی ایران و ایالات متحده آمریکا می‌پردازد.\n\n"
        "جهت مشاهده فهرست دستورات و راهنمای استفاده از دستور /help استفاده فرمایید."
    )
    await update.effective_message.reply_text(welcome_text)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    help_text = (
        "راهنمای جامع کاربری سامانه دیدبان جنگ:\n\n"
        "/start - ثبت نام و نمایش پیام آغازین\n"
        "/help - مشاهده راهنمای دستورات سامانه\n"
        "/analyze - اجرای خط لوله کامل تحلیل چندعاملی و تولید گزارش راهبردی جامع\n"
        "/predict - ارائه برآورد و پیش‌بینی سناریوهای کوتاه‌مدت، میان‌مدت و بلندمدت بر پایه آخرین تحلیل\n"
        "/history - مشاهده تاریخچه گزارش‌های تحلیلی پیشین با امکان پیمایش صفحات\n"
        "/status - نمایش وضعیت سلامت سامانه، کانال منبع متصل، مدل‌های فعال و آمار مصرف توکن‌ها\n"
        "/backfill - وضعیت دریافت بلادرنگ پیام‌های کانال منبع (مخصوص مدیران ارشد)\n\n"
        "تذکر: این سامانه منحصراً در زمینه تحولات و مسائل ایران و آمریکا پاسخگو می‌باشد."
    )
    await update.effective_message.reply_text(help_text)


async def analyze_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group, is_analyze=True)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    status_msg = await update.effective_message.reply_text("فرآیند ارزیابی اطلاعاتی و تحلیل راهبردی آغاز شد. لطفاً تا تکمیل گزارش شکیبا باشید...")

    try:
        result = await synthesis_agent.run_full_pipeline()
        if result.get("status") == "no_news":
            await status_msg.edit_text("خبر یا داده جدیدی پس از آخرین گزارش برای تحلیل یافت نشد.")
            return

        final_text = result.get("text", "")
        await status_msg.delete()
        await send_split_message(update, context, final_text, title_prefix="گزارش راهبردی رادار جنگ")
    except Exception as e:
        logger.error(f"Error in /analyze command: {e}")
        try:
            await status_msg.edit_text("متأسفانه در پردازش تحلیل خطایی رخ داد. لطفاً دوباره تلاش کنید.")
        except Exception:
            await update.effective_message.reply_text("متأسفانه در پردازش تحلیل خطایی رخ داد. لطفاً دوباره تلاش کنید.")


async def predict_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    status_msg = await update.effective_message.reply_text("در حال پردازش سناریوهای پیش‌بینی و سنجش عدم‌قطعیت...")

    try:
        prediction_text = await synthesis_agent.generate_prediction()
        await status_msg.delete()
        await send_split_message(update, context, prediction_text, title_prefix="پیش‌بینی راهبردی و ارزیابی سناریوها")
    except Exception as e:
        logger.error(f"Error in /predict command: {e}")
        try:
            await status_msg.edit_text("متأسفانه در پردازش تحلیل خطایی رخ داد. لطفاً دوباره تلاش کنید.")
        except Exception:
            await update.effective_message.reply_text("متأسفانه در پردازش تحلیل خطایی رخ داد. لطفاً دوباره تلاش کنید.")


async def history_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    await render_history_page(update, page=1)


async def render_history_page(update: Update, page: int = 1, is_callback: bool = False):
    page_size = 5
    offset = (page - 1) * page_size

    async with get_db_session() as session:
        # Total completed analyses count
        count_res = await session.execute(
            select(func.count(Analysis.id)).where(Analysis.status == "completed")
        )
        total_count = count_res.scalar() or 0

        # Fetch analyses for page
        query = (
            select(Analysis)
            .where(Analysis.status == "completed")
            .order_by(desc(Analysis.created_at))
            .offset(offset)
            .limit(page_size)
        )
        analyses = (await session.execute(query)).scalars().all()

    if total_count == 0:
        msg_text = "تاکنون هیچ گزارش تحلیلی ثبت نشده است."
        if is_callback and update.callback_query:
            await update.callback_query.edit_message_text(msg_text)
        else:
            await update.effective_message.reply_text(msg_text)
        return

    total_pages = max(1, (total_count + page_size - 1) // page_size)
    page = min(page, total_pages)

    lines = [f"تاریخچه گزارش‌های تحلیلی (صفحه {page} از {total_pages}):\n"]
    for item in analyses:
        created_str = item.created_at.strftime("%Y-%m-%d %H:%M")
        snippet = item.final_text[:120].replace("\n", " ") + "..."
        lines.append(f"گزارش #{item.id} | تاریخ: {created_str}\nخلاصه: {snippet}\n")

    message_text = "\n".join(lines)

    # Navigation buttons
    buttons = []
    if page > 1:
        buttons.append(InlineKeyboardButton("« قبلی", callback_data=f"hist_page_{page - 1}"))
    if page < total_pages:
        buttons.append(InlineKeyboardButton("بعدی »", callback_data=f"hist_page_{page + 1}"))

    keyboard = InlineKeyboardMarkup([buttons]) if buttons else None

    if is_callback and update.callback_query:
        await update.callback_query.edit_message_text(message_text, reply_markup=keyboard)
    else:
        await update.effective_message.reply_text(message_text, reply_markup=keyboard)


async def history_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    if data.startswith("hist_page_"):
        page_num = int(data.split("_")[-1])
        await render_history_page(update, page=page_num, is_callback=True)


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat
    is_group = chat.type in ["group", "supergroup"]

    allowed, msg = check_rate_limit(user.id, chat.id, is_group)
    if not allowed:
        await update.effective_message.reply_text(msg)
        return

    async with get_db_session() as session:
        # Last completed analysis
        last_an_res = await session.execute(
            select(Analysis).where(Analysis.status == "completed").order_by(desc(Analysis.created_at)).limit(1)
        )
        last_analysis = last_an_res.scalar_one_or_none()
        last_an_str = last_analysis.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if last_analysis else "ثبت نشده"

        # News counts
        total_news_res = await session.execute(select(func.count(News.id)))
        total_news = total_news_res.scalar() or 0

        # Token usage aggregation
        token_res = await session.execute(
            select(
                func.sum(APIUsage.prompt_tokens),
                func.sum(APIUsage.completion_tokens),
                func.sum(APIUsage.total_tokens)
            )
        )
        p_tok, c_tok, t_tok = token_res.one()
        p_tok = p_tok or 0
        c_tok = c_tok or 0
        t_tok = t_tok or 0

    listener_state = "فعال و آنلاین (Bot API Channel Listener)" if fetcher_agent.is_running else "غیرفعال"
    last_received_str = fetcher_agent.last_fetch_time.strftime("%Y-%m-%d %H:%M:%S UTC") if fetcher_agent.last_fetch_time else "در انتظار پیام جدید"

    active_models_list = (
        f"- مدل پایه و اختصاصی: xAI Grok ({config.GROK_MODEL})\n"
        "- اندپوینت: https://api.x.ai/v1/chat/completions\n"
        "- عامل‌های پردازشی متصل: Classifier, Analyst, Historian, Synthesis"
    )

    status_text = (
        "وضعیت و مشخصات فنی سامانه دیدبان جنگ:\n\n"
        f"وضعیت سلامت ربات: آنلاین و پایدار\n"
        f"شنونده کانال منبع: {listener_state}\n"
        f"کانال منبع متصل: {config.SOURCE_CHANNEL}\n"
        f"آخرین رویداد ثبت خبر: {last_received_str} ({fetcher_agent.last_fetch_status})\n"
        f"تعداد کل اخبار ذخیره‌شده: {total_news}\n"
        f"زمان آخرین گزارش تحلیلی: {last_an_str}\n\n"
        "مدل‌های هوش مصنوعی فعال:\n"
        f"{active_models_list}\n\n"
        "آمار مصرف توکن‌ها (APIUsage):\n"
        f"- توکن‌های ورودی: {p_tok:,}\n"
        f"- توکن‌های خروجی: {c_tok:,}\n"
        f"- مجموع کل توکن‌ها: {t_tok:,}\n\n"
        "راهنما: ربات به صورت خودکار با پست شدن هر پیام در کانال منبع، آن را ذخیره، ایندکس و دسته‌بندی می‌کند."
    )
    await update.effective_message.reply_text(status_text)


async def backfill_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if user.id not in config.ADMIN_IDS:
        await update.effective_message.reply_text("شما دسترسی لازم برای این بخش را ندارید.")
        return

    info = fetcher_agent.get_status_info()
    msg = (
        "وضعیت اتصال کانال منبع (Bot API Listener):\n\n"
        f"- کانال هدف: {info.get('channel')}\n"
        f"- وضعیت شنود بلادرنگ: {'فعال' if info.get('is_active') else 'غیرفعال'}\n"
        f"- پیام‌های پردازش‌شده در این نشست: {info.get('total_count', 0)}\n\n"
        "نکته: ربات بدون نیاز به Telethon، از طریق Bot API تمام پست‌های جدید کانال را در لحظه دریافت و ایندکس می‌نماید. "
        "اطمینان حاصل نمایید ربات به عنوان Administrator در کانال عضو شده است."
    )
    await update.effective_message.reply_text(msg)

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime
from handlers.channel_handlers import channel_post_handler, is_matching_channel, compute_content_hash
from utils.config import config


def test_channel_matching_logic():
    config.SOURCE_CHANNEL = "@databaseradarj"
    config.SOURCE_CHANNELS = ["@databaseradarj"]

    chat1 = MagicMock()
    chat1.id = -1001234567890
    chat1.username = "databaseradarj"
    assert is_matching_channel(chat1) is True

    chat2 = MagicMock()
    chat2.id = -1001234567890
    chat2.username = "otherchannel"
    assert is_matching_channel(chat2) is False


@pytest.mark.asyncio
async def test_channel_post_handler_processing():
    update = MagicMock()
    update.edited_channel_post = None

    post = MagicMock()
    post.message_id = 456
    post.text = "آزمایش سامانه دفاعی جدید توسط نیروی دریایی در خلیج فارس"
    post.caption = None
    post.date = datetime.utcnow()
    post.chat.id = -1009999999
    post.chat.username = "databaseradarj"
    post.chat.title = "Database Radar Jang"

    update.channel_post = post
    context = MagicMock()

    mock_news = MagicMock()
    mock_news.id = 42
    mock_news.text = post.text
    mock_news.source_channel = "@databaseradarj"

    with patch("handlers.channel_handlers.is_news_duplicate", new_callable=AsyncMock) as mock_dup, \
         patch("handlers.channel_handlers.save_news_item", new_callable=AsyncMock) as mock_save, \
         patch("handlers.channel_handlers.vector_store.add_news_item") as mock_vector, \
         patch("handlers.channel_handlers.classifier_agent.process", new_callable=AsyncMock) as mock_classify:

        mock_dup.return_value = False
        mock_save.return_value = mock_news

        await channel_post_handler(update, context)

        mock_dup.assert_called_once_with("@databaseradarj", 456)
        mock_save.assert_called_once()
        mock_vector.assert_called_once()


def test_heavy_work_lock_import():
    from agents.fetcher import heavy_work_lock
    import asyncio
    assert isinstance(heavy_work_lock, asyncio.Lock)

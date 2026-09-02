import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from handlers.commands import start_command, analyze_command, check_rate_limit


@pytest.mark.asyncio
async def test_start_command_execution():
    update = MagicMock()
    update.effective_user.id = 12345
    update.effective_chat.id = 12345
    update.effective_chat.type = "private"
    update.effective_message.reply_text = AsyncMock()

    context = MagicMock()

    with patch("handlers.commands.upsert_user", new_callable=AsyncMock) as mock_upsert:
        await start_command(update, context)

        mock_upsert.assert_called_once()
        update.effective_message.reply_text.assert_called_once()
        reply_arg = update.effective_message.reply_text.call_args[0][0]
        assert "دیدبان جنگ" in reply_arg


@pytest.mark.asyncio
async def test_analyze_command_flow():
    update = MagicMock()
    update.effective_user.id = 88888
    update.effective_chat.id = 88888
    update.effective_chat.type = "private"
    
    status_msg = MagicMock()
    status_msg.delete = AsyncMock()
    status_msg.edit_text = AsyncMock()
    update.effective_message.reply_text = AsyncMock(return_value=status_msg)

    context = MagicMock()

    with patch("handlers.commands.synthesis_agent.run_full_pipeline", new_callable=AsyncMock) as mock_pipe, \
         patch("handlers.commands.send_split_message", new_callable=AsyncMock) as mock_split:

        mock_pipe.return_value = {
            "status": "completed",
            "analysis_id": 1,
            "text": "گزارش جامع راهبردی وضعیت خاورمیانه",
            "news_count": 3,
        }

        await analyze_command(update, context)

        mock_pipe.assert_called_once()
        status_msg.delete.assert_called_once()
        mock_split.assert_called_once()


def test_rate_limiting_logic():
    user_id = 99999
    chat_id = 99999
    # Rapid requests
    allowed1, _ = check_rate_limit(user_id, chat_id, is_group=False)
    assert allowed1 is True

    # Heavy analyze cooldown check
    allowed_an1, _ = check_rate_limit(user_id, chat_id, is_group=False, is_analyze=True)
    assert allowed_an1 is True

    # Immediate second call to analyze should be rejected
    allowed_an2, msg = check_rate_limit(user_id, chat_id, is_group=False, is_analyze=True)
    assert allowed_an2 is False
    assert "محدودیت زمانی" in msg

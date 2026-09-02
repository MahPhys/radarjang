import pytest
from unittest.mock import AsyncMock, patch
from models.models import News
from agents.classifier import ClassifierAgent


@pytest.mark.asyncio
async def test_classifier_processing():
    classifier = ClassifierAgent()
    mock_news = News(
        id=1,
        source_channel="@databaseradarj",
        message_id=500,
        text="بیانیه مشترک پنتاگون درباره تحرکات ناوگان پنجم آمریکا در دریای عمان",
        state="fetched",
    )

    mock_llm_response = '{"category": "Military", "priority": "Critical", "reasoning": "تحرکات مستقیم ناوگان دریایی آمریکا"}'

    with patch("services.llm_service.llm_service.generate", new_callable=AsyncMock) as mock_gen, \
         patch("agents.classifier.update_news_state", new_callable=AsyncMock) as mock_update, \
         patch("agents.classifier.vector_store.add_news_item") as mock_vector, \
         patch.object(classifier, "record_state", new_callable=AsyncMock) as mock_state:

        mock_gen.return_value = mock_llm_response

        result = await classifier.process(mock_news)

        assert result["category"] == "Military"
        assert result["priority"] == "Critical"
        mock_update.assert_called_once_with(1, state="classified", category="Military", priority="Critical")
        mock_vector.assert_called_once()

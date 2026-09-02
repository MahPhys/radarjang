import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from utils.config import config
from services.llm_service import LLMService


def test_xai_configuration_defaults():
    assert hasattr(config, "XAI_API_KEY")
    assert hasattr(config, "GROK_MODEL")
    assert config.GROK_MODEL == "grok-4.3-latest" or isinstance(config.GROK_MODEL, str)


def test_llm_service_attributes():
    service = LLMService()
    assert service.default_provider == "xai"
    assert "api.x.ai" in service.base_url


@pytest.mark.asyncio
async def test_call_xai_grok_openai_compatible():
    service = LLMService()

    fake_response = {
        "choices": [{"message": {"content": '{"analysis": "test Grok 4.3"}'}}],
        "usage": {"prompt_tokens": 150, "completion_tokens": 80, "total_tokens": 230},
    }

    with patch("services.llm_service.config.XAI_API_KEY", "xai-test-key-12345"), \
         patch("services.llm_service.config.GROK_MODEL", "grok-4.3-latest"), \
         patch("services.llm_service.httpx.AsyncClient") as mock_client_cls:

        mock_client = AsyncMock()
        mock_resp = MagicMock()
        mock_resp.json.return_value = fake_response
        mock_resp.raise_for_status = MagicMock()
        mock_client.post.return_value = mock_resp
        mock_client.__aenter__.return_value = mock_client
        mock_client_cls.return_value = mock_client

        res = await service._call_xai(
            model="grok-4.3-latest",
            system_prompt="دستورالعمل سیستم",
            user_prompt="متن خبر ورودی",
            is_json=True,
        )

        assert res["text"] == '{"analysis": "test Grok 4.3"}'
        assert res["prompt_tokens"] == 150
        assert res["completion_tokens"] == 80

        # Verify call arguments
        mock_client.post.assert_called_once()
        call_url = mock_client.post.call_args[0][0]
        assert call_url == "https://api.x.ai/v1/chat/completions"
        call_headers = mock_client.post.call_args[1]["headers"]
        assert call_headers["Authorization"] == "Bearer xai-test-key-12345"
        call_json = mock_client.post.call_args[1]["json"]
        assert call_json["model"] == "grok-4.3-latest"


@pytest.mark.asyncio
async def test_xai_token_usage_recording():
    service = LLMService()

    with patch("services.llm_service.config.XAI_API_KEY", "xai-test-key-999"), \
         patch("services.llm_service.config.GROK_MODEL", "grok-4.3-latest"), \
         patch.object(service, "_call_xai", new_callable=AsyncMock) as mock_exec, \
         patch("services.llm_service.record_api_usage", new_callable=AsyncMock) as mock_record:

        mock_exec.return_value = {
            "text": "تحلیل راهبردی با گراک ۴.۳ انجام شد.",
            "model": "grok-4.3-latest",
            "prompt_tokens": 120,
            "completion_tokens": 95,
        }

        result = await service.generate(
            system_prompt="دستورالعمل",
            user_prompt="متن",
            preferred_models=[("xai", "grok-4.3-latest")],
            is_json=False,
        )

        assert result == "تحلیل راهبردی با گراک ۴.۳ انجام شد."
        mock_record.assert_called_once_with(
            provider="xai",
            model="grok-4.3-latest",
            prompt_tokens=120,
            completion_tokens=95,
        )

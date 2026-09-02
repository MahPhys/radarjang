import hashlib
from typing import Optional, Dict, Any
from datetime import datetime
from utils.config import config
from utils.logger import logger
from services.database import is_news_duplicate, save_news_item
from services.vector_store import vector_store


class ChannelListenerService:
    """
    Channel Listener and News Intake Service using standard Telegram Bot API.
    Replaces legacy Telethon client with webhook/polling admin channel listeners.
    """
    def __init__(self):
        self.is_active = True
        self.last_received_time: Optional[datetime] = None
        self.last_status: str = "Active (Bot API Channel Listener)"
        self.total_received_count: int = 0

    @property
    def is_running(self) -> bool:
        return self.is_active

    @property
    def last_fetch_time(self) -> Optional[datetime]:
        return self.last_received_time

    @property
    def last_fetch_status(self) -> str:
        return self.last_status

    def compute_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    async def ingest_manual_news(self, text: str, source_channel: Optional[str] = None, message_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Allows direct manual news injection or testing."""
        channel = source_channel or config.SOURCE_CHANNEL
        msg_id = message_id or int(datetime.utcnow().timestamp())

        if await is_news_duplicate(channel, msg_id):
            logger.info(f"Duplicate news skipped for channel {channel}, msg_id={msg_id}")
            return None

        content_hash = self.compute_hash(text)
        news = await save_news_item(
            source_channel=channel,
            message_id=msg_id,
            text=text,
            content_hash=content_hash,
            state="fetched",
        )

        if news:
            self.last_received_time = datetime.utcnow()
            self.total_received_count += 1
            self.last_status = f"Ingested msg #{msg_id}"
            
            # Embed into ChromaDB
            vector_store.add_news_item(
                news_id=news.id,
                text=text,
                source_channel=channel,
                timestamp=datetime.utcnow().timestamp(),
            )
            return {"id": news.id, "text": news.text, "channel": channel}
        return None

    def get_status_info(self) -> Dict[str, Any]:
        return {
            "is_active": self.is_active,
            "channel": config.SOURCE_CHANNEL,
            "last_received": self.last_received_time.isoformat() if self.last_received_time else None,
            "status": self.last_status,
            "total_count": self.total_received_count,
        }


# Singleton instance for backwards-compatible imports
fetcher_agent = ChannelListenerService()

import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Config:
    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
    
    # DB URL formatting for Async SQLAlchemy
    raw_db_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///radar.db")
    if raw_db_url.startswith("sqlite://") and not raw_db_url.startswith("sqlite+aiosqlite://"):
        DATABASE_URL = raw_db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+asyncpg://"):
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    else:
        DATABASE_URL = raw_db_url

    # Target source channel for news intake via Bot API
    SOURCE_CHANNEL: str = os.getenv("SOURCE_CHANNEL", "@databaseradarj").strip()
    
    # Support multiple or comma-separated channels if specified
    source_channels_raw = os.getenv("SOURCE_CHANNELS", SOURCE_CHANNEL)
    SOURCE_CHANNELS: List[str] = [ch.strip() for ch in source_channels_raw.split(",") if ch.strip()]
    if SOURCE_CHANNEL and SOURCE_CHANNEL not in SOURCE_CHANNELS:
        SOURCE_CHANNELS.append(SOURCE_CHANNEL)

    admin_ids_raw = os.getenv("ADMIN_IDS", "")
    ADMIN_IDS: List[int] = [int(x.strip()) for x in admin_ids_raw.split(",") if x.strip().isdigit()]

    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "512"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "50"))
    TOP_K: int = int(os.getenv("TOP_K", "10"))
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.65"))

    ANALYSIS_INTERVAL_HOURS: int = int(os.getenv("ANALYSIS_INTERVAL_HOURS", "2"))
    RATE_LIMIT_USER_PER_MIN: int = int(os.getenv("RATE_LIMIT_USER_PER_MIN", "5"))
    RATE_LIMIT_GROUP_PER_MIN: int = int(os.getenv("RATE_LIMIT_GROUP_PER_MIN", "20"))
    HEAVY_ANALYZE_COOLDOWN_SECONDS: int = int(os.getenv("HEAVY_ANALYZE_COOLDOWN_SECONDS", "300"))

    # LLM Configuration (xAI Grok)
    XAI_API_KEY: str = os.getenv("XAI_API_KEY", "")
    GROK_MODEL: str = os.getenv("GROK_MODEL", os.getenv("XAI_MODEL", "grok-4.3-latest"))
    XAI_MODEL: str = GROK_MODEL

    # Optional legacy keys (disabled by default)
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")

    CHROMA_PATH: str = os.getenv("CHROMA_PATH", "./chroma_db")


config = Config()

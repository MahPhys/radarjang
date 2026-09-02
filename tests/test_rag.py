import pytest
from unittest.mock import MagicMock, patch
from services.vector_store import VectorStoreService


def test_chunk_text_logic():
    store = VectorStoreService()
    text = "این یک متن تستی برای بررسی بخش‌بندی متون طولانی است. " * 50
    chunks = store.chunk_text(text, chunk_size=20, overlap=5)
    assert len(chunks) > 1
    assert all(len(c) > 0 for c in chunks)


def test_search_similar_mocked():
    store = VectorStoreService()
    
    mock_collection = MagicMock()
    mock_collection.query.return_value = {
        "documents": [["سابقه توقیف نفتکش‌ها در سال ۲۰۱۹", "استقرار سامانه تاد در منطقه"]],
        "metadatas": [[
            {"news_id": 10, "chunk_index": 0, "timestamp": 1700000000.0},
            {"news_id": 11, "chunk_index": 0, "timestamp": 1700000000.0},
        ]],
        "distances": [[0.2, 0.3]],  # Cosine distances -> similarities: 0.8, 0.7
    }

    mock_embedder = MagicMock()
    mock_embedder.encode.return_value = MagicMock(tolist=lambda: [[0.1, 0.2, 0.3]])

    store._collection = mock_collection
    store._embedder = mock_embedder

    results = store.search_similar(
        query="نفتکش و سامانه‌های پدافندی",
        top_k=5,
        similarity_threshold=0.65,
    )

    assert len(results) == 2
    assert results[0]["similarity"] == pytest.approx(0.8)
    assert results[1]["similarity"] == pytest.approx(0.7)
    assert results[0]["metadata"]["news_id"] == 10

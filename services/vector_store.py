import os
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import chromadb
from sentence_transformers import SentenceTransformer
from utils.config import config
from utils.logger import logger


class VectorStoreService:
    def __init__(self):
        self.chroma_path = config.CHROMA_PATH
        self.collection_name = "news_embeddings"
        self._client = None
        self._collection = None
        self._embedder = None

    @property
    def client(self):
        if self._client is None:
            os.makedirs(self.chroma_path, exist_ok=True)
            self._client = chromadb.PersistentClient(path=self.chroma_path)
        return self._client

    @property
    def collection(self):
        if self._collection is None:
            self._collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        return self._collection

    @property
    def embedder(self) -> SentenceTransformer:
        if self._embedder is None:
            model_name = config.EMBEDDING_MODEL
            logger.info(f"Loading embedding model '{model_name}'. On first run this downloads weights...")
            try:
                self._embedder = SentenceTransformer(model_name)
            except Exception as e:
                logger.warning(f"Failed to load {model_name}: {e}. Falling back to 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'")
                self._embedder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        return self._embedder

    def chunk_text(self, text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
        """Split text into chunks with approximate token count and overlap."""
        if not text:
            return []
        
        words = text.split()
        if len(words) <= chunk_size:
            return [text.strip()]

        chunks = []
        step = max(1, chunk_size - overlap)
        for i in range(0, len(words), step):
            chunk_words = words[i : i + chunk_size]
            chunk_str = " ".join(chunk_words).strip()
            if chunk_str:
                chunks.append(chunk_str)
            if i + chunk_size >= len(words):
                break
        return chunks

    def add_news_item(
        self,
        news_id: int,
        text: str,
        source_channel: str,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        timestamp: Optional[float] = None,
    ):
        """Chunk, embed, and store a news item into ChromaDB."""
        if not text:
            return

        ts = timestamp if timestamp is not None else time.time()
        chunks = self.chunk_text(text, chunk_size=config.CHUNK_SIZE, overlap=config.CHUNK_OVERLAP)
        if not chunks:
            return

        embeddings = self.embedder.encode(chunks, normalize_embeddings=True).tolist()
        ids = [f"news_{news_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [
            {
                "news_id": news_id,
                "chunk_index": i,
                "source_channel": source_channel or "",
                "category": category or "Unclassified",
                "priority": priority or "Medium",
                "timestamp": float(ts),
            }
            for i in range(len(chunks))
        ]

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
        )
        logger.debug(f"Added {len(chunks)} chunks for news_id={news_id} to vector store.")

    def search_similar(
        self,
        query: str,
        top_k: int = 10,
        similarity_threshold: float = 0.65,
        exclude_news_id: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve chunks with cosine similarity >= threshold from the last 12 months.
        Limit to max 3 chunks per news_id.
        """
        if not query.strip():
            return []

        # Filter last 12 months (365 days)
        one_year_ago = time.time() - (365 * 24 * 3600)
        where_filter: Dict[str, Any] = {"timestamp": {"$gte": float(one_year_ago)}}

        query_embedding = self.embedder.encode([query], normalize_embeddings=True).tolist()

        try:
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=top_k * 3,  # fetch more to allow post-filtering
                where=where_filter,
                include=["documents", "metadatas", "distances"],
            )
        except Exception as e:
            logger.error(f"Vector search query failed: {e}")
            return []

        if not results or not results["documents"] or not results["documents"][0]:
            return []

        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        filtered = []
        news_id_counts: Dict[int, int] = {}

        for doc, meta, dist in zip(docs, metas, distances):
            # Chroma returns cosine distance (distance = 1 - cosine_similarity)
            # cosine_similarity = 1 - distance
            similarity = 1.0 - dist
            if similarity < similarity_threshold:
                continue

            n_id = meta.get("news_id")
            if exclude_news_id is not None and n_id == exclude_news_id:
                continue

            # Limit max 3 chunks from the same news_id
            if n_id is not None:
                current_count = news_id_counts.get(n_id, 0)
                if current_count >= 3:
                    continue
                news_id_counts[n_id] = current_count + 1

            filtered.append({
                "text": doc,
                "metadata": meta,
                "similarity": similarity,
            })

            if len(filtered) >= top_k:
                break

        return filtered

    def cleanup_old_documents(self, months: int = 12):
        """Deletes documents older than specified months from ChromaDB."""
        cutoff = time.time() - (months * 30 * 24 * 3600)
        try:
            self.collection.delete(where={"timestamp": {"$lt": float(cutoff)}})
            logger.info(f"Cleaned up vector store documents older than {months} months.")
        except Exception as e:
            logger.error(f"Error during vector store cleanup: {e}")


vector_store = VectorStoreService()

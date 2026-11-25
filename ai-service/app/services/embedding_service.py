"""Tukang sidik jari Kos Pepe (Fase 2 / Q11).

Mengubah 1 koper Varian (judul + syarat + kanal + note) menjadi vektor
768 dimensi via Gemini, dan sebaliknya untuk pertanyaan warga.
"""

from functools import lru_cache
from google import genai
from google.genai import types
from app.core.config import settings

EMBED_MODEL = settings.EMBEDDING_MODEL
EMBED_DIMENSION = settings.EMBEDDING_DIM
EMBED_CONFIG = types.EmbedContentConfig(output_dimensionality=EMBED_DIMENSION)

_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY belum diisi di environment.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def build_varian_content(
    sop_name: str, varian: str, syarat: list[str], channel_url: str = "", note: str = ""
) -> str:
    """Merakit teks dari admin menjadi format standar yang mudah dipahami LLM"""
    lines = [f"SOP: {sop_name.strip()}", f"Varian: {varian.strip()}", "", "Syarat:"]
    lines += [f"- {s.strip()}" for s in syarat if s and s.strip()]
    if channel_url and channel_url.strip():
        lines += ["", f"Kanal: {channel_url.strip()}"]
    if note and note.strip():
        lines += [f"Catatan: {note.strip()}"]
    return "\n".join(lines).strip()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Mengubah kumpulan teks menjadi vektor dimensi via Gemini API"""
    if not texts:
        return []
    client = _get_client()
    vectors = []
    for text in texts:
        resp = client.models.embed_content(
            model=EMBED_MODEL, contents=text, config=EMBED_CONFIG
        )

        # Pengaman: Pastikan respons Google tidak kosong sebelum dijadikan list
        if not resp.embeddings or not resp.embeddings[0].values:
            raise ValueError("API Gemini tidak mengembalikan nilai vektor.")

        values = list(resp.embeddings[0].values)

        if len(values) != EMBED_DIMENSION:
            raise ValueError(f"Dimensi vektor salah: {len(values)}")
        vectors.append(values)
    return vectors


@lru_cache(maxsize=256)
def _embed_query_cached(normalized_text: str) -> tuple[float, ...]:
    """Menyimpan vektor pertanyaan yang sama di memori agar tidak memanggil API berulang."""
    return tuple(embed_texts([normalized_text])[0])


def embed_query(text: str) -> list[float]:
    """Mengubah pertanyaan warga menjadi 1 baris vektor (memanfaatkan cache memori)."""
    return list(_embed_query_cached(text.strip()))

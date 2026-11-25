import logging
import time
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.services.rag_engine import search, get_service_catalog
from app.services.llm_service import generate_answer, get_fallback_contact
from app.models.chat_history import ChatHistory
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(tags=["chat"])

VALID_CHANNELS = ("WA", "Web")
MAX_HISTORY = settings.SESSION_MAX_HISTORY


class ChatTurn(BaseModel):
    role: str = Field(description="'warga' atau 'bot'")
    text: str


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    channel: str = "Web"
    top_k: int = Field(default=settings.TOP_K, ge=1, le=10)
    session_id: str | None = None
    history: list[ChatTurn] = []


class ChatCitation(BaseModel):
    sop_name: str
    varian: str
    version: int


class ChatResponse(BaseModel):
    answer: str
    citations: list[ChatCitation]
    fallback: bool
    fallback_contact: dict = {}


def _normalize_channel(channel: str) -> str:
    normalized = (channel or "").strip().lower()
    if normalized == "wa":
        return "WA"
    if normalized == "web":
        return "Web"
    raise HTTPException(
        status_code=422, detail=f"channel harus salah satu dari {VALID_CHANNELS}"
    )


def _load_history_from_db(session_id: str, db: Session) -> list[dict[str, str]]:
    """Memuat N pesan terakhir dari database berdasarkan session_id."""
    rows = (
        db.query(ChatHistory)
        .filter(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(MAX_HISTORY)
        .all()
    )
    # Balik urutan agar kronologis (terlama dulu)
    rows.reverse()
    return [{"role": r.role, "text": r.text} for r in rows]


def _save_history_pair(
    session_id: str, user_text: str, bot_text: str, db: Session
) -> None:
    """Menyimpan pasangan pesan warga dan bot dalam satu transaksi database."""
    db.add_all(
        [
            ChatHistory(session_id=session_id, role="warga", text=user_text),
            ChatHistory(session_id=session_id, role="bot", text=bot_text),
        ]
    )
    db.commit()


def _contextualize_query(query: str, history: list[dict[str, str]]) -> str:
    """Memperkaya query singkat warga dengan konteks dari riwayat percakapan.

    Jika warga menjawab singkat (misalnya "Pecah KK", "nomor 2", "yang hilang")
    setelah bot bertanya balik, kita gabungkan pertanyaan bot sebelumnya dengan
    jawaban warga agar vektor pencarian lebih bermakna.
    """
    if not history:
        return query

    # Hanya perkaya jika query sangat pendek (< 30 karakter) dan
    # pesan terakhir dari bot (kemungkinan pertanyaan klarifikasi)
    if len(query.strip()) < 30 and history[-1].get("role") == "bot":
        last_bot = history[-1]["text"]
        # Gabungkan konteks bot + jawaban warga untuk pencarian
        return f"{last_bot}\n\nJawaban warga: {query}"

    return query


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    channel = _normalize_channel(payload.channel)
    _ = channel  # Dicatat untuk audit kanal; penyaluran balik ke kanal asal diurus Laravel.

    # 1. Kumpulkan riwayat percakapan
    history: list[dict[str, str]] = []
    session_id = payload.session_id

    if session_id:
        # Muat dari database (utamanya untuk WhatsApp)
        history = _load_history_from_db(session_id, db)
    elif payload.history:
        # Gunakan history yang dikirim frontend (untuk Web)
        history = [{"role": h.role, "text": h.text} for h in payload.history]

    # 2. Perkaya query jika terlalu singkat (jawaban lanjutan dari klarifikasi)
    search_query = _contextualize_query(payload.query, history)

    t_start = time.perf_counter()

    # 3. Cari dokumen SOP via pgvector
    t_search_start = time.perf_counter()
    result = search(search_query, db, top_k=payload.top_k)
    t_search = time.perf_counter() - t_search_start

    # 4. Ambil katalog layanan untuk diberikan ke LLM
    catalog = get_service_catalog(db) if result.needs_clarification else None

    # 5. Komposisi: kosongkan chunks HANYA jika hard fallback
    chunks = [] if result.fallback else result.chunks

    # 6. Minta LLM merangkai jawaban berdasarkan konteks SOP
    t_llm_start = time.perf_counter()
    generated = generate_answer(
        payload.query,  # Kirim query asli ke LLM, bukan yang sudah diperkaya
        chunks,
        history=history,
        catalog=catalog,
    )
    t_llm = time.perf_counter() - t_llm_start

    # 7. Tentukan status fallback final
    fallback = result.fallback or generated["refused"]
    contact = get_fallback_contact() if fallback else {}

    # 8. Simpan riwayat ke database dalam 1 transaksi (jika ada session_id)
    if session_id:
        answer_text = generated["answer"] if not fallback else (
            "Maaf, informasi tersebut tidak ada di pedoman dokumen Desa Pepe."
        )
        _save_history_pair(session_id, payload.query, answer_text, db)

    t_total = time.perf_counter() - t_start
    logger.info(
        "chat channel=%s search=%.2fs llm=%.2fs total=%.2fs fallback=%s",
        channel,
        t_search,
        t_llm,
        t_total,
        fallback,
    )

    return ChatResponse(
        answer=generated["answer"],
        citations=[ChatCitation(**c) for c in generated["citations"]],
        fallback=fallback,
        fallback_contact=contact if fallback else {},
    )

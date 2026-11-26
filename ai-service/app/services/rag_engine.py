"""Retrieval RAG + Smart Fallback Dua Tingkat (Soft & Hard).

Alur: embed pertanyaan (768) -> cari N baris terdekat di Postgres+pgvector
diurutkan cosine distance -> konversi ke similarity -> bandingkan dengan
dua threshold:
  - >= RETRIEVAL_THRESHOLD (0.65): cocok kuat, langsung jawab.
  - >= MIN_RETRIEVAL_THRESHOLD (0.40) ATAU ada keyword match: zona ragu,
    kirim konteks ke LLM agar LLM bisa menjawab atau bertanya balik.
  - < MIN_RETRIEVAL_THRESHOLD dan tidak ada keyword match: hard fallback.

Ditambahkan juga keyword/SOP-group boost dan katalog layanan agar LLM tahu
semua layanan yang tersedia di Desa Pepe.
"""

from dataclasses import dataclass, field
from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from app.models.document_vector import DocumentVector
from app.services.embedding_service import embed_query
from app.core.config import settings

SIMILARITY_THRESHOLD = settings.RETRIEVAL_THRESHOLD
MIN_SIMILARITY_THRESHOLD = settings.MIN_RETRIEVAL_THRESHOLD
DEFAULT_TOP_K = settings.TOP_K

# Kata kunci pendek yang sering dipakai warga untuk merujuk SOP tertentu.
# Key = kata kunci (lowercase), Value = bagian dari sop_name di database.
SOP_KEYWORDS: dict[str, list[str]] = {
    "kk": ["KK"],
    "kartu keluarga": ["KK"],
    "ktp": ["KTP"],
    "akte": ["Akte Kelahiran", "Akte Kematian"],
    "akta": ["Akte Kelahiran", "Akte Kematian"],
    "lahir": ["Akte Kelahiran"],
    "kelahiran": ["Akte Kelahiran"],
    "kematian": ["Akte Kematian", "Surat Keterangan Kematian"],
    "meninggal": ["Akte Kematian", "Surat Keterangan Kematian"],
    "pindah": ["Pindah"],
    "domisili": ["Surat Keterangan Domisili Usaha", "Surat Keterangan Domisili Tempat Tinggal"],
    "sktm": ["Surat Keterangan Tidak Mampu"],
    "tidak mampu": ["Surat Keterangan Tidak Mampu"],
    "belum menikah": ["Surat Keterangan Belum Menikah"],
    "beda nama": ["Surat Keterangan Beda Nama"],
    "penghasilan": ["Surat Keterangan Penghasilan"],
    "dtks": ["Pembaharuan Desil di DTKS"],
    "bansos": ["Pembaharuan Desil di DTKS"],
    "desil": ["Pembaharuan Desil di DTKS"],
    "bpjs": ["KIS BPJS PBPU Pemerintah Daerah"],
    "kis": ["KIS BPJS PBPU Pemerintah Daerah"],
    "kia": ["KIA"],
    "kartu identitas anak": ["KIA"],
}


@dataclass
class RetrievedChunk:
    sop_name: str
    varian: str
    content: str
    version: int
    distance: float
    similarity: float


@dataclass
class SearchResult:
    query: str
    chunks: list[RetrievedChunk] = field(default_factory=list)
    fallback: bool = True          # hard fallback: LLM tidak dipanggil
    needs_clarification: bool = False  # soft: LLM dipanggil tapi skor rendah
    best_similarity: float | None = None
    keyword_matched: bool = False


def _detect_sop_keywords(query: str) -> list[str]:
    """Mendeteksi kata kunci SOP dalam pertanyaan warga, mengembalikan
    daftar sop_name yang cocok."""
    q_lower = query.lower()
    matched_sops: set[str] = set()
    for keyword, sop_names in SOP_KEYWORDS.items():
        if keyword in q_lower:
            matched_sops.update(sop_names)
    return list(matched_sops)


def _boost_with_keyword_chunks(
    db: Session, matched_sops: list[str], existing_chunks: list[RetrievedChunk],
    top_k: int
) -> list[RetrievedChunk]:
    """Menambahkan chunk dari SOP yang cocok dengan kata kunci warga
    tetapi belum ada di hasil vector search."""
    existing_keys = {(c.sop_name, c.varian) for c in existing_chunks}
    missing_sops = [s for s in matched_sops
                    if not any(c.sop_name == s for c in existing_chunks)]

    if not missing_sops:
        return existing_chunks

    extra_rows = (
        db.query(DocumentVector)
        .filter(DocumentVector.sop_name.in_(missing_sops))
        .limit(top_k)
        .all()
    )

    boosted = list(existing_chunks)
    for row in extra_rows:
        if (row.sop_name, row.varian) not in existing_keys:
            boosted.append(RetrievedChunk(
                sop_name=row.sop_name,
                varian=row.varian,
                content=row.content,
                version=row.version,
                distance=1.0,       # skor keyword, bukan vektor
                similarity=0.50,    # di zona soft agar LLM tetap membacanya
            ))
            existing_keys.add((row.sop_name, row.varian))

    return boosted


def get_service_catalog(db: Session) -> list[dict[str, str]]:
    """Mengambil daftar ringkas semua layanan (sop_name + varian) yang ada
    di database, agar LLM tahu pilihan yang tersedia saat bertanya balik."""
    rows = (
        db.query(
            DocumentVector.sop_name,
            DocumentVector.varian,
        )
        .order_by(DocumentVector.sop_name, DocumentVector.varian)
        .all()
    )
    return [{"sop_name": r.sop_name, "varian": r.varian} for r in rows]


def search(
    query: str, db: Session, top_k: int = DEFAULT_TOP_K, sop_name: str | None = None
) -> SearchResult:
    """Mencari SOP desa terdekat menggunakan ekstensi pgvector (<=>)
    dengan fallback dua tingkat."""
    if not query or not query.strip():
        return SearchResult(query=query)

    # 1. Deteksi kata kunci SOP dalam pertanyaan
    matched_sops = _detect_sop_keywords(query)

    # 2. Ubah pertanyaan jadi angka
    vector = embed_query(query.strip())

    # 3. Rumus kalkulasi Cosine Distance dari pgvector SQLAlchemy
    distance_col = DocumentVector.embedding.cosine_distance(vector).label("distance")
    q = db.query(DocumentVector, distance_col)

    if sop_name:
        q = q.filter(DocumentVector.sop_name == sop_name)

    # 4. Urutkan berdasarkan yang paling mirip (jarak terdekat)
    rows = q.order_by(distance_col).limit(top_k).all()

    chunks = [
        RetrievedChunk(
            sop_name=row.DocumentVector.sop_name,
            varian=row.DocumentVector.varian,
            content=row.DocumentVector.content,
            version=row.DocumentVector.version,
            distance=float(row.distance),
            similarity=1.0 - float(row.distance),
        )
        for row in rows
    ]

    # 5. Boost: tambahkan chunk dari SOP yang cocok kata kunci tapi
    #    tidak muncul di hasil vektor
    if matched_sops:
        chunks = _boost_with_keyword_chunks(db, matched_sops, chunks, top_k)

    # 6. Kalau database masih kosong dan tidak ada keyword match
    if not chunks:
        return SearchResult(query=query, keyword_matched=bool(matched_sops))

    # 7. Tentukan level fallback berdasarkan dua ambang batas
    best = max(c.similarity for c in chunks)
    has_keyword = bool(matched_sops)

    if best >= SIMILARITY_THRESHOLD:
        # Cocok kuat: langsung jawab
        return SearchResult(
            query=query,
            chunks=chunks,
            fallback=False,
            needs_clarification=False,
            best_similarity=best,
            keyword_matched=has_keyword,
        )
    elif best >= MIN_SIMILARITY_THRESHOLD or has_keyword:
        # Zona ragu: kirim ke LLM, biarkan LLM yang memutuskan
        return SearchResult(
            query=query,
            chunks=chunks,
            fallback=False,
            needs_clarification=True,
            best_similarity=best,
            keyword_matched=has_keyword,
        )
    else:
        # Hard fallback: skor terlalu rendah dan tidak ada kata kunci
        return SearchResult(
            query=query,
            chunks=chunks,
            fallback=True,
            needs_clarification=False,
            best_similarity=best,
            keyword_matched=has_keyword,
        )

# Perbaikan Smart Fallback, Klarifikasi Ambiguitas, dan Riwayat Percakapan (`ai-service` & Integrasi Web)

Dokumen ini mencatat seluruh revisi yang dilakukan untuk mengatasi masalah bot yang terlalu cepat melakukan *fallback* saat warga bertanya dengan kalimat santai, pernyataan niat singkat, atau pertanyaan yang masih berada dalam lingkup SOP tetapi belum spesifik variannya.

> Nilai rahasia (`GEMINI_API_KEY`, `INTERNAL_API_KEY`, dan kredensial database) tidak ditulis di dokumen ini.

---

## 1. Ringkasan Eksekutif & Akar Masalah

Sebelum revisi, bot menggunakan mekanisme **single-turn strict fallback** yang memblokir pertanyaan di dua pintu berurutan:

| Pintu | Penyebab Sebelumnya | Contoh Kasus |
|---|---|---|
| **Pintu 1: Retrieval (`rag_engine.py`)** | `RETRIEVAL_THRESHOLD = 0.65` bersifat *hard block*. Jika `best_similarity < 0.65`, `chat.py` mengosongkan `chunks = []` sehingga LLM **tidak pernah dipanggil**. | `"saya ingin mengurus ktp hilang"` (tanpa kata *"syarat"*), `"mau pindah keluar dari desa pepe gimana caranya"` (`0.6245 < 0.65`). |
| **Pintu 2: LLM (`llm_service.py`)** | `SYSTEM_PROMPT` hanya mengenal dua opsi: jawab persis dari konteks atau balas `TIDAK_ADA_DI_SOP`. Tidak ada instruksi untuk bertanya balik/mengerucutkan varian. | `"saya ingin mengurus KK baru, apa saja syarat yang diperlukan?"` (di SOP hanya ada `Pecah KK`, `Pembaruan`, `Perubahan Biodata`, `Hilang` — tidak ada varian `Baru`). |
| **Ketiadaan Memori (*Stateless*)** | `ChatRequest` hanya menerima `query`, `channel`, dan `top_k`. `session_id` dari WhatsApp diabaikan dan Web Chat tidak mengirim riwayat pesan. | Jika bot bertanya balik (*"Maksudnya Pecah KK atau Pembaruan?"*), balasan singkat warga seperti `"Pecah KK"` atau `"nomor 2"` tidak akan nyambung. |

### Solusi yang Diterapkan (*Clarify-First RAG*)

1. **Threshold Dua Tingkat (*Soft & Hard Fallback*):**
   - `>= 0.65` (`RETRIEVAL_THRESHOLD`): cocok kuat → langsung jawab.
   - `>= 0.40` (`MIN_RETRIEVAL_THRESHOLD`) atau ada kecocokan kata kunci SOP: **zona ragu** → tetap kirim `chunks` + katalog layanan ke LLM agar LLM dapat menjawab langsung atau bertanya balik untuk mengerucutkan.
   - `< 0.40` dan tidak ada kecocokan kata kunci: *hard fallback* → langsung kembalikan kontak petugas tanpa memanggil LLM.
2. **Keyword/SOP-Group Boost & Katalog Layanan:** tanpa mengubah format `content` di `document_vectors` (agar form admin [Form.jsx](file:///d:/Semester%205/Project%20Akhir/pepebot-rag/core-service/resources/js/Pages/Admin/Knowledge/Form.jsx) tetap kompatibel).
3. **System Prompt 3 Skenario:** pahami niat santai, klarifikasi jika varian ambigu, dan balas `TIDAK_ADA_DI_SOP` hanya jika topik benar-benar di luar layanan desa.
4. **Riwayat Percakapan & Query Contextualization:** via `session_id` (disimpan di tabel `chat_history` PostgreSQL untuk WhatsApp) dan `history` (dikirim langsung oleh Web Chat).

```text
Pertanyaan Warga
   │
   ▼
[Contextualize Query] (jika balasan singkat < 30 char setelah pertanyaan bot)
   │
   ▼
[pgvector Search + Keyword Boost]
   ├── best >= 0.65 ──────────────────────────► LLM (Jawab langsung / klarifikasi jika ambigu)
   ├── best >= 0.40 atau keyword match ───────► LLM + Katalog Layanan (Jawab / kerucutkan varian)
   └── best < 0.40 dan tanpa keyword match ───► Hard Fallback (Kontak WA / URL Petugas)
```

---

## 2. Bedah Perubahan Per Step & Per File

### Step 1 — Konfigurasi Ambang Batas 2 Tingkat & Riwayat Sesi

#### 1.1 `ai-service/app/core/config.py`
* **Apa yang diubah:** Menambahkan `MIN_RETRIEVAL_THRESHOLD` (`0.40`), `SESSION_MAX_HISTORY` (`6`), serta menaikkan default `TOP_K` dari `4` menjadi `6` agar seluruh varian dari suatu layanan (misalnya keempat varian `KK`) ikut terbawa ke konteks.
* **Kode akhir:**

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    INTERNAL_API_KEY: str
    GEMINI_API_KEY: str
    EMBEDDING_MODEL: str = "gemini-embedding-001"
    EMBEDDING_DIM: int = 768
    LLM_MODEL: str = "gemini-3.5-flash-lite"
    RETRIEVAL_THRESHOLD: float = 0.65
    MIN_RETRIEVAL_THRESHOLD: float = 0.40
    TOP_K: int = 6
    SESSION_MAX_HISTORY: int = 6
    # Kontak fallback: nilai di bawah adalah default lama (tetap dipakai bila env
    # tidak diisi), tetapi bisa ditimpa lewat environment/.env tanpa ubah kode.
    DESA_PETUGAS_WA: str = "081234567890"
    DESA_PETUGAS_URL: str = "https://pepe.desa.id"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()  # type: ignore
```

#### 1.2 `ai-service/.env.example` (dan `.env`)
* **Apa yang diubah:** Menyinkronkan variabel opsional baru `MIN_RETRIEVAL_THRESHOLD`, `TOP_K`, dan `SESSION_MAX_HISTORY`.
* **Kode akhir:**

```dotenv
# --- Wajib ---
INTERNAL_API_KEY=ganti_dengan_string_acak_panjang
GEMINI_API_KEY=isi_dengan_api_key_gemini_anda

# --- Opsional (semua punya default di app/core/config.py) ---
EMBEDDING_MODEL=gemini-embedding-001
EMBEDDING_DIM=768
LLM_MODEL=gemini-3.5-flash-lite
RETRIEVAL_THRESHOLD=0.65
MIN_RETRIEVAL_THRESHOLD=0.40
TOP_K=6
SESSION_MAX_HISTORY=6
DESA_PETUGAS_WA=081234567890
DESA_PETUGAS_URL=https://pepe.desa.id
```

---

### Step 2 — Retrieval Dua Tingkat, Keyword Boost & Katalog Layanan

#### 2.1 `ai-service/app/services/rag_engine.py`
* **Apa yang diubah:**
  1. Menambahkan kamus `SOP_KEYWORDS` dan fungsi `_detect_sop_keywords()` + `_boost_with_keyword_chunks()` untuk menarik dokumen SOP yang relevan secara kata kunci meskipun skor vektor kalimat santainya rendah.
  2. Menambahkan `get_service_catalog()` untuk mengambil daftar `(sop_name, varian)` dari tabel `document_vectors`.
  3. Memperluas `SearchResult` dengan field `needs_clarification` dan `keyword_matched`, serta menerapkan logika dua ambang batas (`SIMILARITY_THRESHOLD` dan `MIN_SIMILARITY_THRESHOLD`).
* **Kode akhir:**

```python
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
```

---

### Step 3 — Pembaruan System Prompt & Dukungan History/Katalog di LLM

#### 3.1 `ai-service/app/services/llm_service.py`
* **Apa yang diubah:**
  1. Memperbarui `SYSTEM_PROMPT` dari 4 aturan menjadi 7 aturan: menambah aturan **PAHAMI NIAT WARGA**, **KLARIFIKASI JIKA AMBIGU**, **RIWAYAT PERCAKAPAN**, dan memperketat **FALLBACK TERAKHIR** agar `TIDAK_ADA_DI_SOP` hanya keluar jika topik benar-benar di luar SOP maupun katalog layanan.
  2. Memperbarui `build_prompt()` dan `generate_answer()` agar menerima parameter opsional `history` dan `catalog`.
* **Kode akhir:**

```python
from google import genai
from app.core.config import settings
from app.services.rag_engine import RetrievedChunk

LLM_MODEL = settings.LLM_MODEL

# Kontak darurat jika data tidak ditemukan. Default ada di config.py; isi
# DESA_PETUGAS_WA / DESA_PETUGAS_URL di environment bila ingin menimpanya.
FALLBACK_WA = settings.DESA_PETUGAS_WA
FALLBACK_URL = settings.DESA_PETUGAS_URL

REFUSAL_MARKER = "TIDAK_ADA_DI_SOP"

SYSTEM_PROMPT = """\
Anda adalah PepeBot, asisten virtual yang ramah, responsif, dan empatik untuk melayani warga Desa Pepe, Sidoarjo.
Gunakan gaya bahasa Indonesia yang sopan, terstruktur, dan komunikatif, layaknya staf desa yang cekatan.

ATURAN WAJIB:
1. SALAM BERSYARAT: Jika pesan warga mengandung sapaan (misal: "Halo", "Min", "Selamat pagi"), balas sapaan tersebut dengan singkat dan ramah, lalu berikan jawaban. Namun, jika warga langsung bertanya tanpa basa-basi, JANGAN berikan salam pembuka apa pun; langsung jawab *to the point*.

2. PAHAMI NIAT WARGA: Warga sering menyampaikan niat mereka dengan kalimat santai seperti "saya ingin mengurus KTP hilang", "mau urus KK baru", atau "bagaimana cara pindah?". Anda WAJIB memahami niat tersebut dan mencocokkannya dengan SOP yang paling relevan di KONTEKS SOP, lalu langsung berikan informasi persyaratan, kanal pengajuan, dan catatan yang sesuai. JANGAN memaksa warga mengetik pertanyaan formal atau kata "syarat" terlebih dahulu.

3. FAKTA BERDASARKAN SOP: Jawab pertanyaan warga secara akurat HANYA berdasarkan KONTEKS SOP yang diberikan.

4. KLARIFIKASI JIKA AMBIGU (PENTING): Jika topik pertanyaan warga MASIH ADA di KONTEKS SOP atau di KATALOG LAYANAN, tetapi tidak jelas varian mana yang dimaksud (misalnya warga bertanya "urus KK baru" padahal ada varian Pecah KK, Pembaruan, Perubahan Biodata, dan Hilang), JANGAN balas TIDAK_ADA_DI_SOP. Sebaliknya, Anda WAJIB:
   a. Menyebutkan bahwa Desa Pepe memiliki beberapa jenis layanan terkait topik tersebut.
   b. Menyebutkan pilihan varian yang tersedia secara jelas dan bernomor.
   c. Meminta warga memilih salah satu agar Anda bisa memberikan informasi yang tepat.
   Contoh: "Untuk layanan KK, Desa Pepe memiliki beberapa jenis layanan berikut:\n1. Perubahan Biodata\n2. Pecah KK\n3. KK Hilang\n4. Pembaruan KK\n\nSilakan pilih nomor atau sebutkan jenis layanan yang Anda maksud agar saya bisa memberikan informasi persyaratan yang tepat."

5. CATATAN PIHAK KETIGA: Jika jawaban melibatkan instansi luar (Kecamatan/Dispendukcapil/Website Plavon, dll), Anda WAJIB meletakkan informasi tersebut di PALING BAWAH sebagai "Catatan:" setelah daftar syarat utama selesai.

6. RIWAYAT PERCAKAPAN: Jika ada RIWAYAT PERCAKAPAN, gunakan untuk memahami konteks lanjutan. Misalnya jika sebelumnya Anda bertanya pilihan varian dan warga menjawab singkat ("Pecah KK", "nomor 2", "yang hilang"), cocokkan jawaban warga dengan pilihan yang sudah Anda berikan sebelumnya, lalu jawab sesuai SOP.

7. FALLBACK TERAKHIR: HANYA jika topik pertanyaan warga BENAR-BENAR TIDAK ADA di KONTEKS SOP maupun KATALOG LAYANAN (misalnya urus SIM, paspor, perpanjang STNK, atau topik di luar administrasi desa), Anda WAJIB membalas dengan kalimat persis: TIDAK_ADA_DI_SOP (tanpa spasi atau tambahan teks lain).
"""


def get_fallback_contact() -> dict[str, str]:
    return {"whatsapp": FALLBACK_WA, "url": FALLBACK_URL}


def build_fallback_answer() -> str:
    parts = ["Maaf, informasi tersebut tidak ada di pedoman dokumen Desa Pepe."]
    contact = get_fallback_contact()
    tambahan = []

    if contact.get("whatsapp"):
        tambahan.append(f"WhatsApp petugas: {contact['whatsapp']}")
    if contact.get("url"):
        tambahan.append(f"Info lanjut: {contact['url']}")

    if tambahan:
        parts.append("Silakan hubungi " + " / ".join(tambahan) + ".")
    else:
        parts.append("Silakan hubungi petugas Desa Pepe untuk bantuan langsung.")

    return " ".join(parts)


def build_prompt(
    query: str,
    chunks: list[RetrievedChunk],
    history: list[dict[str, str]] | None = None,
    catalog: list[dict[str, str]] | None = None,
) -> str:
    # Bagian konteks SOP
    ctx = []
    for c in chunks:
        ctx.append(
            f"[SOP: {c.sop_name} | Varian: {c.varian} | versi {c.version}]\n{c.content}"
        )

    parts = [SYSTEM_PROMPT]

    # Katalog layanan
    if catalog:
        catalog_lines = []
        for item in catalog:
            catalog_lines.append(f"- {item['sop_name']} / {item['varian']}")
        parts.append("KATALOG LAYANAN DESA PEPE (semua layanan yang tersedia):\n"
                      + "\n".join(catalog_lines))

    # Konteks SOP dari retrieval
    parts.append("KONTEKS SOP:\n" + "\n\n---\n\n".join(ctx))

    # Riwayat percakapan (jika ada)
    if history:
        hist_lines = []
        for turn in history:
            role = turn.get("role", "warga")
            text = turn.get("text", "")
            if role == "warga":
                hist_lines.append(f"Warga: {text}")
            else:
                hist_lines.append(f"PepeBot: {text}")
        parts.append("RIWAYAT PERCAKAPAN (terbaru di bawah):\n" + "\n".join(hist_lines))

    parts.append(f"PERTANYAAN WARGA:\n{query}\n\nJAWABAN:")
    return "\n\n".join(parts)


def _get_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY belum diisi di environment.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_answer(
    query: str,
    chunks: list[RetrievedChunk],
    history: list[dict[str, str]] | None = None,
    catalog: list[dict[str, str]] | None = None,
) -> dict:
    citations = [
        {"sop_name": c.sop_name, "varian": c.varian, "version": c.version}
        for c in chunks
    ]

    # Jika chunk kosong (karena kena blokir Hard Fallback)
    if not chunks:
        return {
            "answer": build_fallback_answer(),
            "citations": citations,
            "refused": True,
        }

    client = _get_client()
    resp = client.models.generate_content(
        model=LLM_MODEL,
        contents=build_prompt(query, chunks, history=history, catalog=catalog),
    )

    text = (resp.text or "").strip()

    # Jika AI menyerah karena tidak tahu (Aturan 7 di System Prompt)
    if REFUSAL_MARKER in text:
        return {
            "answer": build_fallback_answer(),
            "citations": citations,
            "refused": True,
        }

    return {"answer": text, "citations": citations, "refused": False}
```

---

### Step 4 — Model Database Riwayat Percakapan

#### 4.1 `ai-service/app/models/chat_history.py` (File Baru)
* **Apa yang dibuat:** Tabel `chat_history` di PostgreSQL untuk menyimpan riwayat pesan berdasarkan `session_id` (dipakai oleh kanal WhatsApp yang mengirim nomor pengirim sebagai `session_id`).
* **Kode akhir:**

```python
"""Model ringan untuk menyimpan riwayat percakapan per sesi.

Digunakan terutama oleh kanal WhatsApp (session_id = nomor pengirim)
dan Web (session_id = UUID acak dari frontend).
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.db import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    role = Column(String(10), nullable=False)  # "warga" atau "bot"
    text = Column(Text, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
```

#### 4.2 `ai-service/main.py`
* **Apa yang diubah:** Mengimpor `app.models.chat_history` sebelum `Base.metadata.create_all(bind=engine)` agar tabel `chat_history` otomatis terbuat saat `ai-service` menyala.
* **Kode akhir:**

```python
from fastapi import FastAPI
from app.core.db import engine, Base
from app.api.router import api_router
from app.models import chat_history  # noqa: F401 — daftarkan tabel riwayat

# Mencetak tabel ke database secara otomatis saat server menyala
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Service - PepeBot RAG",
    description="Service khusus untuk pemrosesan NLP, vector search, dan LLM",
    version="1.0.0",
)

# Mendaftarkan seluruh endpoint dengan prefix /api
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"status": "success", "message": "AI Service PepeBot RAG berhasil berjalan!"}
```

---

### Step 5 — Endpoint `/api/chat`: Session/History & Query Contextualization

#### 5.1 `ai-service/app/api/endpoints/chat.py`
* **Apa yang diubah:**
  1. Menambahkan `ChatTurn` serta field opsional `session_id` dan `history` pada `ChatRequest`.
  2. Menambahkan `_load_history_from_db()` dan `_save_history()` untuk sesi berbasis `session_id` (WhatsApp).
  3. Menambahkan `_contextualize_query()` untuk menggabungkan jawaban singkat warga (`< 30` karakter setelah giliran bot) dengan pertanyaan klarifikasi bot sebelumnya saat melakukan pencarian vektor ke `pgvector`, sementara LLM tetap menerima `payload.query` asli bersama `history`.
  4. Mengirim `catalog = get_service_catalog(db)` ketika `result.needs_clarification` aktif.
* **Kode akhir:**

```python
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.services.rag_engine import search, get_service_catalog
from app.services.llm_service import generate_answer, get_fallback_contact
from app.models.chat_history import ChatHistory
from app.core.config import settings

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


def _save_history(session_id: str, role: str, text: str, db: Session) -> None:
    """Menyimpan satu baris riwayat percakapan ke database."""
    db.add(ChatHistory(session_id=session_id, role=role, text=text))
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

    # 3. Cari dokumen SOP via pgvector
    result = search(search_query, db, top_k=payload.top_k)

    # 4. Ambil katalog layanan untuk diberikan ke LLM
    catalog = get_service_catalog(db) if result.needs_clarification else None

    # 5. Komposisi: kosongkan chunks HANYA jika hard fallback
    chunks = [] if result.fallback else result.chunks

    # 6. Minta LLM merangkai jawaban berdasarkan konteks SOP
    generated = generate_answer(
        payload.query,  # Kirim query asli ke LLM, bukan yang sudah diperkaya
        chunks,
        history=history,
        catalog=catalog,
    )

    # 7. Tentukan status fallback final
    fallback = result.fallback or generated["refused"]
    contact = get_fallback_contact() if fallback else {}

    # 8. Simpan riwayat ke database (jika ada session_id)
    if session_id:
        _save_history(session_id, "warga", payload.query, db)
        answer_text = generated["answer"] if not fallback else (
            "Maaf, informasi tersebut tidak ada di pedoman dokumen Desa Pepe."
        )
        _save_history(session_id, "bot", answer_text, db)

    return ChatResponse(
        answer=generated["answer"],
        citations=[ChatCitation(**c) for c in generated["citations"]],
        fallback=fallback,
        fallback_contact=contact if fallback else {},
    )
```

---

### Step 6 — Integrasi Kanal Web (`core-service`)

Agar fitur klarifikasi multi-turn juga bekerja di halaman Web Chat (bukan hanya WhatsApp), dilakukan penyesuaian pada dua file di `core-service` (sementara [WhatsAppController.php](file:///d:/Semester%205/Project%20Akhir/pepebot-rag/core-service/app/Http/Controllers/WhatsAppController.php#L79) tidak perlu diubah karena sudah mengirim `'session_id' => $from`):

1. **`core-service/app/Http/Controllers/WebChatController.php`**:
   - Memvalidasi field opsional `history` (`nullable|array|max:10`, dengan `role` bernilai `warga` atau `bot` dan `text` maks 2000 karakter).
   - Meneruskan `'history' => $history` pada payload `POST /api/chat` ke `ai-service`.
2. **`core-service/resources/js/Pages/Chat/Index.jsx`**:
   - Menambahkan helper `buildHistory(currentMessages)` yang mengambil maksimal 6 pesan terakhir (mengecualikan pesan sambutan awal) dan mengirimkannya sebagai `history` pada request `axios.post('/api/chat', ...)`.

---

## 3. Verifikasi & Langkah Menjalankan Ulang

### Pengecekan Sintaks yang Sudah Dilakukan
* Python `py_compile` pada `config.py`, `chat_history.py`, `rag_engine.py`, `llm_service.py`, `chat.py`, `main.py` → **lolos (`ALL_OK`)**.
* PHP `php -l` pada `WebChatController.php` → **lolos (`No syntax errors detected`)**.

### Perintah Menjalankan Ulang di Lingkungan Docker / Lokal

```bash
# 1. Build ulang dan jalankan ai-service agar tabel chat_history terbuat otomatis
docker compose up -d --build ai-service

# 2. Pastikan frontend React ter-compile (jika Vite tidak berjalan watch mode)
npm run dev
```

### Checklist Skenario Uji

| # | Input Warga | Hasil yang Diharapkan |
|---|---|---|
| 1 | `"saya ingin mengurus ktp hilang"` | Langsung menjawab syarat `KTP / Hilang`, kanal Plavon, dan catatan (`fallback: false`). |
| 2 | `"saya ingin mengurus KK baru, apa saja syarat yang diperlukan?"` | Bot bertanya balik mengerucutkan ke 4 varian `KK` (`Perubahan Biodata`, `Pecah KK`, `KK Hilang`, `Pembaruan KK`) dengan `fallback: false`. |
| 3 | *(Lanjutan #2)* `"Pecah KK"` atau `"nomor 2"` | Bot membaca riwayat + contextualize query, lalu menjawab syarat `KK / Pecah KK` (`fallback: false`). |
| 4 | `"mau pindah keluar dari desa pepe gimana caranya"` | Menjawab syarat `Pindah / Pindah Keluar` (`fallback: false`). |
| 5 | `"bisa buatkan SIM?"` | Tetap masuk fallback resmi kontak WA/URL petugas (`fallback: true`). |

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
Gunakan gaya bahasa Indonesia yang sopan namun natural dan komunikatif, layaknya staf desa yang tersenyum saat melayani warga. Jangan menggunakan bahasa kaku atau robotik (seperti "sistem kami memiliki opsi").

Konteks dokumen: {context}
Pertanyaan warga: {question}

ATURAN WAJIB:
1. Awali dengan sapaan hangat yang natural.
2. Jawab pertanyaan warga secara langsung berdasarkan konteks. Jika data membutuhkan klarifikasi (misal ada opsi Pindah Masuk dan Pindah Keluar), tanyakan dengan bahasa yang mengalir ramah.
3. KRUSIAL: Jika jawaban melibatkan pihak ketiga (Kecamatan/Dispendukcapil/Plavon), Anda WAJIB meletakkan informasi tersebut di PALING BAWAH sebagai "Catatan:" setelah pesan utama selesai.
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


def build_prompt(query: str, chunks: list[RetrievedChunk]) -> str:
    ctx = []
    for c in chunks:
        ctx.append(
            f"[SOP: {c.sop_name} | Varian: {c.varian} | versi {c.version}]\n{c.content}"
        )
    return (
        f"{SYSTEM_PROMPT}\nKONTEKS SOP:\n"
        + "\n\n---\n\n".join(ctx)
        + f"\n\nPERTANYAAN WARGA:\n{query}\n\nJAWABAN:"
    )


def _get_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY belum diisi di environment.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_answer(query: str, chunks: list[RetrievedChunk]) -> dict:
    citations = [
        {"sop_name": c.sop_name, "varian": c.varian, "version": c.version}
        for c in chunks
    ]

    # Jika chunk kosong (karena kena blokir Smart Fallback di Langkah 2)
    if not chunks:
        return {
            "answer": build_fallback_answer(),
            "citations": citations,
            "refused": True,
        }

    client = _get_client()
    resp = client.models.generate_content(
        model=LLM_MODEL, contents=build_prompt(query, chunks)
    )

    text = (resp.text or "").strip()

    # Jika AI menyerah karena tidak tahu (Aturan 4 di System Prompt)
    if REFUSAL_MARKER in text:
        return {
            "answer": build_fallback_answer(),
            "citations": citations,
            "refused": True,
        }

    return {"answer": text, "citations": citations, "refused": False}

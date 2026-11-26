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


_client = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY belum diisi di environment.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


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

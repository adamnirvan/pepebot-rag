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

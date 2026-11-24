import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function ChatIndex() {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Halo Warga! Saya PepeBot, asisten virtual Desa Pepe. Ada yang bisa saya bantu terkait layanan atau dokumen desa?'
        }
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userText = input;

        setMessages(prev => [
            ...prev,
            { sender: 'user', text: userText }
        ]);

        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: userText
            });

            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: response.data.answer,
                    isFallback: response.data.is_fallback
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: error.response?.data?.error ||
                        'Maaf, terjadi kesalahan jaringan. Silakan coba lagi.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-[#EAF2FF] px-0 py-0 sm:px-5 sm:py-5">
            <Head title="Chat PepeBot - Desa Pepe" />

            {/* Background Siluet Desa */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full">
                <svg
                    viewBox="0 0 1440 280"
                    className="block h-[150px] w-full sm:h-[190px] lg:h-[220px]"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#D6E7FC"
                        d="M0 150 C90 150 130 155 185 130 C240 95 285 105 335 125 L400 150 C470 130 520 140 580 125 L700 60 L815 120 C880 155 930 165 990 130 C1040 95 1090 100 1135 125 L1230 150 C1290 125 1340 115 1390 130 L1440 145 V280 H0Z"
                    />

                    <g fill="#BCD6F8">
                        <path d="M38 238 L44 110 L51 238Z M45 111 C15 80 20 55 32 48 C28 76 40 91 45 111Z M45 111 C35 65 49 44 64 39 C49 69 48 89 45 111Z M45 111 C65 65 84 61 94 68 C70 80 57 97 45 111Z M45 111 C79 85 101 88 109 101 C81 98 61 106 45 111Z M45 111 C76 112 98 127 106 143 C79 127 60 118 45 111Z" />

                        <path d="M295 238 L301 130 L308 238Z M301 131 C276 103 280 77 292 66 C286 94 297 112 301 131Z M301 131 C295 87 310 68 324 64 C310 91 306 111 301 131Z M301 131 C322 88 342 84 353 91 C328 103 314 119 301 131Z" />

                        <path d="M1139 238 L1145 104 L1152 238Z M1145 105 C1119 75 1124 50 1136 40 C1130 68 1140 87 1145 105Z M1145 105 C1139 63 1155 44 1169 41 C1154 68 1150 87 1145 105Z M1145 105 C1166 63 1186 59 1197 66 C1172 78 1157 94 1145 105Z" />

                        <path d="M82 198 L125 164 L168 198Z M90 198 H160 V238 H90Z" />
                        <path d="M202 206 L238 178 L275 206Z M210 206 H266 V238 H210Z" />
                        <path d="M330 202 L390 155 L446 202Z M340 202 H436 V238 H340Z" />
                        <path d="M512 198 L560 160 L608 198Z M520 198 H600 V238 H520Z" />

                        <path d="M660 208 Q660 182 694 182 Q728 182 728 208 V238 H660Z" />
                        <path d="M690 182 V168 H698 V182Z M736 238 V173 L742 161 L748 173 V238Z" />

                        <path d="M790 201 L822 170 L862 201Z M798 201 H854 V238 H798Z" />
                        <path d="M993 196 L1044 156 L1095 196Z M1000 196 H1088 V238 H1000Z" />

                        <circle cx="1110" cy="218" r="20" />
                        <circle cx="1122" cy="225" r="13" />

                        <path d="M1182 204 L1220 174 L1258 204Z M1190 204 H1250 V238 H1190Z" />
                        <path d="M1312 196 L1355 162 L1398 196Z M1320 196 H1390 V238 H1320Z" />

                        <path d="M0 238 Q180 228 360 238 T720 238 T1080 238 T1440 238 V280 H0Z" />
                    </g>
                </svg>
            </div>

            {/* Panel Chat */}
            <div className="relative z-10 flex h-full min-h-0 w-full max-w-[880px] flex-col overflow-hidden bg-[#F8FAFF] shadow-[0_15px_45px_rgba(52,87,130,0.15)] sm:h-[calc(100dvh-48px)] sm:max-h-[944px] sm:rounded-[20px]">

                {/* Header */}
                <header className="flex shrink-0 items-center justify-between bg-[#397FEA] px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            href="/"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#40546D] transition hover:bg-blue-50"
                            aria-label="Kembali ke beranda"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5" />
                                <path d="m12 19-7-7 7-7" />
                            </svg>
                        </Link>

                        {/* Logo PepeBot Header */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                            <img
                                src="/images/pepebot-mascot.png"
                                alt="PepeBot Mascot"
                                className="h-9 w-9 object-contain"
                            />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-extrabold text-white">
                                PepeBot
                            </h1>
                            <p className="truncate text-sm text-blue-100">
                                Asisten Virtual Desa Pepe
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-[#4D7958]" />
                        <span className="text-xs font-medium text-[#34445B]">
                            Online
                        </span>
                    </div>
                </header>

                {/* Area Percakapan */}
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-7">
                    <p className="mb-7 text-center text-sm font-medium text-[#647895] sm:text-base">
                        Obrolan Anda dengan Pepebot
                    </p>

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-6 flex flex-col ${
                                msg.sender === 'user'
                                    ? 'items-end'
                                    : 'items-start'
                            }`}
                        >
                            {msg.sender === 'user' ? (
                                <>
                                    <div className="mb-3 flex items-center gap-2 text-sm text-[#647895]">
                                        <span>Anda • Warga</span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EEE9]">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#40546D" strokeWidth="1.8" strokeLinecap="round">
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="max-w-[90%] rounded-[28px] rounded-tr-md bg-[#E3EFFF] px-6 py-5 text-sm leading-7 text-[#263A57] sm:max-w-[75%] sm:text-base">
                                        <p className="whitespace-pre-wrap break-words">
                                            {msg.text}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3 flex items-center gap-2">
                                        {/* Avatar PepeBot */}
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#397FEA]">
                                            <img
                                                src="/images/pepebot-mascot.png"
                                                alt="PepeBot Mascot"
                                                className="h-8 w-8 object-contain"
                                            />
                                        </div>

                                        <span className="text-sm font-bold text-[#243650]">
                                            Pepebot • Asisten AI
                                        </span>
                                    </div>

                                    <div className={`w-full rounded-[28px] border px-6 py-6 text-sm leading-8 shadow-sm sm:text-base ${
                                        msg.isFallback
                                            ? 'border-red-200 bg-red-50 text-red-900'
                                            : 'border-[#EAE4D8] bg-white text-[#263A57]'
                                    }`}>
                                        <p className="whitespace-pre-wrap break-words">
                                            {msg.text}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Indikator PepeBot Sedang Mengetik */}
                    {isLoading && (
                        <div className="mb-5 flex flex-col items-start">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#397FEA]">
                                    <img
                                        src="/images/pepebot-mascot.png"
                                        alt="PepeBot Mascot"
                                        className="h-8 w-8 object-contain"
                                    />
                                </div>

                                <span className="text-sm font-bold text-[#243650]">
                                    Pepebot • Asisten AI
                                </span>
                            </div>

                            <div className="animate-pulse rounded-[24px] bg-white px-6 py-4 text-sm text-[#8292A9] shadow-sm">
                                PepeBot sedang mengetik...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Pesan */}
                <div className="shrink-0 border-t border-[#DCE6F4] bg-white px-4 pb-5 pt-4 sm:px-6">
                    <form
                        onSubmit={sendMessage}
                        className="flex items-center gap-3"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pertanyaan Anda di sini..."
                            disabled={isLoading}
                            className="h-14 min-w-0 flex-1 rounded-full border border-[#EAE4D8] bg-[#F8FAFD] px-5 text-sm text-[#34445B] outline-none transition placeholder:text-[#8292A9] focus:border-[#397FEA] focus:ring-2 focus:ring-blue-100 sm:text-base"
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="Kirim pesan"
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#397FEA] text-white shadow-md shadow-blue-100 transition hover:bg-[#2868D0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </button>
                    </form>

                    <p className="mt-3 text-center text-sm text-[#647895]">
                        Jangan kirim NIK atau data pribadi.
                    </p>
                </div>
            </div>
        </div>
    );
}
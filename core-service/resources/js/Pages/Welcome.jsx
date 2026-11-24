import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            <Head title="PepeBot - Desa Pepe" />

            {/* Header */}
            <header className="relative z-20 flex h-[68px] shrink-0 items-center justify-between border-b border-[#EEF1F5] bg-white px-4 sm:h-[76px] sm:px-10 lg:px-16">
                <div className="flex items-center gap-3">
                        <img
                            src="/images/pepebot-mascot.png"
                            alt="PepeBot Mascot"
                            className="h-10 w-10 object-contain"
                        />

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#172B4D] sm:text-xl">
                            Pepebot
                        </h1>
                        <p className="text-xs font-medium text-[#8290A5]">
                            Desa Pepe, Sidoarjo
                        </p>
                    </div>
                </div>

                <Link
                    href="/"
                    className="text-sm font-semibold text-[#3978E8] transition hover:text-[#2750B4]"
                >
                    Beranda
                </Link>
            </header>

            {/* Hero */}
            <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-[#EAF4FF] px-5 text-center">
                <div className="relative z-10 mx-auto flex w-full max-w-4xl -translate-y-2 flex-col items-center pb-24 sm:translate-y-2 sm:pb-36">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D5E7FC] bg-white/80 px-4 py-2 text-xs font-semibold text-[#3978E8] shadow-sm sm:mb-6 sm:px-5 sm:text-sm">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                        </svg>
                        Tanyakan pada PepeBot
                    </div>

                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#172B4D] sm:text-5xl md:text-6xl">
                        Layanan Cerdas
                        <br />
                        Desa Pepe
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748B] sm:mt-6 sm:text-lg sm:leading-8">
                        Tanyakan informasi layanan, syarat administrasi, dan
                        prosedur desa kapan saja, 24/7. Didukung oleh AI untuk
                        melayani warga dengan presisi.
                    </p>

                    <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-8">
                        <Link
                            href={route('chat.index')}
                            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#3978E8] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-[#275FC7] sm:w-auto sm:max-w-none sm:px-7 sm:py-4"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                            </svg>
                            Mulai Chat Sekarang
                        </Link>

                        <a
                            href="https://wa.me/6285728054678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B8E4D0] bg-white px-4 py-2 text-[11px] font-semibold text-[#15945B] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F0FBF5] sm:px-5 sm:py-2.5 sm:text-xs"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.16 1.6 5.97L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.8a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.73.98.99-3.64-.24-.37a9.85 9.85 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.92 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                            </svg>
                            Chat Melalui WhatsApp
                        </a>
                    </div>
                </div>

                
                {/* Ilustrasi Siluet Desa */}
                <div className="pointer-events-none absolute bottom-0 left-0 w-full">
                    <svg
                        viewBox="0 0 1440 280"
                        className="block h-[90px] w-full sm:h-[190px] lg:h-[220px]"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Siluet perbukitan belakang */}
                        <path
                            fill="#D6E7FC"
                            d="M0 150
                            C90 150 130 155 185 130
                            C240 95 285 105 335 125
                            L400 150
                            C470 130 520 140 580 125
                            L700 60
                            L815 120
                            C880 155 930 165 990 130
                            C1040 95 1090 100 1135 125
                            L1230 150
                            C1290 125 1340 115 1390 130
                            L1440 145
                            V280 H0Z"
                        />

                        {/* Siluet desa: warna tunggal */}
                        <g fill="#BCD6F8">

                            {/* Pohon kelapa kiri */}
                            <path d="M38 238 L44 110 L51 238Z" />
                            <path d="M45 111 C15 80 20 55 32 48 C28 76 40 91 45 111Z" />
                            <path d="M45 111 C35 65 49 44 64 39 C49 69 48 89 45 111Z" />
                            <path d="M45 111 C65 65 84 61 94 68 C70 80 57 97 45 111Z" />
                            <path d="M45 111 C79 85 101 88 109 101 C81 98 61 106 45 111Z" />
                            <path d="M45 111 C76 112 98 127 106 143 C79 127 60 118 45 111Z" />
                            <path d="M45 111 C65 135 68 155 63 170 C57 143 50 125 45 111Z" />

                            {/* Pohon kelapa kedua */}
                            <path d="M295 238 L301 130 L308 238Z" />
                            <path d="M301 131 C276 103 280 77 292 66 C286 94 297 112 301 131Z" />
                            <path d="M301 131 C295 87 310 68 324 64 C310 91 306 111 301 131Z" />
                            <path d="M301 131 C322 88 342 84 353 91 C328 103 314 119 301 131Z" />
                            <path d="M301 131 C335 111 354 119 360 132 C334 124 315 130 301 131Z" />
                            <path d="M301 131 C329 139 344 157 345 173 C326 151 312 140 301 131Z" />

                            {/* Pohon kelapa tengah kiri */}
                            <path d="M468 238 L475 101 L482 238Z" />
                            <path d="M475 102 C449 73 454 48 466 39 C460 67 470 85 475 102Z" />
                            <path d="M475 102 C469 60 485 43 499 40 C484 66 480 85 475 102Z" />
                            <path d="M475 102 C496 60 516 57 527 64 C502 75 487 91 475 102Z" />
                            <path d="M475 102 C509 84 529 91 535 104 C509 96 489 101 475 102Z" />
                            <path d="M475 102 C505 112 520 130 519 146 C501 123 487 111 475 102Z" />

                            {/* Pohon kelapa kanan */}
                            <path d="M1139 238 L1145 104 L1152 238Z" />
                            <path d="M1145 105 C1119 75 1124 50 1136 40 C1130 68 1140 87 1145 105Z" />
                            <path d="M1145 105 C1139 63 1155 44 1169 41 C1154 68 1150 87 1145 105Z" />
                            <path d="M1145 105 C1166 63 1186 59 1197 66 C1172 78 1157 94 1145 105Z" />
                            <path d="M1145 105 C1179 87 1199 94 1205 107 C1179 99 1159 104 1145 105Z" />
                            <path d="M1145 105 C1175 115 1190 133 1189 149 C1171 126 1157 114 1145 105Z" />

                            {/* Pohon kelapa paling kanan */}
                            <path d="M1407 238 L1413 125 L1420 238Z" />
                            <path d="M1413 126 C1387 96 1392 71 1404 61 C1398 89 1408 108 1413 126Z" />
                            <path d="M1413 126 C1407 84 1423 65 1437 62 C1422 89 1418 108 1413 126Z" />
                            <path d="M1413 126 C1434 84 1454 80 1465 87 C1440 99 1425 115 1413 126Z" />

                            {/* Rumah kiri */}
                            <path d="M82 198 L125 164 L168 198Z" />
                            <path d="M90 198 H160 V238 H90Z" />

                            {/* Rumah kedua kiri */}
                            <path d="M202 206 L238 178 L275 206Z" />
                            <path d="M210 206 H266 V238 H210Z" />

                            {/* Rumah tengah kiri */}
                            <path d="M330 202 L390 155 L446 202Z" />
                            <path d="M340 202 H436 V238 H340Z" />

                            {/* Rumah kecil tengah */}
                            <path d="M512 198 L560 160 L608 198Z" />
                            <path d="M520 198 H600 V238 H520Z" />

                            {/* Masjid */}
                            <path d="M660 208 Q660 182 694 182 Q728 182 728 208 V238 H660Z" />
                            <path d="M690 182 V168 H698 V182Z" />
                            <path d="M736 238 V173 L742 161 L748 173 V238Z" />
                            <circle cx="744" cy="226" r="14" />

                            {/* Rumah tengah kanan */}
                            <path d="M790 201 L822 170 L862 201Z" />
                            <path d="M798 201 H854 V238 H798Z" />

                            {/* Rumah kanan */}
                            <path d="M993 196 L1044 156 L1095 196Z" />
                            <path d="M1000 196 H1088 V238 H1000Z" />

                            {/* Pohon kecil kanan */}
                            <circle cx="1110" cy="218" r="20" />
                            <circle cx="1122" cy="225" r="13" />

                            {/* Rumah paling kanan */}
                            <path d="M1182 204 L1220 174 L1258 204Z" />
                            <path d="M1190 204 H1250 V238 H1190Z" />
                            <circle cx="1270" cy="224" r="17" />

                            {/* Rumah ujung kanan */}
                            <path d="M1312 196 L1355 162 L1398 196Z" />
                            <path d="M1320 196 H1390 V238 H1320Z" />

                            {/* Tanah bagian bawah */}
                            <path d="M0 238 Q180 228 360 238 T720 238 T1080 238 T1440 238 V280 H0Z" />
                        </g>
                    </svg>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-20 flex min-h-[52px] shrink-0 flex-col items-center justify-center gap-1 border-t border-[#EEF1F5] bg-white px-3 py-2 sm:min-h-[56px] sm:flex-row sm:justify-between sm:gap-2 sm:px-10 lg:px-16">
                <p className="text-xs font-medium text-[#8290A5] sm:text-sm">
                    Pepebot <span className="mx-1">•</span> Asisten AI warga Desa Pepe
                </p>

                <Link
                    href={route('login')}
                    className="text-xs font-semibold text-[#8290A5] transition hover:text-[#3978E8] sm:text-sm"
                >
                    Login sebagai Admin
                </Link>
            </footer>
        </div>
    );
}
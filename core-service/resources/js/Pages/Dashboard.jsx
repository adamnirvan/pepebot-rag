import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

function formatDate(date) {
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

function CopyIcon() {
    return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="13" height="13" rx="2" />
            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
            <path d="M4 5.5v16M8 7h8M8 11h8" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function StatCard({ title, value, description, icon }) {
    return (
        <div className="rounded-2xl border border-[#D8DBE2] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-[#64708A]">{title}</p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2750B4]">
                    {icon}
                </div>
            </div>

            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[#1B2434]">
                {value}
            </h2>

            <p className="mt-2 text-xs text-[#64708A]">
                {description}
            </p>
        </div>
    );
}

export default function Dashboard({ stats = {}, recentSop = [] }) {
    const totalSop = stats.totalSop ?? 0;
    const totalVarian = stats.totalVarian ?? 0;

    return (
        <AdminLayout>
            <Head title="Dasbor Ringkasan" />

            <div className="mx-auto max-w-[1400px] space-y-6">

                {/* Page Heading */}
                <section>
                    <p className="text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                        PENGELOLAAN PEPEBOT
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1B2434] sm:text-[30px]">
                        Dasbor Ringkasan
                    </h1>

                    <p className="mt-2 text-sm text-[#64708A]">
                        Selamat datang, Admin Desa. Ringkasan dokumen SOP dan layanan desa.
                    </p>
                </section>

                {/* Statistics */}
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <StatCard
                        title="Total SOP"
                        value={totalSop}
                        description="Jumlah dokumen SOP terdaftar"
                        icon={<CopyIcon />}
                    />

                    <StatCard
                        title="Total Varian"
                        value={totalVarian}
                        description="Jumlah seluruh varian SOP"
                        icon={<BookIcon />}
                    />
                </section>

                {/* Dashboard Content */}
                <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.8fr_0.95fr]">

                    {/* Recent SOP */}
                    <div className="rounded-2xl border border-[#D8DBE2] bg-white p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-[#1B2434]">
                                    Ringkasan SOP
                                </h2>

                                <p className="mt-1 text-xs text-[#64708A]">
                                    Lima SOP terbaru yang diperbarui
                                </p>
                            </div>

                            <Link
                                href={route('knowledge.index')}
                                className="shrink-0 text-xs font-medium text-[#2750B4] transition hover:text-[#1D3D8A]"
                            >
                                Lihat semua →
                            </Link>
                        </div>

                        <div className="mt-5 space-y-5">
                            {recentSop.length > 0 ? (
                                recentSop.map((sop) => (
                                    <div
                                        key={sop.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2750B4]">
                                            <CopyIcon />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-medium text-[#1B2434]">
                                                {sop.sop_name}
                                            </h3>

                                            <p className="mt-1 text-xs text-[#64708A]">
                                                Varian: {sop.varian} · Versi {sop.version} · {formatDate(sop.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-6 text-center text-sm text-[#64708A]">
                                    Belum ada dokumen SOP.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Database Summary */}
                    <div className="rounded-2xl border border-[#D8DBE2] bg-white p-5 sm:p-6">
                        <h2 className="text-base font-semibold text-[#1B2434]">
                            Ringkasan Data SOP
                        </h2>

                        <p className="mt-1 text-xs text-[#64708A]">
                            Informasi dokumen dalam database
                        </p>

                        <div className="mt-5 space-y-5">
                            <div>
                                <p className="text-xs text-[#64708A]">
                                    Total dokumen SOP
                                </p>
                                <p className="mt-1 text-lg font-semibold text-[#1B2434]">
                                    {totalSop} SOP
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#64708A]">
                                    Total varian dokumen
                                </p>
                                <p className="mt-1 text-lg font-semibold text-[#1B2434]">
                                    {totalVarian} varian
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#64708A]">
                                    Pembaruan terakhir
                                </p>
                                <p className="mt-1 text-lg font-semibold text-[#1B2434]">
                                    {formatDate(stats.lastUpdated)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="flex items-center gap-2 pt-1 text-xs text-[#64708A]">
                    <ShieldIcon />
                    <span>Ruang kerja internal perangkat Desa Pepe</span>
                </footer>

            </div>
        </AdminLayout>
    );
}

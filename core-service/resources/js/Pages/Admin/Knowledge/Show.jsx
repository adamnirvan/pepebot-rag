import React, { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function KnowledgeShow({ document }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const content = document.content || '';

    // Membaca bagian-bagian panduan tanpa mengubah isi database.
    const parsedContent = useMemo(() => {
        const syaratMatch = content.match(
            /Syarat:\s*([\s\S]*?)(?=\nKanal:|\nCatatan:|$)/i,
        );
        const kanalMatch = content.match(/Kanal:\s*(.*)/i);
        const catatanMatch = content.match(/Catatan:\s*([\s\S]*)$/i);

        const syarat = syaratMatch
            ? syaratMatch[1]
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => item.replace(/^-\s*/, ''))
            : [];

        return {
            hasStructuredContent: Boolean(syaratMatch),
            syarat,
            kanal: kanalMatch ? kanalMatch[1].trim() : '',
            catatan: catatanMatch ? catatanMatch[1].trim() : '',
        };
    }, [content]);

    const updatedDate = document.updated_at
        ? new Date(document.updated_at).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '-';

    const handleDelete = () => {
        setDeleting(true);

        router.delete(route('knowledge.destroy', document.id), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Detail - ${document.sop_name}`} />

            <div className="mx-auto max-w-7xl space-y-7">
                {/* Judul halaman */}
                <div>
                    <p className="mb-2 text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                        PENGELOLAAN PEPEBOT
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-[#1B2434] sm:text-[30px]">
                        {document.sop_name}
                    </h1>

                    <p className="mt-2 text-sm text-[#64708A]">
                        Detail aturan layanan yang dipakai Pepebot untuk
                        menjawab pertanyaan warga.
                    </p>

                    <p className="mt-2 text-xs text-[#64708A]">
                        Varian kondisi: <span className="font-semibold text-[#1B2434]">{document.varian}</span>
                    </p>
                </div>

                {/* Konten detail */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
                    {/* Syarat dan ketentuan */}
                    <section className="rounded-2xl border border-[#DDE4F0] bg-white p-6 sm:p-7">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-base font-bold text-[#1B2434]">
                                Syarat &amp; Ketentuan
                            </h2>

                            <span className="shrink-0 rounded-full bg-[#EAF0FF] px-3 py-1.5 text-xs font-medium text-[#2750B4]">
                                Versi {document.version}
                            </span>
                        </div>

                        {parsedContent.hasStructuredContent ? (
                            <div className="space-y-4">
                                {parsedContent.syarat.length > 0 ? (
                                    parsedContent.syarat.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 rounded-xl bg-[#F4F7FB] px-4 py-4"
                                        >
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5EDFF] text-xs font-semibold text-[#2750B4]">
                                                {index + 1}
                                            </span>

                                            <p className="pt-1 text-sm leading-relaxed text-[#1B2434]">
                                                {item}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-[#64708A]">
                                        Tidak ada persyaratan yang tercatat.
                                    </p>
                                )}

                                {parsedContent.catatan && (
                                    <div className="flex items-start gap-3 rounded-xl bg-[#EAF0FF] px-4 py-4">
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#2750B4] text-xs font-bold text-[#2750B4]">
                                            !
                                        </span>

                                        <p className="text-sm leading-relaxed text-[#2750B4]">
                                            {parsedContent.catatan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-[#F4F7FB] p-5">
                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#1B2434]">
                                    {content || 'Konten SOP belum tersedia.'}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Informasi dokumen */}
                    <section className="rounded-2xl border border-[#DDE4F0] bg-white p-6">
                        <h2 className="mb-6 text-base font-bold text-[#1B2434]">
                            Informasi Dokumen
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-[#64708A]">Kategori</p>
                                <p className="mt-1 text-sm font-medium text-[#1B2434]">
                                    {document.sop_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#64708A]">Varian</p>
                                <p className="mt-1 text-sm font-medium text-[#1B2434]">
                                    {document.varian}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#64708A]">Versi dokumen</p>
                                <p className="mt-1 text-sm font-medium text-[#1B2434]">
                                    Versi {document.version}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#64708A]">Terakhir diperbarui</p>
                                <p className="mt-1 text-sm font-medium text-[#1B2434]">
                                    {updatedDate}
                                </p>
                            </div>

                            {parsedContent.kanal && (
                                <div>
                                    <p className="text-xs text-[#64708A]">Tautan rujukan</p>
                                    <a
                                        href={parsedContent.kanal}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block break-all text-sm font-medium text-[#2750B4] hover:underline"
                                    >
                                        {parsedContent.kanal}
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Tombol aksi */}
                <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
                    <Link
                        href={route('knowledge.index')}
                        className="inline-flex items-center justify-center rounded-xl border border-[#DDE4F0] bg-white px-5 py-3 text-sm font-semibold text-[#1B2434] transition hover:bg-[#F4F7FB]"
                    >
                        ← Kembali ke Daftar
                    </Link>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="rounded-xl border border-[#F0C5C0] bg-white px-5 py-3 text-sm font-semibold text-[#B9443A] transition hover:bg-[#FFF4F2]"
                        >
                            Hapus Dokumen
                        </button>

                        <Link
                            href={route('knowledge.edit', document.id)}
                            className="rounded-xl bg-[#2750B4] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1D3D8A]"
                        >
                            Edit Syarat &amp; Ketentuan
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal konfirmasi hapus */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/45 px-4 py-6"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !deleting) {
                            setShowDeleteModal(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-title"
                        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
                    >
                        <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-full bg-[#FFF0EE] text-[#B9443A]">
                            <svg
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6" />
                            </svg>
                        </div>

                        <h2
                            id="delete-title"
                            className="text-lg font-bold text-[#1B2434]"
                        >
                            Hapus {document.sop_name}?
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-[#64708A]">
                            Varian {document.varian} akan dihapus dari
                            pengetahuan Pepebot dan tidak lagi digunakan
                            untuk menjawab warga.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-xl border border-[#DDE4F0] px-5 py-3 text-sm font-semibold text-[#1B2434] transition hover:bg-[#F4F7FB] disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="rounded-xl bg-[#B9443A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A5362E] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

import React, { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function KnowledgeIndex({ groupedDocuments }) {
    const { props } = usePage();
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const documents = useMemo(() => {
        if (!groupedDocuments) return [];

        return Object.entries(groupedDocuments).flatMap(
            ([sopName, variants]) =>
                variants.map((doc) => ({
                    ...doc,
                    sopName,
                })),
        );
    }, [groupedDocuments]);

    const filteredDocuments = documents.filter((doc) => {
        const keyword = search.toLowerCase();

        return (
            doc.sopName.toLowerCase().includes(keyword) ||
            (doc.varian || '').toLowerCase().includes(keyword)
        );
    });

    const handleDelete = () => {
        if (!deleteTarget) return;

        setDeleting(true);

        router.delete(route('knowledge.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen SOP" />

            <div className="mx-auto max-w-7xl space-y-7">
                {/* Page Heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                            PENGELOLAAN PEPEBOT
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight text-[#1B2434] sm:text-[30px]">
                            Manajemen Dokumen Desa
                        </h1>

                        <p className="mt-2 text-sm text-[#64708A]">
                            Kelola SOP dan Peraturan Desa sebagai sumber
                            jawaban Pepebot.
                        </p>
                    </div>

                    <Link
                        href={route('knowledge.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2750B4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D3D8A]"
                    >
                        <span className="text-lg">+</span>
                        Tambah SOP
                    </Link>
                </div>

                {/* Flash Message */}
                {props.flash?.status && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700">
                        {props.flash.status}
                    </div>
                )}

                {/* Search */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#D8DBE2] bg-white px-4 py-3">
                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#64708A"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama dokumen..."
                            className="w-full border-0 bg-transparent p-0 text-sm text-[#1B2434] placeholder:text-[#A0A8B8] focus:ring-0"
                        />
                    </div>
                </div>

                {/* Document Table */}
                <div className="overflow-hidden rounded-2xl border border-[#D8DBE2] bg-white">
                    <div className="flex flex-col justify-between gap-2 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                        <h2 className="text-base font-bold text-[#1B2434]">
                            Daftar dokumen
                        </h2>

                        <p className="text-xs text-[#64708A]">
                            {filteredDocuments.length} dokumen
                        </p>
                    </div>

                    {/* Table Header */}
                    <div className="hidden grid-cols-[minmax(0,1fr)_160px_190px] bg-[#F4F7FB] px-6 py-4 text-xs font-medium text-[#64708A] md:grid">
                        <span>Nama Dokumen</span>
                        <span>Tanggal</span>
                        <span>Aksi</span>
                    </div>

                    {/* Table Content */}
                    {filteredDocuments.length > 0 ? (
                        <div>
                            {filteredDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="grid grid-cols-1 gap-4 border-t border-[#E5E9F0] px-5 py-5 transition hover:bg-[#FAFBFE] md:grid-cols-[minmax(0,1fr)_160px_190px] md:items-center md:px-6"
                                >
                                    {/* Document Name */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2750B4]">
                                            <svg
                                                width="21"
                                                height="21"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <path d="M14 2v6h6M8 13h8M8 17h8" />
                                            </svg>
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-[#1B2434]">
                                                {doc.sopName}
                                            </h3>

                                            <p className="mt-1 text-xs text-[#64708A]">
                                                {doc.varian} • Versi {doc.version}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Updated Date */}
                                    <div>
                                        <p className="text-sm text-[#1B2434]">
                                            {doc.updated_at
                                                ? new Date(
                                                      doc.updated_at,
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </p>

                                        <p className="mt-1 text-xs text-[#64708A]">
                                            Terakhir diperbarui
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={route('knowledge.show', doc.id)}
                                            className="rounded-xl border border-[#D8DBE2] px-4 py-2.5 text-sm font-semibold text-[#1B2434] transition hover:bg-[#F4F7FB]"
                                        >
                                            Lihat
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(doc)}
                                            className="rounded-xl border border-[#F0C5C0] px-4 py-2.5 text-sm font-semibold text-[#B9443A] transition hover:bg-[#FFF4F2]"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-14 text-center">
                            <p className="text-sm font-medium text-[#1B2434]">
                                {search
                                    ? 'Dokumen tidak ditemukan.'
                                    : 'Belum ada dokumen yang terdaftar.'}
                            </p>

                            <p className="mt-2 text-xs text-[#64708A]">
                                {search
                                    ? 'Coba gunakan kata kunci lainnya.'
                                    : 'Dokumen SOP yang ditambahkan akan muncul di sini.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            
            {/* Modal Konfirmasi Hapus */}
            {deleteTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/45 px-4 py-6 backdrop-blur-[2px]"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !deleting
                        ) {
                            setDeleteTarget(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-document-title"
                        className="w-full max-w-[440px] rounded-2xl border border-[#EEF0F4] bg-white p-7 shadow-[0_20px_60px_rgba(23,32,51,0.18)] sm:p-8"
                    >
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#FFF0EE] text-[#B9443A]">
                                <svg
                                    width="24"
                                    height="24"
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
                        </div>

                        {/* Title */}
                        <div className="mt-5 text-center">
                            <h2
                                id="delete-document-title"
                                className="text-lg font-bold tracking-tight text-[#1B2434]"
                            >
                                Hapus {deleteTarget.sopName}?
                            </h2>

                            <p className="mx-auto mt-2 max-w-[340px] text-sm leading-6 text-[#64708A]">
                                Varian {deleteTarget.varian} akan dihapus dari
                                pengetahuan Pepebot dan tidak lagi digunakan
                                untuk menjawab warga.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-7 flex items-center justify-end gap-3 border-t border-[#EEF0F4] pt-5">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteTarget(null)}
                                className="inline-flex h-11 min-w-[104px] items-center justify-center rounded-xl border border-[#DDE4F0] bg-white px-5 text-sm font-semibold text-[#1B2434] transition hover:bg-[#F4F7FB] disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="inline-flex h-11 min-w-[112px] items-center justify-center rounded-xl bg-[#B9443A] px-5 text-sm font-semibold text-white transition hover:bg-[#A5362E] disabled:cursor-not-allowed disabled:opacity-60"
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

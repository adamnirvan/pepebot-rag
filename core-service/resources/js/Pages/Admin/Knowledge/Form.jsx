import React, { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function KnowledgeForm({ document }) {
    const isEdit = !!document;
    const { props } = usePage();

    // Membaca data syarat, catatan, dan URL dari content
    const parsedData = useMemo(() => {
        let syarat = [];
        let note = '';
        let channel_url = '';

        if (document?.content) {
            const lines = document.content.split('\n');
            let currentSection = null;

            lines.forEach((line) => {
                const text = line.trim();

                if (text.startsWith('Syarat:')) {
                    currentSection = 'syarat';

                    const value = text.replace('Syarat:', '').trim();
                    if (value) syarat.push(value);
                    return;
                }

                if (text.startsWith('Catatan:')) {
                    currentSection = 'note';

                    const value = text.replace('Catatan:', '').trim();
                    if (value) {
                        note = value;
                    }
                    return;
                }

                if (
                    text.startsWith('URL Rujukan:') ||
                    text.startsWith('Kanal:')
                ) {
                    currentSection = null;
                    channel_url = text
                        .replace(/^(URL Rujukan:|Kanal:)/, '')
                        .trim();
                    return;
                }

                if (currentSection === 'syarat' && text.startsWith('-')) {
                    syarat.push(text.substring(1).trim());
                    return;
                }

                if (currentSection === 'note' && text) {
                    note += (note ? '\n' : '') + text;
                }
            });
        }

        return {
            syarat: syarat.length > 0 ? syarat : [''],
            note,
            channel_url,
        };
    }, [document]);

    // State formulir
    const { data, setData, post, errors, processing, isDirty } = useForm({
        sop_name: document ? document.sop_name : '',
        varian: document ? document.varian : '',
        syarat: parsedData.syarat,
        channel_url: parsedData.channel_url,
        note: parsedData.note,
    });

    // Menambah syarat
    function addSyarat() {
        setData('syarat', [...data.syarat, '']);
    }

    // Mengubah syarat
    function handleSyaratChange(index, value) {
        const updated = [...data.syarat];
        updated[index] = value;
        setData('syarat', updated);
    }

    // Menghapus syarat
    function removeSyarat(index) {
        if (data.syarat.length > 1) {
            setData(
                'syarat',
                data.syarat.filter((_, i) => i !== index),
            );
        }
    }

    // Submit formulir
    function submit(e) {
        e.preventDefault();
        post(route('knowledge.store'));
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit SOP' : 'Tambah SOP'} />

            <div className="mx-auto max-w-7xl space-y-7">

                {/* Page Heading */}
                <div>
                    <p className="mb-2 text-[10px] font-medium tracking-[1.5px] text-[#88867F]">
                        PENGELOLAAN PEPEBOT
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-[#37352D] sm:text-[30px]">
                        {isEdit ? 'Edit Dokumen Desa' : 'Tambah Dokumen Desa'}
                    </h1>

                    <p className="mt-2 text-sm text-[#88867F]">
                        Tambah SOP dan Peraturan Desa sebagai sumber jawaban Pepebot.
                    </p>
                </div>

                {/* Error dari AI Service */}
                {props.errors.ai_error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                        {props.errors.ai_error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit}>
                    <div className="rounded-2xl border border-[#E1E2E3] bg-white px-8 py-8">

                        {/* Card Header */}
                        <div className="mb-6">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F5F6] text-[#514C40]">
                                <svg
                                    width="22"
                                    height="22"
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

                            <h2 className="text-base font-bold text-[#37352D]">
                                Isi Formulir Dokumen
                            </h2>

                            <p className="mt-1 text-xs text-[#88867F]">
                                Isi judul, kategori, dan isi dokumen untuk ditinjau sebelum disimpan.
                            </p>

                            <p className="text-xs text-[#88867F]">
                                Pastikan judul, kategori, dan isi dokumen sudah sesuai.
                            </p>
                        </div>

                        {/* Nama SOP dan Kondisi Khusus */}
                        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="sop_name"
                                    className="mb-2 block text-xs font-medium text-[#37352D]"
                                >
                                    Nama Layanan / SOP
                                </label>

                                <input
                                    id="sop_name"
                                    type="text"
                                    value={data.sop_name}
                                    onChange={(e) => setData('sop_name', e.target.value)}
                                    placeholder="Contoh: Panduan KK"
                                    required
                                    readOnly={isEdit}
                                    className="w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#37352D] placeholder:text-[#A5A39D] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4] read-only:bg-[#F5F6F7]"
                                />

                                <InputError message={errors.sop_name} className="mt-2" />
                            </div>

                            <div>
                                <label
                                    htmlFor="varian"
                                    className="mb-2 block text-xs font-medium text-[#37352D]"
                                >
                                    Kondisi Khusus
                                </label>

                                <input
                                    id="varian"
                                    type="text"
                                    value={data.varian}
                                    onChange={(e) => setData('varian', e.target.value)}
                                    placeholder="Contoh: Pindah KK"
                                    required
                                    readOnly={isEdit}
                                    className="w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#37352D] placeholder:text-[#A5A39D] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4] read-only:bg-[#F5F6F7]"
                                />

                                <InputError message={errors.varian} className="mt-2" />
                            </div>
                        </div>

                        {/* Daftar Syarat */}
                        <div>
                            <label className="mb-3 block text-xs font-medium text-[#37352D]">
                                Daftar Syarat &amp; Ketentuan
                            </label>

                            <div className="space-y-3">
                                {data.syarat.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                                handleSyaratChange(index, e.target.value)
                                            }
                                            placeholder={'Syarat ' + (index + 1)}
                                            required
                                            className="w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#37352D] placeholder:text-[#A5A39D] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeSyarat(index)}
                                            disabled={data.syarat.length === 1}
                                            title="Hapus syarat"
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E1E2E3] text-[#88867F] transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            >
                                                <path d="M18 6 6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addSyarat}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E1E2E3] px-4 py-2.5 text-sm font-medium text-[#514C40] transition hover:bg-[#F5F6F7]"
                            >
                                <span>+</span>
                                Tambah Syarat
                            </button>
                        </div>

                        {/* URL Rujukan */}
                        <div className="mt-7">
                            <label
                                htmlFor="channel_url"
                                className="mb-2 block text-xs font-medium text-[#37352D]"
                            >
                                URL Rujukan
                                <span className="ml-1 font-normal text-[#A5A39D]">
                                    (Opsional)
                                </span>
                            </label>

                            <input
                                id="channel_url"
                                type="text"
                                value={data.channel_url}
                                onChange={(e) =>
                                    setData('channel_url', e.target.value)
                                }
                                placeholder="Masukkan URL atau kanal rujukan dokumen"
                                className="w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#37352D] placeholder:text-[#A5A39D] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4]"
                            />

                            <InputError
                                message={errors.channel_url}
                                className="mt-2"
                            />
                        </div>

                        {/* Catatan */}
                        <div className="mt-5">
                            <label
                                htmlFor="note"
                                className="mb-2 block text-xs font-medium text-[#37352D]"
                            >
                                Catatan
                                <span className="ml-1 font-normal text-[#A5A39D]">
                                    (Opsional)
                                </span>
                            </label>

                            <textarea
                                id="note"
                                rows={4}
                                value={data.note}
                                onChange={(e) =>
                                    setData('note', e.target.value)
                                }
                                placeholder="Tambahkan catatan atau informasi khusus terkait SOP..."
                                className="w-full resize-y rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#37352D] placeholder:text-[#A5A39D] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4]"
                            />

                            <InputError
                                message={errors.note}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing || (isEdit && !isDirty)}
                            className="inline-flex items-center justify-center rounded-xl bg-[#2750B4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D3D8A] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {processing 
                                ? 'Menyimpan & Embedding...' 
                                : isEdit
                                    ? isDirty
                                        ? 'Simpan Perubahan'
                                        : 'Tidak Ada Perubahan'
                                    : 'Simpan SOP'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center gap-2 text-[11px] text-[#A5A39D]">
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                    Ruang kerja internal perangkat: Desa Pepe
                </div>
            </div>
        </AdminLayout>
    );
}

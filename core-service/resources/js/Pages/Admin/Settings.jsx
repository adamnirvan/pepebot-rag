import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';

export default function Settings({ setting }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        petugas_wa: setting.petugas_wa || '',
        website_url: setting.website_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Fallback" />

            <div className="mx-auto max-w-7xl space-y-7">

                {/* Page Heading */}
                <div>
                    <p className="mb-2 text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                        PENGELOLAAN PEPEBOT
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-[#1B2434]">
                        Pengaturan Fallback
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#64708A]">
                        Kelola informasi kontak petugas dan website desa
                        yang digunakan PepeBot ketika jawaban tidak ditemukan.
                    </p>
                </div>

                {/* Information Card */}
                <div className="flex gap-4 rounded-2xl border border-[#D8DBE2] bg-[#EAF0FF] p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2750B4]">
                        <svg width="22" height="22" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 11v5M12 8h.01" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[#1B2434]">
                            Informasi Fallback PepeBot
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#64708A]">
                            Ketika AI tidak menemukan jawaban yang sesuai
                            dengan pedoman SOP, informasi kontak ini akan
                            digunakan untuk membantu masyarakat menghubungi
                            petugas desa.
                        </p>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="overflow-hidden rounded-2xl border border-[#D8DBE2] bg-white shadow-sm">
                    <div className="border-b border-[#D8DBE2] px-6 py-5 sm:px-8">
                        <h2 className="text-base font-semibold text-[#1B2434]">
                            Kontak Petugas Desa
                        </h2>
                        <p className="mt-1 text-sm text-[#64708A]">
                            Pastikan informasi yang dimasukkan masih aktif.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-7 px-6 py-7 sm:px-8">

                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="petugas_wa"
                                className="mb-2 block text-sm font-semibold text-[#1B2434]">
                                Nomor WhatsApp Petugas
                            </label>

                            <div className="flex items-center overflow-hidden rounded-xl border border-[#D8DBE2] focus-within:border-[#2750B4] focus-within:ring-2 focus-within:ring-[#2750B4]/10">
                                <span className="flex h-12 items-center border-r border-[#D8DBE2] bg-[#F4F7FB] px-4 text-sm font-medium text-[#64708A]">
                                    WA
                                </span>
                                <input
                                    id="petugas_wa"
                                    type="text"
                                    value={data.petugas_wa}
                                    onChange={(e) => setData('petugas_wa', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    className="h-12 w-full border-0 bg-white px-4 text-sm text-[#1B2434] outline-none focus:ring-0"
                                />
                            </div>

                            <p className="mt-2 text-xs text-[#64708A]">
                                Masukkan nomor WhatsApp resmi petugas desa.
                            </p>
                            <InputError message={errors.petugas_wa} className="mt-2" />
                        </div>

                        {/* Website */}
                        <div>
                            <label htmlFor="website_url"
                                className="mb-2 block text-sm font-semibold text-[#1B2434]">
                                URL Website Desa
                            </label>

                            <input
                                id="website_url"
                                type="url"
                                value={data.website_url}
                                onChange={(e) => setData('website_url', e.target.value)}
                                placeholder="https://pepe.desa.id"
                                className="h-12 w-full rounded-xl border border-[#D8DBE2] bg-white px-4 text-sm text-[#1B2434] outline-none transition focus:border-[#2750B4] focus:ring-2 focus:ring-[#2750B4]/10"
                            />

                            <p className="mt-2 text-xs text-[#64708A]">
                                Masukkan alamat website resmi desa yang dapat diakses masyarakat.
                            </p>
                            <InputError message={errors.website_url} className="mt-2" />
                        </div>

                        {/* Footer */}
                        <div className="flex flex-wrap items-center gap-4 border-t border-[#D8DBE2] pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#2750B4] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D3D8A] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium text-green-600">
                                    Pengaturan berhasil disimpan.
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* Bottom Note */}
                <p className="text-xs leading-5 text-[#64708A]">
                    Perubahan pengaturan akan digunakan oleh sistem PepeBot
                    setelah berhasil disimpan.
                </p>
            </div>
        </AdminLayout>
    );
}

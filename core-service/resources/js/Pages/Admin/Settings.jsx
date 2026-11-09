import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

export default function Settings({ auth, setting, status }) {
    // Inisialisasi state form dengan data dari PostgreSQL
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        petugas_wa: setting.petugas_wa || '',
        website_url: setting.website_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.update')); // Memanggil fungsi update di SettingController
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Desa</h2>}
        >
            <Head title="Pengaturan Desa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Kontak Fallback (PepeBot)</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Perbarui nomor WhatsApp petugas dan URL website desa. Informasi ini akan diberikan oleh AI ketika jawaban tidak ditemukan di pedoman.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="petugas_wa" value="Nomor WhatsApp Petugas" />
                                    <TextInput
                                        id="petugas_wa"
                                        value={data.petugas_wa}
                                        onChange={(e) => setData('petugas_wa', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: 081234567890"
                                    />
                                    <InputError message={errors.petugas_wa} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="website_url" value="URL Website Desa" />
                                    <TextInput
                                        id="website_url"
                                        value={data.website_url}
                                        onChange={(e) => setData('website_url', e.target.value)}
                                        type="url"
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: https://pepe.desa.id"
                                    />
                                    <InputError message={errors.website_url} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Simpan Pengaturan</PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">Berhasil disimpan.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
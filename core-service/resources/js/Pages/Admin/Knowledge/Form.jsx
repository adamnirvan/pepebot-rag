import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function KnowledgeForm({ auth, document }) {
    const isEdit = !!document;
    const { props } = usePage();

    // Fungsi untuk mengekstrak data dari teks "content" buatan FastAPI
    const parsedData = useMemo(() => {
        let syarat = [];
        let note = '';
        let channel_url = '';

        if (document?.content) {
            const lines = document.content.split('\n');
            let isParsingSyarat = false;

            lines.forEach(line => {
                const text = line.trim();
                if (text.startsWith('Syarat:')) { isParsingSyarat = true; return; }
                if (text.startsWith('Catatan:')) { isParsingSyarat = false; note = text.replace('Catatan:', '').trim(); return; }
                if (text.startsWith('URL Rujukan:')) { isParsingSyarat = false; channel_url = text.replace('URL Rujukan:', '').trim(); return; }
                
                if (isParsingSyarat && text.startsWith('-')) {
                    syarat.push(text.substring(1).trim());
                }
            });
        }
        return {
            syarat: syarat.length > 0 ? syarat : [''],
            note,
            channel_url
        };
    }, [document]);

    const { data, setData, post, errors, processing } = useForm({
        sop_name: document?.sop_name || '',
        varian: document?.varian || '',
        syarat: parsedData.syarat, 
        channel_url: parsedData.channel_url,
        note: parsedData.note
    });

    const addSyarat = () => setData('syarat', [...data.syarat, '']);

    const handleSyaratChange = (index, value) => {
        const newSyarat = [...data.syarat];
        newSyarat[index] = value;
        setData('syarat', newSyarat);
    };

    const removeSyarat = (index) => {
        if (data.syarat.length > 1) {
            setData('syarat', data.syarat.filter((_, i) => i !== index));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('knowledge.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex gap-4 items-center">
                    <Link href={route('knowledge.index')} className="text-gray-500 hover:text-gray-700">
                        &larr; Kembali
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isEdit ? 'Edit Aturan SOP' : 'Tambah Aturan SOP Baru'}
                    </h2>
                </div>
            }
        >
            <Head title={isEdit ? 'Edit SOP' : 'Tambah SOP'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {props.errors.ai_error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {props.errors.ai_error}
                        </div>
                    )}

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="sop_name" value="Kategori Layanan (SOP Name)" />
                                    <TextInput id="sop_name" value={data.sop_name} onChange={(e) => setData('sop_name', e.target.value)} type="text" className="mt-1 block w-full bg-gray-50" placeholder="Contoh: Pembuatan KTP" required readOnly={isEdit} />
                                    <InputError message={errors.sop_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="varian" value="Kondisi Khusus (Varian)" />
                                    <TextInput id="varian" value={data.varian} onChange={(e) => setData('varian', e.target.value)} type="text" className="mt-1 block w-full bg-gray-50" placeholder="Contoh: Hilang" required readOnly={isEdit} />
                                    <InputError message={errors.varian} className="mt-2" />
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                                <InputLabel value="Daftar Syarat & Ketentuan" />
                                <div className="mt-2 space-y-3">
                                    {data.syarat.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <TextInput 
                                                value={item} 
                                                onChange={(e) => handleSyaratChange(index, e.target.value)} 
                                                type="text" 
                                                className="block w-full" 
                                                placeholder={`Syarat ${index + 1}...`} 
                                                required 
                                            />
                                            <button type="button" onClick={() => removeSyarat(index)} className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md font-bold" disabled={data.syarat.length === 1}>
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addSyarat} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    + Tambah Syarat Lainnya
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="channel_url" value="URL Rujukan (Opsional)" />
                                    <TextInput id="channel_url" value={data.channel_url} onChange={(e) => setData('channel_url', e.target.value)} type="text" className="mt-1 block w-full" placeholder="https://..." />
                                </div>
                                <div>
                                    <InputLabel htmlFor="note" value="Catatan Tambahan (Opsional)" />
                                    <TextInput id="note" value={data.note} onChange={(e) => setData('note', e.target.value)} type="text" className="mt-1 block w-full" placeholder="Contoh: Proses 3 hari kerja" />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <PrimaryButton disabled={processing} className="w-full justify-center">
                                    {processing ? 'Menyimpan & Embedding...' : 'Simpan Aturan ke AI'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function KnowledgeShow({ auth, document }) {
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus SOP ini? Tindakan ini tidak bisa dibatalkan dan AI tidak akan mengenali aturan ini lagi.')) {
            router.delete(route('knowledge.destroy', document.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex gap-4 items-center">
                    <Link href={route('knowledge.index')} className="text-gray-500 hover:text-gray-700">
                        &larr; Kembali
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Aturan Layanan</h2>
                </div>
            }
        >
            <Head title={`Detail - ${document.sop_name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        
                        {/* Header Detail */}
                        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{document.sop_name}</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Varian Kondisi: <span className="font-semibold text-gray-700">{document.varian}</span>
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Versi {document.version}
                                </span>
                            </div>
                        </div>

                        {/* Konten Utama */}
                        <div className="px-6 py-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-4">Isi Panduan (Yang dibaca oleh AI):</h4>
                            <div className="bg-gray-50 p-5 rounded-md border border-gray-200 whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                                {document.content}
                            </div>
                            
                            <p className="mt-4 text-xs text-gray-400">
                                Terakhir diperbarui pada: {new Date(document.updated_at).toLocaleString('id-ID')}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md font-medium text-sm hover:bg-red-50 transition-colors"
                            >
                                Hapus Dokumen
                            </button>
                            <Link 
                                href={route('knowledge.edit', document.id)}
                                className="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
                            >
                                Edit Syarat / Ketentuan
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function KnowledgeIndex({ auth, groupedDocuments }) {
    const { props } = usePage();
    // State untuk melacak dropdown (accordion) mana yang sedang terbuka
    const [openGroup, setOpenGroup] = useState(null);

    const toggleGroup = (groupName) => {
        setOpenGroup(openGroup === groupName ? null : groupName);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar SOP (Knowledge Base)</h2>
                    <Link href={route('knowledge.create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
                        + Tambah Aturan Baru
                    </Link>
                </div>
            }
        >
            <Head title="Knowledge Base" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Pesan Sukses / Error */}
                    {props.flash?.status && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {props.flash.status}
                        </div>
                    )}

                    {/* Accordion Grouping */}
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        {!groupedDocuments || Object.keys(groupedDocuments).length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Belum ada dokumen yang terdaftar.</p>
                        ) : (
                            Object.keys(groupedDocuments).map((sopName) => (
                                <div key={sopName} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Header Dropdown / Accordion */}
                                    <button 
                                        onClick={() => toggleGroup(sopName)}
                                        className="w-full flex justify-between items-center bg-gray-50 px-6 py-4 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-bold text-gray-800 text-lg">{sopName}</span>
                                        <span className="text-gray-500 bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                                            {groupedDocuments[sopName].length} Varian
                                        </span>
                                    </button>

                                    {/* Isi Dropdown (Card Varian) */}
                                    {openGroup === sopName && (
                                        <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-200">
                                            {groupedDocuments[sopName].map((doc) => (
                                                <div key={doc.id} className="border border-gray-200 p-4 rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                                                    
                                                    {/* Badge Versi */}
                                                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-bl-lg">
                                                        v{doc.version}
                                                    </div>
                                                    
                                                    {/* Info Varian */}
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Varian Layanan:</span>
                                                        <h4 className="font-bold text-gray-900 text-md pr-6">{doc.varian}</h4>
                                                    </div>
                                                    
                                                    {/* Tombol Menuju Halaman Detail */}
                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                        <span className="text-xs text-gray-400">{new Date(doc.updated_at).toLocaleDateString('id-ID')}</span>
                                                        <Link 
                                                            href={route('knowledge.show', doc.id)} 
                                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Lihat Detail &rarr;
                                                        </Link>
                                                    </div>
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
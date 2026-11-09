import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Utama</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Card 1: Knowledge Base */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 hover:border-blue-300 transition-colors">
                            <div className="p-8">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Base (SOP)</h3>
                                <p className="text-gray-500 mb-6">Kelola dokumen, aturan, dan persyaratan layanan desa yang akan digunakan oleh AI untuk menjawab pertanyaan warga.</p>
                                <Link href={route('knowledge.index')} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
                                    Kelola Knowledge Base &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* Card 2: Pengaturan */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                            <div className="p-8">
                                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan Fallback</h3>
                                <p className="text-gray-500 mb-6">Perbarui nomor WhatsApp kontak petugas nyata dan URL website jika AI tidak dapat menemukan jawaban (kondisi fallback).</p>
                                <Link href={route('settings.edit')} className="inline-flex items-center text-gray-600 font-semibold hover:text-gray-900">
                                    Ubah Pengaturan &rarr;
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
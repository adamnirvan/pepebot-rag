import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center relative overflow-hidden">
            <Head title="PepeBot - Layanan Desa Pepe" />
            
            {/* Latar Belakang Dekoratif (Opsional) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            </div>

            <div className="text-center max-w-2xl px-6 z-10">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Layanan Desa Pepe <br/>
                    <span className="text-blue-600">Lebih Dekat & Cepat.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    Tanyakan informasi layanan, syarat administrasi, dan prosedur desa kapan saja, 24/7. Didukung oleh AI untuk melayani warga dengan presisi.
                </p>
                
                <Link 
                    href={route('chat.index')} 
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                    Mulai Chat PepeBot &rarr;
                </Link>
            </div>
            
            {/* Tombol Login Admin Tersembunyi di Pojok */}
            <div className="absolute bottom-6 right-6">
                <Link href={route('login')} className="text-xs font-medium text-gray-300 hover:text-gray-500 transition-colors">
                    Portal Admin
                </Link>
            </div>
        </div>
    );
}
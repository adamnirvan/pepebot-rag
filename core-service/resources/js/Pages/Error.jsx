import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ErrorPage({ status }) {
    const title = {
        503: '503: Layanan Tidak Tersedia',
        500: '500: Terjadi Kesalahan Server',
        404: '404: Halaman Tidak Ditemukan',
        403: '403: Akses Ditolak',
    }[status] || 'Terjadi Kesalahan';

    const description = {
        503: 'Maaf, layanan sedang dalam perbaikan. Silakan periksa kembali nanti.',
        500: 'Whoops, server kami mengalami sedikit kendala. Admin telah dihubungi.',
        404: 'Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.',
        403: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
    }[status] || 'Terjadi masalah yang tidak terduga pada server.';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-6">
            <Head title={title} />
            <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">{status}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md">{description}</p>
            <Link 
                href={route('home')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
}
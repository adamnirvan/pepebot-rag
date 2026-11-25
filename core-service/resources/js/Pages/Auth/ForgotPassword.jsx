import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F6FB] px-4 py-10 sm:px-6">
                <div className="mb-7 flex flex-row items-center justify-center gap-3">
                    <img
                        src="/images/pepebot-mascot.png"
                        alt="PepeBot Mascot"
                        className="h-14 w-14 shrink-0 object-contain"
                    />
                    <div className="text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight text-[#172B4D]">
                            Pepebot
                        </h1>
                        <p className="text-sm font-medium text-[#8290A5]">
                            Desa Pepe, Sidoarjo
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-[#E5EAF2] bg-white p-7 shadow-[0_12px_45px_rgba(31,55,90,0.07)] sm:p-9">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3978E8]">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="5" width="18" height="14" rx="3" />
                                <path d="m4 7 8 6 8-6" />
                            </svg>
                        </div>

                        <p className="text-xs font-bold tracking-[0.16em] text-[#3978E8]">
                            PEMULIHAN AKUN
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold text-[#172B4D]">
                            Lupa Password?
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#8290A5]">
                            Jangan khawatir. Masukkan alamat email yang terdaftar
                            dan kami akan mengirimkan tautan untuk mengatur ulang
                            password akunmu.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium leading-6 text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#344563]">
                                Alamat Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                placeholder="Masukkan email terdaftar"
                                className="w-full rounded-xl border border-[#DCE3ED] bg-white px-4 py-3 text-sm text-[#172B4D] outline-none transition placeholder:text-[#A0AABD] focus:border-[#3978E8] focus:ring-4 focus:ring-blue-50"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center rounded-xl bg-[#3978E8] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#275FC7] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Tautan Reset Password'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-[#EEF1F5] pt-5 text-center">
                        <Link
                            href={route('login')}
                            className="text-sm font-semibold text-[#3978E8] transition hover:text-[#275FC7]"
                        >
                            ← Kembali ke Login
                        </Link>
                    </div>
                </div>

                <p className="mt-7 text-xs text-[#A0AABD]">
                    Pepebot • Asisten AI warga Desa Pepe
                </p>
            </div>
        </>
    );
}

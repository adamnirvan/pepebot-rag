import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass =
        'w-full rounded-xl border border-[#DCE3ED] bg-white py-3.5 px-4 text-sm text-[#344054] outline-none transition placeholder:text-[#B0B9C7] focus:border-[#3978D7] focus:ring-4 focus:ring-blue-50';

    const labelClass =
        'mb-2 block text-sm font-semibold text-[#344054]';

    return (
        <>
            <Head title="Tambah Admin" />

            <div className="min-h-screen bg-[#F3F6FB] px-5 py-10 sm:px-8">
                <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-center">

                    {/* Logo */}
                    <Link href="/" className="mb-8 flex items-center gap-3">
                        <img
                            src="/images/pepebot-mascot.png"
                            alt="PepeBot Mascot"
                            className="h-14 w-14 object-contain"
                        />

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#1B2434]">
                                Pepebot
                            </h1>
                            <p className="text-[10px] font-semibold tracking-[2px] text-[#64748B]">
                                ADMIN DESA
                            </p>
                        </div>
                    </Link>

                    {/* Register Card */}
                    <div className="w-full rounded-2xl border border-[#E5EAF2] bg-white p-7 shadow-[0_12px_45px_rgba(31,55,90,0.07)] sm:p-9">

                        <div className="mb-7">
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3978D7]">
                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                    <path
                                        d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="10"
                                        cy="7"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                    <path
                                        d="M20 8v6M17 11h6"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <p className="mb-2 text-[10px] font-semibold tracking-[1.8px] text-[#3978D7]">
                                PENGELOLAAN PEPEBOT
                            </p>

                            <h2 className="text-[28px] font-bold tracking-tight text-[#1B2434]">
                                Tambah Admin
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#718096]">
                                Buat akun admin baru untuk mengelola layanan dan pengetahuan Desa Pepe.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">

                            {/* Nama */}
                            <div>
                                <label htmlFor="name" className={labelClass}>
                                    Nama Lengkap
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Masukkan nama lengkap"
                                    required
                                    className={inputClass}
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Alamat Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    required
                                    className={inputClass}
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className={labelClass}>
                                    Kata Sandi
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        autoComplete="new-password"
                                        placeholder="Buat kata sandi"
                                        required
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-[#98A2B3] hover:text-[#3978D7]"
                                        aria-label="Tampilkan atau sembunyikan kata sandi"
                                    >
                                        {showPassword ? 'Sembunyikan' : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    d="M2.5 12S6 5.5 12 5.5S21.5 12 21.5 12S18 18.5 12 18.5S2.5 12 2.5 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className={labelClass}
                                >
                                    Konfirmasi Kata Sandi
                                </label>

                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmation ? 'text' : 'password'
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi"
                                        required
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmation(!showConfirmation)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-[#98A2B3] hover:text-[#3978D7]"
                                        aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                                    >
                                        {showConfirmation ? 'Sembunyikan' : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    d="M2.5 12S6 5.5 12 5.5S21.5 12 21.5 12S18 18.5 12 18.5S2.5 12 2.5 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3978D7] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-[#2865C0] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Tambah Admin'}

                                {!processing && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M5 12H19M13 6L19 12L13 18"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk Admin" />

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

                    {/* Login Card */}
                    <div className="w-full rounded-2xl border border-[#E5EAF2] bg-white p-7 shadow-[0_12px_45px_rgba(31,55,90,0.07)] sm:p-9">

                        <div className="mb-7">
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3978D7]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                >
                                    <rect
                                        x="5"
                                        y="10"
                                        width="14"
                                        height="11"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                    <path
                                        d="M8 10V7a4 4 0 118 0v3"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12 14V17"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <p className="mb-2 text-[10px] font-semibold tracking-[1.8px] text-[#3978D7]">
                                AKSES KHUSUS ADMIN
                            </p>

                            <h2 className="text-[28px] font-bold tracking-tight text-[#1B2434]">
                                Masuk Admin
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#718096]">
                                Gunakan akun admin untuk mengelola layanan
                                dan pengetahuan desa.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-[#344054]"
                                >
                                    Alamat Email
                                </label>

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#98A2B3]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="h-5 w-5"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                            />
                                            <path
                                                d="M4 7L12 13L20 7"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        autoComplete="username"
                                        autoFocus
                                        placeholder="nama@email.com"
                                        className="w-full rounded-xl border border-[#DCE3ED] bg-white py-3.5 pl-11 pr-4 text-sm text-[#344054] outline-none transition placeholder:text-[#B0B9C7] focus:border-[#3978D7] focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-[#344054]"
                                    >
                                        Kata Sandi
                                    </label>
                                </div>

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#98A2B3]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="h-5 w-5"
                                        >
                                            <rect
                                                x="5"
                                                y="10"
                                                width="14"
                                                height="11"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                            />
                                            <path
                                                d="M8 10V7a4 4 0 118 0v3"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi"
                                        className="w-full rounded-xl border border-[#DCE3ED] bg-white py-3.5 pl-11 pr-12 text-sm text-[#344054] outline-none transition placeholder:text-[#B0B9C7] focus:border-[#3978D7] focus:ring-4 focus:ring-blue-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#98A2B3] transition hover:text-[#3978D7]"
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan kata sandi'
                                                : 'Tampilkan kata sandi'
                                        }
                                    >
                                        {showPassword ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    d="M3 3L21 21M10.6 10.6A2 2 0 0013.4 13.4M9.9 5.2A10.8 10.8 0 0112 5C17 5 20.5 9 21 12C20.7 13.3 20 14.5 19 15.5M6.2 6.2C4.4 7.4 3.3 9.1 3 12C3.5 15 7 19 12 19C13.5 19 14.8 18.6 16 18"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        ) : (
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

                            {canResetPassword && (
                                <div className="flex justify-end">
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-semibold text-[#3978D7] transition hover:text-blue-800"
                                    >
                                        Lupa kata sandi?
                                    </Link>
                                </div>
                            )}

                            {/* Remember */}
                            <label className="flex cursor-pointer items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-[#D0D5DD] text-[#3978D7] focus:ring-[#3978D7]"
                                />
                                <span className="text-xs text-[#667085]">
                                    Ingat saya
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3978D7] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-[#2865C0] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : 'Masuk Dasbor'}

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

                    {/* Footer */}
                    <div className="mt-7 text-center">
                        <p className="text-xs font-medium text-[#718096]">
                            Pepebot Admin • Desa Pepe, Sidoarjo
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#98A2B3]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-3.5 w-3.5"
                            >
                                <path
                                    d="M12 3L19 6V11C19 15.5 16 19 12 21C8 19 5 15.5 5 11V6L12 3Z"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9 12L11 14L15 10"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Ruang kerja internal perangkat Desa Pepe
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

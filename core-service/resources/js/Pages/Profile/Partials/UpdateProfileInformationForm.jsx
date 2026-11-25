import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className="max-w-3xl">
            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0FF] text-[#2750B4]">
                    <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                </div>

                <div>
                    <h3 className="text-base font-semibold text-[#1B2434]">
                        Informasi Pribadi
                    </h3>
                    <p className="mt-1 text-sm text-[#64708A]">
                        Informasi identitas akun administrator.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="font-medium text-[#1B2434]"
                    />

                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="mt-2 w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#1B2434] outline-none transition focus:border-[#2750B4] focus:ring-2 focus:ring-[#EAF0FF]"
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Alamat Email"
                        className="font-medium text-[#1B2434]"
                    />

                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="mt-2 w-full rounded-xl border border-[#E1E2E3] bg-white px-4 py-3 text-sm text-[#1B2434] outline-none transition focus:border-[#2750B4] focus:ring-2 focus:ring-[#EAF0FF]"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-[#D8DBE2] bg-[#EAF0FF] p-4">
                        <p className="text-sm text-[#1B2434]">
                            Alamat email kamu belum diverifikasi.
                        </p>

                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 text-sm font-semibold text-[#2750B4] underline"
                        >
                            Kirim ulang email verifikasi
                        </Link>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-green-700">
                                Link verifikasi baru berhasil dikirim.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-[#2750B4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D3D8A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="text-sm font-medium text-green-700">
                            Perubahan berhasil disimpan.
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

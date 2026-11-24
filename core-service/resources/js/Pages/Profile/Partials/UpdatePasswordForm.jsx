import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputClass =
        'mt-2 w-full rounded-xl border border-[#D8DBE2] bg-white px-4 py-3 text-sm text-[#1B2434] placeholder:text-[#64708A] focus:border-[#2750B4] focus:outline-none focus:ring-1 focus:ring-[#2750B4]';

    return (
        <section className={`rounded-2xl border border-[#D8DBE2] bg-white p-7 ${className}`}>
            <h2 className="text-base font-semibold text-[#1B2434]">
                Ubah Kata Sandi
            </h2>

            <p className="mt-4 text-sm text-[#64708A]">
                Gunakan kata sandi yang panjang dan sulit ditebak.
            </p>

            <form onSubmit={updatePassword} className="mt-5 space-y-5">
                <div>
                    <label htmlFor="current_password" className="text-sm font-medium text-[#1B2434]">
                        Kata sandi saat ini
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className={inputClass}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-[#1B2434]">
                        Kata sandi baru
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-[#1B2434]">
                        Konfirmasi kata sandi baru
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-[#2750B4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D3D8A] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Perbarui Kata Sandi
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">
                            Kata sandi berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

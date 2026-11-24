import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between ${className}`}>
            <div>
                <h2 className="text-base font-semibold text-[#C9372C]">
                    Hapus Akun
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-[#77756E]">
                    Menghapus akun akan mencabut akses Anda ke dasbor admin secara permanen.
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </div>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="shrink-0 rounded-xl border border-[#F0C5C0] bg-white px-6 py-3 text-sm font-semibold text-[#C9372C] transition hover:bg-[#FFF5F4]"
            >
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-[#37352D]">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="mt-2 text-sm text-[#77756E]">
                        Tindakan ini tidak dapat dibatalkan. Masukkan kata sandi
                        untuk mengonfirmasi penghapusan akun.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="delete_password" value="Kata Sandi" />

                        <TextInput
                            id="delete_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-2 block w-full"
                            isFocused
                            placeholder="Masukkan kata sandi"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

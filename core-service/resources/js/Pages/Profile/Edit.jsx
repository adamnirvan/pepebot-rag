import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout>
            <Head title="Profil Admin" />

            <div className="mx-auto max-w-7xl space-y-7">
                <div>
                    <p className="mb-2 text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                        PENGELOLAAN PEPEBOT
                    </p>
                    <h1 className="text-2xl font-bold text-[#37352D]">
                        Profil Admin
                    </h1>
                    <p className="mt-2 text-sm text-[#77756E]">
                        Kelola informasi pribadi dan keamanan akun admin Pepebot.
                    </p>
                </div>

                {/* Informasi Profil dan Ubah Kata Sandi */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                    <div className="h-full rounded-2xl border border-[#E1E2E3] bg-white p-6 sm:p-7">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="h-full rounded-2xl border border-[#E1E2E3] bg-white p-6 sm:p-7">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Zona Berbahaya */}
                <div className="rounded-2xl border border-[#F0D5D2] bg-white p-6 sm:p-7">
                    <DeleteUserForm />
                </div>
            </div>
        </AdminLayout>
    );
}

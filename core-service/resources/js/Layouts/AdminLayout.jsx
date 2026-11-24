import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { useState } from 'react';

const navigation = [
    {
        label: 'Dasbor',
        href: 'dashboard',
        active: 'dashboard',
        icon: 'dashboard',
    },
    {
        label: 'Manajemen SOP',
        href: 'knowledge.index',
        active: 'knowledge.*',
        icon: 'documents',
    },
    {
        label: 'Pengaturan Fallback',
        href: 'settings.edit',
        active: 'settings.*',
        icon: 'settings',
    },
    {
        label: 'Profil',
        href: 'profile.edit',
        active: 'profile.*',
        icon: 'profile',
    },
];

function MenuIcon({ name }) {
    const paths = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        documents: (
            <>
                <rect x="4" y="3" width="14" height="18" rx="2" />
                <path d="M8 8h6M8 12h6M8 16h4" />
                <path d="M16 3v4h4" />
            </>
        ),
        settings: (
            <>
                <path d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="9" cy="6" r="2" fill="white" />
                <circle cx="15" cy="12" r="2" fill="white" />
                <circle cx="8" cy="18" r="2" fill="white" />
            </>
        ),
        profile: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </>
        ),
    };

    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name]}
        </svg>
    );
}

export default function AdminLayout({ children }) {
    const user = usePage().props.auth.user;
    const currentRoute = route().current();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const currentPage =
        navigation.find((item) => route().current(item.active))?.label ||
        'Admin';

    return (
        <div className="min-h-screen bg-[#F4F7FB] text-[#1B2434]">
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-[#D8DBE2] bg-white transition-transform duration-300 lg:translate-x-0 ${
                    mobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                
                {/* Logo */}
                <div className="flex h-[84px] items-center gap-3 px-5">
                    <img
                        src="/images/pepebot-mascot.png"
                        alt="PepeBot Mascot"
                        className="h-10 w-10 shrink-0 object-contain"
                    />

                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight">
                            Pepebot
                        </h1>
                        <p className="text-[9px] tracking-[2px] text-[#64708A]">
                            ADMIN DESA
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-5 pt-7">
                    <p className="mb-4 text-[10px] font-medium tracking-[1.5px] text-[#64708A]">
                        RUANG KELOLA
                    </p>

                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const active = route().current(item.active);

                            return (
                                <Link
                                    key={item.label}
                                    href={route(item.href)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition ${
                                        active
                                            ? 'bg-[#EAF0FF] font-semibold text-[#2750B4]'
                                            : 'text-[#64708A] hover:bg-[#F0F4FA] hover:text-[#2750B4]'
                                    }`}
                                >
                                    <MenuIcon name={item.icon} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Information card */}
                <div className="px-5 pb-5">
                    <div className="rounded-xl bg-[#F4F7FB] p-4">
                        <div className="mb-3 text-[#64708A]">
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                                <path d="M4 5.5v16M8 7h8M8 11h8" />
                            </svg>
                        </div>

                        <p className="text-xs font-semibold leading-5">
                            Panduan terjaga, layanan lebih terbantu.
                        </p>

                        <p className="mt-2 text-[11px] leading-5 text-[#64708A]">
                            Perbarui dokumen dan tinjau jawaban AI secara berkala.
                        </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-[10px] text-[#64708A]">
                        <span>🔒</span>
                        Khusus petugas desa
                    </div>
                </div>
            </aside>

            {/* Main area */}
            <div className="min-h-screen lg:ml-[250px]">
                {/* Top header */}
                <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-[#D8DBE2] bg-white px-5 sm:px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-3 text-sm">
                            <span className="hidden text-[#64708A] sm:block">
                                Desa Pepe, Sidoarjo
                            </span>
                            <span className="hidden text-[#64708A] sm:block">
                                /
                            </span>
                            <span className="font-medium">
                                {currentPage}
                            </span>
                        </div>
                    </div>

                    {/* Admin dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF0FF] text-xs font-medium">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>

                                <span className="hidden text-sm font-medium sm:block">
                                    {user.name}
                                </span>

                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="m7 10 5 5 5-5" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>


                        <Dropdown.Content>
                            <Dropdown.Link href={route('register')}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3978D5]">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-13a4 4 0 11-8 0 4 4 0 018 0zm4 5v6m-3-3h6"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#253047]">
                                            Tambah Admin
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#8A94A6]">
                                            Buat akun administrator baru
                                        </p>
                                    </div>
                                </div>
                            </Dropdown.Link>

                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="!bg-[#FFF0EE] !text-[#C34B43] hover:!bg-[#FFE3DF] focus:!bg-[#FFE3DF] border border-[#FADAD6]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE3DF] text-[#C34B43]">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M9 17l5-5-5-5m5 5H3m9-9h6a2 2 0 012 2v14a2 2 0 01-2 2h-6"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#C34B43]">
                                            Logout
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#C77A73]">
                                            Keluar dari akun Anda
                                        </p>
                                    </div>
                                </div>
                            </Dropdown.Link>
                        </Dropdown.Content>

                    </Dropdown>
                </header>

                {/* Page content */}
                <main className="min-h-[calc(100vh-84px)] px-5 py-8 sm:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

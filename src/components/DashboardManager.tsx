// src/components/DashboardManager.tsx
import { useState } from 'react';
import { AttendancePage } from '../pages/attendancePage';
import { AdminRegisterPage } from '../pages/AdminRegisterPage';
import type { UserData } from '../Types';

export const DashboardManager = ({ user, onLogout }: { user: UserData; onLogout: () => void }) => {
    // Secara default, semua user (termasuk HR) diarahkan ke Absensi dulu
    const [activeMenu, setActiveMenu] = useState<'ABSEN' | 'REGISTER' | 'REPORT'>('ABSEN');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. NAVBAR (Hanya muncul untuk ADMIN/HR) */}
            {user.role === 'ADMIN' && (
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-md mx-auto flex justify-around">
                        <button
                            onClick={() => setActiveMenu('ABSEN')}
                            className={`py-4 px-2 text-[10px] font-black tracking-[0.2em] transition-all
                ${activeMenu === 'ABSEN' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-400'}`}
                        >
                            ABSENSI
                        </button>
                        <button
                            onClick={() => setActiveMenu('REGISTER')}
                            className={`py-4 px-2 text-[10px] font-black tracking-[0.2em] transition-all
                ${activeMenu === 'REGISTER' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-400'}`}
                        >
                            KELOLA STAFF
                        </button>
                        <button
                            onClick={() => setActiveMenu('REPORT')}
                            className={`py-4 px-2 text-[10px] font-black tracking-[0.2em] transition-all
                ${activeMenu === 'REPORT' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-400'}`}
                        >
                            LAPORAN
                        </button>
                    </div>
                </nav>
            )}

            {/* 2. KONTEN (Tergantung Menu yang Dipilih) */}
            <main className="animate-in fade-in duration-500">
                {activeMenu === 'ABSEN' && (
                    <AttendancePage user={user} onLogout={onLogout} />
                )}

                {activeMenu === 'REGISTER' && user.role === 'ADMIN' && (
                    <AdminRegisterPage onLogout={onLogout} />
                )}

                {activeMenu === 'REPORT' && user.role === 'ADMIN' && (
                    <div className="p-10 text-center text-gray-400">
                        Halaman Laporan (Coming Soon)
                    </div>
                )}
            </main>
        </div>
    );
};
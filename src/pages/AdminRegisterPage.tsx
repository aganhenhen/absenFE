import { useState } from 'react';
import type { RegisterEmployee } from '../Types';

// 1. Interface sudah terdaftar dengan onLogout
interface AdminRegisterProps {
    onLogout: () => void;
}

export const AdminRegisterPage = ({ onLogout }: AdminRegisterProps) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<RegisterEmployee>({
        username: '',
        password: '',
        fullName: '',
        position: '',
        shiftCode: 'S01',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert("Pendaftaran karyawan berhasil dilakukan.");
                setForm({ username: '', password: '', fullName: '', position: '', shiftCode: 'S01' });
            } else {
                const errorData = await res.json();
                alert(`Gagal: ${errorData.message || 'Periksa kembali data inputan'}`);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert('Error On Server: ' + err.message);
            } else {
                alert('Terjadi kesalahan yang tidak diketahui');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                {/* Header Panel - Sekarang dengan Tombol Logout */}
                <div className="bg-slate-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-white text-lg font-bold tracking-tight">REGISTRASI KARYAWAN</h2>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-1">Sistem Manajemen SDM Dexa</p>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={onLogout}
                        className="px-4 py-2 border border-slate-600 text-slate-300 text-[10px] font-bold rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300"
                    >
                        LOGOUT
                    </button>
                </div>

                <form onSubmit={handleRegister} className="p-8 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Field Username */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Username Login</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 transition-all"
                                placeholder="ex: dexa_staff"
                            />
                        </div>

                        {/* Field Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Password Default</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Field Nama Lengkap */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Nama Lengkap Karyawan</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 transition-all"
                            placeholder="Masukkan nama sesuai KTP"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Field Jabatan */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Jabatan / Posisi</label>
                            <input
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                required
                                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 transition-all"
                                placeholder="ex: Medical Representative"
                            />
                        </div>

                        {/* Field Shift */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Penempatan Shift</label>
                            <select
                                name="shiftCode"
                                value={form.shiftCode}
                                onChange={handleChange}
                                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 cursor-pointer appearance-none"
                            >
                                <option value="S01">SHIFT 1 (PAGI)</option>
                                <option value="S02">SHIFT 2 (SIANG)</option>
                                <option value="S03">SHIFT 3 (MALAM)</option>
                            </select>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white tracking-widest transition-all
                ${loading ? 'bg-slate-300' : 'bg-slate-800 hover:bg-black shadow-lg shadow-slate-100'}`}
                        >
                            {loading ? 'SEDANG MEMPROSES...' : 'SIMPAN DATA KARYAWAN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
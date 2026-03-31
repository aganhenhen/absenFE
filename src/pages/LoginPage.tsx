import { useState } from 'react'
import { InputField } from '../components/InputField'
import type { UserData } from '../Types';


interface LoginPageProps {
  onLoginSuccess: (userData: UserData) => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()


    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password }),
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        onLoginSuccess(data.user as UserData);
      } else {
        alert('Email atau Password salah!')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error On Server: ' + err.message);
      } else {
        alert('Terjadi kesalahan yang tidak diketahui');
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800">Aplikasi Presensi</h1>
          <p className="text-slate-500 mt-2">Masuk untuk melanjutkan akses</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            label="Username"
            type="text"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-4"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}
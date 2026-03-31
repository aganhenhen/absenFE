import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import type { UserData, AttendanceStatusResponse } from '../Types';

interface AttendanceProps {
  user: UserData;
  onLogout: () => void;
}

// HELPER: Mendapatkan tanggal lokal YYYY-MM-DD (Anti-UTC Offset)
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AttendancePage = ({ user, onLogout }: AttendanceProps) => {
  // 1. State Management
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AttendanceStatusResponse | null>(null);
  const [activeWorkDate, setActiveWorkDate] = useState<string>("");
  const [notes, setNotes] = useState('');
  const [capturedImg, setCapturedImg] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);

  // 2. Fungsi Ambil Status (Logika Tarik 2x untuk Shift Malam/Lembur)
  const fetchStatus = async () => {
    const token = localStorage.getItem('token');

    const now = new Date();
    const today = getLocalDateString(now);

    const yesterdayDate = new Date();
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    try {
      // Langkah 1: Cek Status Hari Ini
      const resToday = await fetch(`http://localhost:3000/attendance/status?date=${today}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resultToday: AttendanceStatusResponse = await resToday.json();

      // Langkah 2: Jika Hari Ini Belum Absen, Cek kemarin (Lembur)
      if (resultToday.status === 'READY_TO_CHECKIN') {
        const resYesterday = await fetch(`http://localhost:3000/attendance/status?date=${yesterday}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resultYesterday: AttendanceStatusResponse = await resYesterday.json();

        if (resultYesterday.status === 'READY_TO_CHECKOUT') {
          setStatus(resultYesterday);
          setActiveWorkDate(yesterday);
          return;
        }
      }

      setStatus(resultToday);
      setActiveWorkDate(today);

    } catch (err) {
      console.error("Gagal sinkron status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 3. Fungsi Jepret Kamera
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImg(imageSrc);
    }
  }, [webcamRef]);

  // 4. Fungsi Kirim Absen
  const handleAttendance = async () => {
    if (!capturedImg) return alert("Wajib ambil foto selfie dulu!");

    setLoading(true);
    const token = localStorage.getItem('token');

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const body = {
        coordinate: `${pos.coords.latitude}, ${pos.coords.longitude}`,
        address: "Lokasi Terdeteksi",
        customTime: new Date().toISOString(),
        notes: notes || "Hadir",
        image: capturedImg,
        date: activeWorkDate
      };

      try {
        const res = await fetch('http://localhost:3000/attendance/press-button', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Berhasil Absen untuk tanggal " + activeWorkDate);
          setCapturedImg(null);
          setNotes('');
          fetchStatus();
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
    }, () => {
      alert("Izin lokasi ditolak! Gagal absen.");
      setLoading(false);
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">

        {/* Header Profil */}
        <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
            {user.fullName.charAt(0)}
          </div>
          <div className="text-left flex-1">
            <h1 className="text-base font-bold text-slate-800 leading-none">{user.fullName}</h1>
            <p className="text-blue-600 text-[10px] font-black uppercase mt-1 tracking-widest">{user.position}</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Work Date</span>
            <span className="text-[10px] font-black text-slate-600">{activeWorkDate}</span>
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-blue-50/50 p-3 rounded-xl mb-6 text-center">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Current Status</span>
          <h2 className="text-blue-700 font-black text-sm">{status?.status.replace(/_/g, ' ')}</h2>
        </div>

        {/* AREA KAMERA */}
        {status?.status !== 'Thank You For Your Hard Work' && (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-square shadow-2xl border-4 border-white">
              {!capturedImg ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
              ) : (
                <img src={capturedImg} alt="Preview" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="mt-4">
              {!capturedImg ? (
                <button onClick={capture} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
                  AMBIL SELFIE
                </button>
              ) : (
                <button onClick={() => setCapturedImg(null)} className="w-full py-3 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-sm">
                  ULANGI FOTO
                </button>
              )}
            </div>
          </div>
        )}

        {/* Display Jam Masuk/Keluar */}
        {status?.data && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <p className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-tighter">Check In</p>
              <p className="text-lg font-black text-slate-700">{formatTime(status.data.check_in)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <p className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-tighter">Check Out</p>
              <p className="text-lg font-black text-slate-700">{status.data.check_out ? formatTime(status.data.check_out) : '--:--'}</p>
            </div>
          </div>
        )}

        {/* Input & Tombol Submit */}
        {capturedImg && status?.status !== 'Thank You For Your Hard Work' && (
          <div className="space-y-4">
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tambahkan catatan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={handleAttendance}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl
                ${status?.status === 'READY_TO_CHECKOUT' ? 'bg-orange-500' : 'bg-blue-600'}
                ${loading && 'opacity-50'}`}
            >
              {loading ? 'PROCESSING...' : status?.status === 'READY_TO_CHECKOUT' ? 'PULANG SEKARANG' : 'ABSEN MASUK'}
            </button>
          </div>
        )}

        {/* Footer Logout */}
        <button onClick={onLogout} className="w-full mt-8 text-slate-300 text-[9px] font-black hover:text-red-400 transition-colors uppercase tracking-[0.4em]">
          Sign Out Session
        </button>
      </div>
    </div>
  );
};
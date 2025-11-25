'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      setPhone(localStorage.getItem('currentPhone') || '');
      setUserId(localStorage.getItem('currentUserId') || '');
    } catch {}
  }, []);

  const handleLogout = () => {
    if (confirm('Keluar dari aplikasi?')) {
      try {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentPhone');
        localStorage.removeItem('currentOTP');
        localStorage.removeItem('otpAttempts');
        localStorage.removeItem('users');
      } catch {}
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        <p className="text-gray-600 mt-1 text-sm">Data akun & keamanan</p>
      </header>

      <main className="px-5 pb-24 max-w-md mx-auto space-y-4">
        <section className="p-4 rounded-2xl bg-white border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Informasi Akun</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>No. HP</span><span className="font-medium">{phone || '-'}</span></div>
            <div className="flex justify-between"><span>User ID</span><span className="font-mono text-xs">{userId || '-'}</span></div>
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-white border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Keamanan</h2>
          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow active:scale-[0.98]" onClick={() => router.push('/auth/pin')}>
            Ubah PIN
          </button>
        </section>

        <button className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-semibold border border-gray-200 active:scale-[0.98]" onClick={handleLogout}>
          Keluar
        </button>
      </main>
    </div>
  );
}

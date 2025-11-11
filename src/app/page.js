'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check jika user sudah login (cek localStorage)
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    setIsAuthenticated(Object.keys(users).length > 0);
  }, []);

  const handleStartAuth = () => {
    router.push('/auth/phone-verification');
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('users');
      localStorage.removeItem('currentPhone');
      localStorage.removeItem('currentOTP');
      localStorage.removeItem('otpAttempts');
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
            <div className="text-white text-center">
              <div className="text-sm font-bold mb-2 tracking-wide">LALU LINTAS</div>
              <div className="text-4xl">🛡️</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Sistem Informasi Lalu Lintas
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">
          Aplikasi manajemen sistem lalu lintas dengan keamanan berlapis
        </p>

        {/* Authentication Status */}
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium mb-1">✓ Anda sudah terdaftar</p>
              <p className="text-green-600 text-sm">Akun Anda sudah aktif di sistem</p>
            </div>
            <button
              onClick={handleStartAuth}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Hapus Data (Logout)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 text-sm">
                Daftar atau login untuk mengakses sistem
              </p>
            </div>
            <button
              onClick={handleStartAuth}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Mulai
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Fitur Keamanan:</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-600">✓</span>
              <span>Verifikasi nomor handphone</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-600">✓</span>
              <span>PIN 6 digit untuk keamanan akun</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-600">✓</span>
              <span>Verifikasi OTP dengan limit 5 kali percobaan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

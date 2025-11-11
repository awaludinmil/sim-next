'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PhonePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!phoneNumber || !agreed) {
      alert('Mohon lengkapi nomor HP dan setujui persyaratan');
      return;
    }

    const fullNumber = `+62${phoneNumber}`;
    
    // Cek apakah user sudah terdaftar
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[fullNumber]) {
      // User sudah terdaftar, arahkan ke login
      localStorage.setItem('currentPhone', fullNumber);
      router.push('/auth/login');
    } else {
      // User belum terdaftar, arahkan ke register
      localStorage.setItem('currentPhone', fullNumber);
      router.push('/auth/register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-blue-800 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-xs font-bold mb-1">LALU LINTAS</div>
              <div className="text-3xl">🛡️</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Masukkan Nomor HP
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Selamat Datang! Silakan masukkan nomor handphone Anda untuk melanjutkan
        </p>

        {/* Phone Input */}
        <div className="w-full max-w-md mb-auto">
          <div className="flex items-center border-b border-gray-300 pb-2">
            <div className="flex items-center gap-2 pr-3 border-r border-gray-300">
              <span className="text-2xl">🇮🇩</span>
              <span className="text-gray-700 font-medium">+62</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Masukkan nomor handphone"
              className="flex-1 pl-3 outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-md pb-6">
          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300"
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              Saya setuju dengan{' '}
              <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
              {' '}serta{' '}
              <a href="#" className="text-blue-600 underline">Kebijakan Privasi</a>
              {' '}yang berlaku
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!phoneNumber || !agreed}
            className={`w-full py-4 rounded-lg font-medium transition-colors ${
              phoneNumber && agreed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PhoneVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!phoneNumber || !agreed || loading) {
      alert('Mohon lengkapi nomor HP dan setujui persyaratan');
      return;
    }

    const national = phoneNumber.replace(/^0+/, '');
    const localNumber = `0${national}`;
    console.log(localNumber)
    localStorage.setItem('currentPhone', localNumber);

    try {
      setLoading(true);
      const resp = await axios.post(
        '/api/auth/users/register',
        { phone_number: localNumber },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const payload = resp.data || {};
      // Contoh respon backend:
      // { success: true, status_code: 200, message: '...', data: { has_pin: false, requires_otp: true } }
      const success = !!payload?.success;
      const apiMessage = payload?.message;
      const hasPin = !!payload?.data?.has_pin;
      const requiresOtp = !!payload?.data?.requires_otp;

      if (success) {
        if (hasPin) {
          router.push('/auth/pin');
          return;
        }
        if (requiresOtp) {
          // Inisialisasi counter OTP di client (untuk UI)
          localStorage.setItem('otpAttempts', '0');
          if (apiMessage) alert(apiMessage);
          router.push('/auth/otp');
          return;
        }
      }
      // Jika tidak memenuhi kondisi di atas, tampilkan pesan dari server bila ada
      if (apiMessage) alert(apiMessage);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        (err?.message?.toLowerCase?.().includes('network error')
          ? 'Gagal menghubungi server. Pastikan server berjalan lalu coba lagi.'
          : err?.message) ||
        'Terjadi kesalahan. Coba lagi.';
      
      // If phone number is already registered, redirect to login
      if (message.toLowerCase().includes('sudah terdaftar')) {
        router.push('/auth/login');
        return;
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-4">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white text-center">
              <div className="text-[10px] font-bold mb-1 tracking-wide">LALU LINTAS</div>
              <div className="text-4xl">🛡️</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Masukkan Nomor HP
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 max-w-sm text-[15px] leading-relaxed">
          Selamat Datang! Silakan masukkan nomor handphone Anda untuk melanjutkan
        </p>

        {/* Phone Input */}
        <div className="w-full max-w-md mb-auto">
          <div className="flex items-center border-b-2 border-gray-300 pb-3 focus-within:border-blue-600 transition-colors">
            <div className="flex items-center gap-2 pr-3 border-r-2 border-gray-300">
              <span className="text-2xl">🇮🇩</span>
              <span className="text-gray-800 font-semibold text-lg">+62</span>
            </div>
            <div className="flex items-center gap-1 pl-3 flex-1">
              <span className="text-gray-800 font-semibold text-lg">0</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="81234567890"
                className="flex-1 pl-1 outline-none text-gray-900 placeholder-gray-400 text-base"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-md pb-8 mt-8">
          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700 leading-relaxed">
              Saya setuju dengan{' '}
              <a href="#" className="text-blue-600 font-medium hover:underline">Syarat & Ketentuan</a>
              {' '}serta{' '}
              <a href="#" className="text-blue-600 font-medium hover:underline">Kebijakan Privasi</a>
              {' '}yang berlaku
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!phoneNumber || !agreed || loading}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              phoneNumber && agreed && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}


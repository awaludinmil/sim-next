'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PhoneVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      // Import api dynamically
      const api = (await import('@/lib/api')).default;
      const response = await api.get('/api/auth/users/me');

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // If session is valid, redirect to dashboard
          // But show a small toast or just redirect
          const Swal = (await import('sweetalert2')).default;

          Swal.fire({
            title: 'Sesi Masih Aktif',
            text: 'Mengalihkan ke dashboard...',
            timer: 1500,
            showConfirmButton: false,
            willClose: () => {
              router.push('/dashboard');
            }
          });
        }
      }
    } catch (error) {
      // Ignore error, meaning user is not logged in
      console.log('No active session');
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !agreed || loading) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Mohon lengkapi nomor HP dan setujui persyaratan',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    const national = phoneNumber.replace(/^0+/, '');
    const localNumber = `0${national}`;
    localStorage.setItem('currentPhone', localNumber);

    try {
      setLoading(true);
      
      // Clear any old tokens before registration to prevent stale CSRF token errors
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
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
      const success = !!payload?.success;
      const apiMessage = payload?.message;
      const hasPin = !!payload?.data?.has_pin;

      if (success) {
        localStorage.setItem('registerHasPin', hasPin ? 'true' : 'false');
        localStorage.setItem('otpAttempts', '0');

        if (hasPin) {
          await Swal.fire({
            icon: 'info',
            title: 'Nomor Terdaftar',
            text: apiMessage || 'Silakan masukkan PIN Anda.',
            confirmButtonColor: '#3B82F6',
          });
          router.push('/auth/pin');
        } else {
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: apiMessage || 'Kode OTP akan dikirim ke nomor Anda.',
            confirmButtonColor: '#3B82F6',
          });
          router.push('/auth/otp');
        }
        return;
      }

      if (apiMessage) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: apiMessage,
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        (err?.message?.toLowerCase?.().includes('network error')
          ? 'Gagal menghubungi server. Pastikan server berjalan lalu coba lagi.'
          : err?.message) ||
        'Terjadi kesalahan. Coba lagi.';

      const hasPin = err?.response?.data?.data?.has_pin;

      if (message.toLowerCase().includes('sudah terdaftar') || hasPin === true) {
        localStorage.setItem('registerHasPin', 'true');
        localStorage.setItem('otpAttempts', '0');
        await Swal.fire({
          icon: 'info',
          title: 'Nomor Terdaftar',
          text: message,
          confirmButtonColor: '#3B82F6',
        });
        router.push('/auth/pin');
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = phoneNumber.length >= 9 && agreed && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Info (Desktop Only) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-32 left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-lg">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl">SIM Online</h2>
                  <p className="text-white/70">Layanan Lalu Lintas</p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold mb-6">Verifikasi Nomor Handphone</h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Masukkan nomor handphone Anda untuk memulai proses pendaftaran atau login ke sistem.
            </p>

            {/* Steps */}
            <div className="space-y-4">
              {[
                { step: 1, title: 'Masukkan Nomor HP', desc: 'Nomor aktif untuk menerima OTP', active: true },
                { step: 2, title: 'Verifikasi OTP', desc: 'Kode 6 digit dikirim via SMS', active: false },
                { step: 3, title: 'Buat/Masukkan PIN', desc: 'PIN 6 digit untuk keamanan', active: false },
              ].map((item) => (
                <div key={item.step} className={`flex items-start gap-4 p-4 rounded-xl ${item.active ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${item.active ? 'bg-white text-blue-600' : 'bg-white/20'}`}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 lg:p-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-16">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6">
                  <span className="text-white text-4xl">🛡️</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Masukkan Nomor HP
                </h1>
                <p className="text-gray-600">
                  Selamat datang! Masukkan nomor handphone untuk melanjutkan
                </p>
              </div>

              {/* Phone Input Card */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 lg:p-8 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nomor Handphone
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-gray-50">
                  <div className="flex items-center gap-2 px-4 py-4 border-r-2 border-gray-200">
                    <span className="text-2xl">🇮🇩</span>
                    <span className="text-gray-800 font-semibold">+62</span>
                  </div>
                  <div className="flex items-center gap-1 px-4 flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="81234567890"
                      className="flex-1 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                    Saya setuju dengan{' '}
                    <a href="#" className="text-blue-600 font-medium hover:underline">Syarat & Ketentuan</a>
                    {' '}serta{' '}
                    <a href="#" className="text-blue-600 font-medium hover:underline">Kebijakan Privasi</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 ${isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Lanjutkan'
                )}
              </button>

              {/* Help */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Butuh bantuan?{' '}
                <a href="#" className="text-blue-600 font-medium hover:underline">Hubungi Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

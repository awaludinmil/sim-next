'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PinPage() {
  const [pin, setPin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSetPinMode, setIsSetPinMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fromOtpUserId = localStorage.getItem('currentUserId');
    const registerHasPin = localStorage.getItem('registerHasPin');
    const phone = localStorage.getItem('currentPhone');

    if (registerHasPin === 'true') {
      if (!phone) {
        router.replace('/auth/phone-verification');
        return;
      }
      setPhoneNumber(phone);
      setIsSetPinMode(false);
    } else if (registerHasPin === 'false') {
      if (fromOtpUserId) {
        setUserId(fromOtpUserId);
        setIsSetPinMode(true);
      } else {
        router.replace('/auth/otp');
      }
    } else {
      if (!phone) {
        router.replace('/auth/phone-verification');
        return;
      }
      setPhoneNumber(phone);
      setIsSetPinMode(false);
    }
  }, [router]);

  const handleKey = (key) => {
    if (loading) return;
    
    if (key === 'del') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (pin.length >= 6) return;
    if (typeof key === 'number') {
      setPin((prev) => {
        const next = [...prev, key];
        if (next.length === 6) {
          setTimeout(() => onComplete(next.join('')), 80);
        }
        return next;
      });
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (loading) return;
      if (/^\d$/.test(e.key)) handleKey(Number(e.key));
      if (e.key === 'Backspace' || e.key === 'Delete') handleKey('del');
      if (e.key === 'Enter' && pin.length === 6) onComplete(pin.join(''));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pin, loading]);

  const onComplete = async (value) => {
    setLoading(true);
    setError('');
    
    try {
      const registerHasPin = localStorage.getItem('registerHasPin');
      if (registerHasPin === 'false' && userId) {
        const resp = await fetch('/api/auth/users/set-pin', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, pin: value }),
        });

        const result = await resp.json();
        if ((result?.success && resp.status === 200) || resp.status === 200) {
          if (result?.data?.tokens) {
            localStorage.setItem('accessToken', result.data.tokens.access_token);
            localStorage.setItem('refreshToken', result.data.tokens.refresh_token);
            localStorage.setItem('csrfToken', result.data.tokens.csrf_token);
          }
          localStorage.setItem('userId', userId);
          const phone = localStorage.getItem('currentPhone');
          if (phone) localStorage.setItem('phoneNumber', phone);
          localStorage.removeItem('currentUserId');
          localStorage.removeItem('registerHasPin');
          localStorage.removeItem('otpAttempts');
          router.push('/dashboard');
        } else {
          setError(result?.message || 'Gagal menyimpan PIN');
          setPin([]);
        }
      } else {
        const response = await fetch('/api/auth/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phoneNumber, pin: value }),
        });

        const result = await response.json();
        if (result.success && response.status === 200) {
          localStorage.setItem('accessToken', result.data.tokens.access_token);
          localStorage.setItem('refreshToken', result.data.tokens.refresh_token);
          localStorage.setItem('csrfToken', result.data.tokens.csrf_token);
          
          if (result?.data?.user) {
            localStorage.setItem('userId', result.data.user.user_id);
            localStorage.setItem('phoneNumber', result.data.user.phone_number);
          } else if (phoneNumber) {
            localStorage.setItem('phoneNumber', phoneNumber);
          }
          localStorage.removeItem('currentUserId');
          localStorage.removeItem('registerHasPin');
          router.push('/dashboard');
        } else {
          setError(result.message || 'PIN tidak valid');
          setPin([]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(isSetPinMode ? 'Terjadi kesalahan saat menyimpan PIN' : 'Terjadi kesalahan saat login');
      setPin([]);
    } finally {
      setLoading(false);
    }
  };
  
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'blank', 0, 'del'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Info (Desktop) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-32 left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-lg">
            <div className="mb-8">
              <div className="inline-flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">{isSetPinMode ? '🔑' : '🔐'}</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl">{isSetPinMode ? 'Buat PIN' : 'Masukkan PIN'}</h2>
                  <p className="text-white/70">Langkah 3 dari 3</p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold mb-6">
              {isSetPinMode ? 'Buat PIN Anda' : 'Verifikasi PIN'}
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              {isSetPinMode 
                ? 'Buat PIN 6 digit untuk mengamankan akun Anda. PIN ini akan digunakan setiap kali Anda login.'
                : 'Masukkan PIN 6 digit yang telah Anda buat sebelumnya untuk masuk ke akun Anda.'
              }
            </p>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <h4 className="font-semibold mb-3">Keamanan PIN:</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gunakan kombinasi angka yang unik
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hindari tanggal lahir atau angka berurutan
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Jangan bagikan PIN kepada siapapun
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - PIN Form */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 lg:p-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              disabled={loading}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* PIN Content */}
          <div className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-16">
            <div className="w-full max-w-md text-center">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <span className="text-white text-3xl">{isSetPinMode ? '🔑' : '🔐'}</span>
                </div>
              </div>

              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {isSetPinMode ? 'Buat PIN Anda' : 'Masukkan PIN Anda'}
              </h1>
              <p className="text-gray-500 mb-6 text-sm">
                {isSetPinMode ? 'PIN 6 digit untuk keamanan akun' : 'Masukkan 6 digit PIN Anda'}
              </p>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Dot Indicator */}
              <div className="flex justify-center gap-3 mb-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      idx < pin.length 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 scale-110' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Forgot PIN */}
              {!isSetPinMode && (
                <button
                  type="button"
                  onClick={() => Swal.fire({
                    icon: 'info',
                    title: 'Informasi',
                    text: 'Fitur lupa PIN belum tersedia',
                    confirmButtonColor: '#3B82F6',
                  })}
                  className="text-blue-600 font-medium mb-6 hover:underline"
                  disabled={loading}
                >
                  Lupa PIN?
                </button>
              )}

              {/* Keypad */}
              <div className="w-full max-w-xs mx-auto">
                <div className="grid grid-cols-3 gap-3 select-none">
                  {keys.map((k, i) => {
                    if (k === 'blank') return <div key={i} />;
                    if (k === 'del') {
                      return (
                        <button
                          key={i}
                          onClick={() => handleKey('del')}
                          className="aspect-square rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-200 active:scale-95 transition disabled:opacity-50"
                          disabled={loading}
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l5-5h10a2 2 0 012 2v6a2 2 0 01-2 2H8l-5-5z" />
                          </svg>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleKey(Number(k))}
                        className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-2xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 transition disabled:opacity-50"
                        disabled={loading}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-medium">Memverifikasi...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
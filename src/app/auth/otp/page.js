'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const maxAttempts = 5;

  useEffect(() => {
    const phone = localStorage.getItem('currentPhone');
    if (!phone) {
      router.push('/auth/phone-verification');
      return;
    }
    setPhoneNumber(phone);
    const savedAttempts = parseInt(localStorage.getItem('otpAttempts') || '0');
    setAttempts(savedAttempts);
  }, [router]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value && !/^[A-Za-z0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && value) {
      setTimeout(() => verifyOTP(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^[A-Za-z0-9]$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    if (newOtp.every(digit => digit !== '')) {
      setTimeout(() => verifyOTP(newOtp.join('')), 100);
    }
  };

  const verifyOTP = async (otpCode) => {
    const currentAttempts = attempts + 1;

    if (currentAttempts > maxAttempts) {
      setError('Anda telah melebihi batas percobaan. Silakan coba lagi nanti.');
      return;
    }

    setAttempts(currentAttempts);
    localStorage.setItem('otpAttempts', currentAttempts.toString());
    setLoading(true);

    try {
      const resp = await axios.post('/api/auth/users/verify-otp', {
        phone_number: phoneNumber,
        otp: otpCode,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const payload = resp.data || {};
      const ok = payload?.success === true || payload?.status_code === 200;
      if (ok) {
        const userId = payload?.data?.user_id;
        if (userId) localStorage.setItem('currentUserId', userId);
        localStorage.removeItem('otpAttempts');
        setError('');
        router.push('/auth/pin');
        return;
      }

      const message = payload?.message || 'OTP tidak valid.';
      const remaining = Math.max(0, maxAttempts - currentAttempts);
      setError(remaining > 0 ? `${message} Sisa percobaan: ${remaining} kali` : message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        (err?.message?.toLowerCase?.().includes('network error')
          ? 'Gagal menghubungi server.'
          : err?.message) ||
        'Terjadi kesalahan saat verifikasi OTP.';
      const remaining = Math.max(0, maxAttempts - currentAttempts);
      setError(remaining > 0 ? `${message} Sisa percobaan: ${remaining} kali` : message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newOtp = '';
    for (let i = 0; i < 6; i++) {
      newOtp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    localStorage.setItem('currentOTP', newOtp);
    setRemainingTime(300);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    Swal.fire({
      icon: 'success',
      title: 'OTP Terkirim',
      text: 'OTP baru telah dikirim ke nomor Anda!',
      confirmButtonColor: '#3B82F6',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleContinue = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Mohon lengkapi kode OTP');
      return;
    }
    verifyOTP(otpCode);
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const canSubmit = isOtpComplete && attempts < maxAttempts && !loading;

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
                  <span className="text-3xl">🔐</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl">Verifikasi OTP</h2>
                  <p className="text-white/70">Langkah 2 dari 3</p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold mb-6">Cek SMS Anda</h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Kami telah mengirimkan kode OTP 6 digit ke nomor <span className="font-semibold">{phoneNumber}</span>. Masukkan kode tersebut untuk melanjutkan.
            </p>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <h4 className="font-semibold mb-3">Tips Keamanan:</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Jangan bagikan kode OTP kepada siapapun
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kode OTP hanya berlaku selama 5 menit
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Maksimal 5 kali percobaan
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - OTP Form */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 lg:p-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="lg:hidden text-lg font-semibold text-gray-900">
              Verifikasi OTP
            </h2>
          </div>

          {/* OTP Content */}
          <div className="flex-1 flex items-center justify-center px-6 pb-12 lg:px-16">
            <div className="w-full max-w-md text-center">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <span className="text-white text-4xl">🔐</span>
                </div>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Masukkan Kode OTP
              </h1>
              <p className="text-gray-600 mb-8">
                Kode dikirim ke <span className="font-semibold">{phoneNumber}</span>
              </p>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 lg:gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 lg:w-14 lg:h-16 text-center text-xl lg:text-2xl font-bold border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 uppercase transition-all"
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Timer & Resend */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Percobaan: <span className="font-medium">{attempts}/{maxAttempts}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-blue-600">{formatTime(remainingTime)}</span>
                </div>
                
                {canResend && attempts < maxAttempts && (
                  <button
                    onClick={handleResend}
                    className="block w-full mt-3 text-blue-600 font-medium hover:underline"
                  >
                    Kirim Ulang OTP
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleContinue}
                disabled={!canSubmit}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  canSubmit
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  'Verifikasi'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

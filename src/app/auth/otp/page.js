'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300); // 5 menit
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
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

  // Timer
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
    // Hanya terima huruf dan angka
    if (value && !/^[A-Za-z0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase(); // opsional: otomatis huruf besar
    setOtp(newOtp);
    setError('');

    // Auto fokus ke input berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify jika sudah lengkap
    if (newOtp.every(digit => digit !== '') && value) {
      setTimeout(() => verifyOTP(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = (otpCode) => {
    const savedOTP = localStorage.getItem('currentOTP');
    const currentAttempts = attempts + 1;

    if (currentAttempts > maxAttempts) {
      setError('Anda telah melebihi batas percobaan. Silakan coba lagi nanti.');
      return;
    }

    setAttempts(currentAttempts);
    localStorage.setItem('otpAttempts', currentAttempts.toString());

    if (otpCode === savedOTP) {
      alert('Verifikasi berhasil!');
      localStorage.removeItem('currentOTP');
      localStorage.removeItem('otpAttempts');
      localStorage.removeItem('currentPhone');
      router.push('/');
    } else {
      const remaining = maxAttempts - currentAttempts;
      setError(
        remaining > 0
          ? `OTP salah. Sisa percobaan: ${remaining} kali`
          : 'Anda telah melebihi batas percobaan. Silakan coba lagi nanti.'
      );
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    // Buat OTP baru 6 karakter alfanumerik
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newOtp = '';
    for (let i = 0; i < 6; i++) {
      newOtp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    localStorage.setItem('currentOTP', newOtp);
    console.log('OTP baru untuk testing:', newOtp);

    setRemainingTime(300);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();

    alert('OTP baru telah dikirim!');
  };

  const handleContinue = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Mohon lengkapi kode OTP');
      return;
    }
    verifyOTP(otpCode);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="flex-1 text-center text-lg font-semibold pr-10">
          Verifikasi OTP
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
            <div className="text-white text-center">
              <div className="text-[10px] font-bold mb-1 tracking-wide">LALU LINTAS</div>
              <div className="text-3xl">🛡️</div>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Masukkan Kode OTP</h1>

        <p className="text-gray-600 text-center mb-8 text-sm max-w-sm">
          Silahkan masukkan kode OTP yang kami kirimkan ke nomor hp{' '}
          <span className="font-semibold">{phoneNumber}</span>
        </p>

        {/* OTP Input */}
        <div className="flex gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-blue-600 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 uppercase"
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="text-center mb-auto">
          <p className="text-sm text-gray-700">
            Kirim Ulang <span className="font-medium">({attempts}/{maxAttempts})</span>{' '}
            <span className="font-semibold text-blue-600">{formatTime(remainingTime)}</span>
          </p>
          {canResend && attempts < maxAttempts && (
            <button
              onClick={handleResend}
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              Kirim Ulang OTP
            </button>
          )}
        </div>

        <div className="w-full max-w-md pb-6 px-4">
          <button
            onClick={handleContinue}
            disabled={otp.some(digit => digit === '') || attempts >= maxAttempts}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              otp.every(digit => digit !== '') && attempts < maxAttempts
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}

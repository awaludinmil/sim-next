'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Numpad from '@/components/Numpad';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const maxPinLength = 6;

  useEffect(() => {
    const phone = localStorage.getItem('currentPhone');
    if (!phone) {
      router.push('/auth/phone-verification');
      return;
    }
    setPhoneNumber(phone);
  }, [router]);

  const handleNumberClick = (num) => {
    if (pin.length < maxPinLength) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      
      // Jika PIN sudah 6 digit, verifikasi
      if (newPin.length === maxPinLength) {
        setTimeout(() => {
          verifyPin(newPin);
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const verifyPin = (userPin) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[phoneNumber];
    
    if (!user) {
      setError('Akun tidak ditemukan');
      setPin('');
      return;
    }
    
    if (user.pin === userPin) {
      // PIN benar, kirim OTP 6 digit
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('currentOTP', otp);
      localStorage.setItem('otpAttempts', '0');
      
      console.log('OTP untuk testing:', otp); // Untuk testing
      
      router.push('/auth/otp');
    } else {
      // PIN salah
      setError('PIN salah, silakan coba lagi');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button 
          onClick={() => router.push('/auth/phone-verification')}
          className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
            <div className="text-white text-center">
              <div className="text-[10px] font-bold mb-1 tracking-wide">LALU LINTAS</div>
              <div className="text-4xl">🛡️</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Masukkan PIN Anda
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* PIN Dots */}
        <div className="flex gap-4 mb-8">
          {[...Array(maxPinLength)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index < pin.length 
                  ? 'bg-gray-400 scale-110' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Forgot PIN Link */}
        <button 
          onClick={() => alert('Hubungi customer service untuk reset PIN')}
          className="text-blue-600 font-medium mb-12 text-base hover:underline"
        >
          Lupa PIN?
        </button>

        {/* Numpad */}
        <div className="w-full max-w-sm px-4">
          <Numpad onNumberClick={handleNumberClick} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

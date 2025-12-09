'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PinPage() {
  const [pin, setPin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Pastikan user datang dari alur yang benar
    const phone = localStorage.getItem('currentPhone');
    if (!phone) {
      router.replace('/auth/phone-verification');
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
      const phone = localStorage.getItem('currentPhone');
      
      const response = await fetch('/api/auth/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          pin: value,
        }),
      });

      const result = await response.json();

      if (result.success && response.status === 200) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', result.data.tokens.access_token);
        localStorage.setItem('refreshToken', result.data.tokens.refresh_token);
        localStorage.setItem('csrfToken', result.data.tokens.csrf_token);
        
        // Store user data
        localStorage.setItem('userId', result.data.user.user_id);
        localStorage.setItem('phoneNumber', result.data.user.phone_number);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(result.message || 'PIN tidak valid');
        setPin([]); // Clear PIN input
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login');
      setPin([]); // Clear PIN input
    } finally {
      setLoading(false);
    }
  };
  
  const keys = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    'blank', 0, 'del',
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg"
          aria-label="Kembali"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-2">
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
        <h1 className="text-lg font-semibold text-gray-900 mb-4">Masukkan PIN Anda</h1>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* Dot indicator */}
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-4 h-4 rounded-full ${idx < pin.length ? 'bg-blue-700' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Forgot */}
        <button
          type="button"
          onClick={() => alert('Fitur lupa PIN belum tersedia')}
          className="text-blue-600 font-medium mb-8"
          disabled={loading}
        >
          Lupa PIN?
        </button>

        {/* Keypad */}
        <div className="w-full max-w-sm px-4 mb-12">
          <div className="grid grid-cols-3 gap-4 md:gap-5 select-none">
            {keys.map((k, i) => {
              if (k === 'blank') return <div key={i} />;
              if (k === 'del') {
                return (
                  <button
                    key={i}
                    onClick={() => handleKey('del')}
                    className="aspect-square rounded-2xl bg-blue-700 text-white flex items-center justify-center text-2xl shadow-md hover:bg-blue-800 active:scale-95 transition disabled:opacity-50"
                    aria-label="Hapus"
                    disabled={loading}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 19l-6-7 6-7h12a2 2 0 012 2v10a2 2 0 01-2 2H6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 9.5l5 5m0-5l-5 5" />
                    </svg>
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => handleKey(Number(k))}
                  className="aspect-square rounded-2xl bg-blue-700 text-white text-2xl font-semibold shadow-md hover:bg-blue-800 active:scale-95 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 text-blue-600">
            Memverifikasi...
          </div>
        )}
      </div>
    </div>
  );
}
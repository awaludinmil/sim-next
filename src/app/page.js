'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // We use a simple fetch or api call to check if we are authenticated
      // Importing api dynamically to avoid SSR issues if any
      const api = (await import('@/lib/api')).default;
      
      const response = await api.get('/api/auth/users/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          router.replace('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.log('Session check failed', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  const features = [
    { icon: '📱', title: 'Verifikasi HP', description: 'Keamanan nomor handphone terverifikasi' },
    { icon: '🔐', title: 'PIN 6 Digit', description: 'Proteksi akun dengan PIN yang aman' },
    { icon: '🔑', title: 'OTP Berlapis', description: 'Verifikasi dengan limit 5 percobaan' },
    { icon: '🛡️', title: 'Data Aman', description: 'Enkripsi data end-to-end' },
  ];

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-3xl">🛡️</span>
          </div>
          <p className="text-blue-900 font-medium animate-pulse">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="max-w-xl mx-auto lg:mx-0">
            {/* Logo */}
            <div className="mb-8 fade-in">
              <div className="inline-flex items-center gap-4 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white text-3xl lg:text-4xl">🛡️</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl lg:text-3xl text-gray-900">SIM Online</h2>
                  <p className="text-gray-500">Layanan Lalu Lintas</p>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 fade-in stagger-1" style={{ animationFillMode: 'both' }}>
              Sistem Informasi{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lalu Lintas
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed fade-in stagger-2" style={{ animationFillMode: 'both' }}>
              Aplikasi manajemen sistem lalu lintas dengan keamanan berlapis. Ajukan SIM baru, perpanjang, atau laporkan kehilangan dengan mudah.
            </p>

            {/* Features Grid - Desktop */}
            <div className="hidden lg:grid grid-cols-2 gap-4 mb-10 fade-in stagger-3" style={{ animationFillMode: 'both' }}>
              {features.map((feature, index) => (
                <div key={index} className="group p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-4 fade-in stagger-4" style={{ animationFillMode: 'both' }}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleStartAuth}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    Masuk ke Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-8 py-4 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartAuth}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Mulai Sekarang
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="lg:flex-1 lg:flex lg:items-center lg:justify-center px-6 pb-12 lg:px-16 xl:px-24 lg:bg-gradient-to-br lg:from-blue-600 lg:via-indigo-600 lg:to-purple-700 lg:min-h-screen relative">
          {/* Decorative Elements for Desktop */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
          </div>

          <div className="relative w-full max-w-md mx-auto">
            {/* Auth Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/20 p-8 lg:p-10 fade-in">
              {/* Card Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white text-3xl">🛡️</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isAuthenticated ? 'Selamat Datang!' : 'Daftar atau Masuk'}
                </h3>
                <p className="text-gray-500">
                  {isAuthenticated 
                    ? 'Akun Anda sudah terdaftar dan aktif di sistem' 
                    : 'Mulai dengan memasukkan nomor handphone Anda'
                  }
                </p>
              </div>

              {/* Status Badge */}
              {isAuthenticated && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-700">Status: Terverifikasi</p>
                      <p className="text-sm text-emerald-600">Akun sudah aktif di sistem</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Features */}
              <div className="lg:hidden mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fitur Keamanan</p>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-xs font-medium text-gray-700">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleStartAuth}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  {isAuthenticated ? 'Masuk ke Dashboard' : 'Mulai Sekarang'}
                </button>
                
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Hapus Data (Logout)
                  </button>
                )}
              </div>

              {/* Terms */}
              <p className="mt-6 text-center text-xs text-gray-500">
                Dengan melanjutkan, Anda menyetujui{' '}
                <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                {' '}serta{' '}
                <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-4 lg:text-white text-gray-500">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Aman & Terenkripsi</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-current opacity-50" />
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '@/lib/api';

export default function ProfilePage() {
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nikInput, setNikInput] = useState('');
  const [verifyingNik, setVerifyingNik] = useState(false);
  const [showNikModal, setShowNikModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedPhone = localStorage.getItem('currentPhone') || localStorage.getItem('phoneNumber') || '';
      const savedUserId = localStorage.getItem('userId') || localStorage.getItem('currentUserId') || '';
      setPhone(savedPhone);
      setUserId(savedUserId);

      const { accessToken } = api.getTokens();
      if (accessToken) {
        // Add cache-busting parameter to ensure fresh data
        const cacheBuster = `?t=${Date.now()}`;
        const response = await api.get(`/api/auth/users/me${cacheBuster}`);
        const data = await response.json();
        if (data.success && data.data) {
          setProfile(data.data);
          if (data.data.phone_number) setPhone(data.data.phone_number);
          if (data.data.user_id) setUserId(data.data.user_id);
          
          // Save CSRF token if returned
          if (data.csrf_token) {
            localStorage.setItem('csrfToken', data.csrf_token);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNik = async () => {
    if (!nikInput || nikInput.length !== 16) {
      Swal.fire({
        icon: 'warning',
        title: 'NIK Tidak Valid',
        text: 'NIK harus terdiri dari 16 digit angka',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    setVerifyingNik(true);
    try {
      const response = await api.put('/api/auth/users/verify-nik', { nik: nikInput });

      const data = await response.json();

      if (data.success) {
        // Save CSRF token if returned
        if (data.csrf_token) {
          localStorage.setItem('csrfToken', data.csrf_token);
        }
        
        await Swal.fire({
          icon: 'success',
          title: 'NIK Terverifikasi',
          text: 'NIK Anda berhasil diverifikasi',
          confirmButtonColor: '#3B82F6',
        });
        setShowNikModal(false);
        fetchProfile();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message || 'Gagal memverifikasi NIK',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error('Error verifying NIK:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat memverifikasi NIK',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setVerifyingNik(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Keluar dari Akun?',
      text: 'Anda akan keluar dari aplikasi',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
    });

    if (result.isConfirmed) {
      try {
        await api.post('/api/auth/users/logout', {});
      } catch (error) {
        console.error('Logout error:', error);
      }

      api.clearTokens();
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentPhone');
      localStorage.removeItem('currentOTP');
      localStorage.removeItem('otpAttempts');
      localStorage.removeItem('users');
      localStorage.removeItem('registerHasPin');

      router.push('/');
    }
  };

  const nikVerified = Boolean(profile?.nik);

  const menuItems = [
    {
      title: 'Akun',
      items: [
        {
          icon: '🪪',
          label: 'Verifikasi NIK',
          desc: nikVerified ? `NIK: ${profile?.nik?.substring(0, 4)}****${profile?.nik?.substring(12)}` : 'Verifikasi NIK untuk daftar SIM',
          action: () => !nikVerified && setShowNikModal(true),
          badge: nikVerified ? { text: 'Terverifikasi', color: 'emerald' } : { text: 'Belum', color: 'amber' },
        },
        { icon: '👤', label: 'Edit Profil', desc: 'Ubah data pribadi Anda', action: () => {} },
        { icon: '🔐', label: 'Ubah PIN', desc: 'Ganti PIN keamanan', action: () => router.push('/auth/pin') },
        { icon: '📱', label: 'Ubah Nomor HP', desc: 'Verifikasi nomor baru', action: () => {} },
      ]
    },
    {
      title: 'Keamanan',
      items: [
        { icon: '🔔', label: 'Notifikasi', desc: 'Atur preferensi notifikasi', action: () => {} },
        { icon: '🛡️', label: 'Riwayat Login', desc: 'Lihat aktivitas login', action: () => {} },
        { icon: '📋', label: 'Perangkat Terhubung', desc: 'Kelola perangkat', action: () => {} },
      ]
    },
    {
      title: 'Lainnya',
      items: [
        { icon: '❓', label: 'Bantuan', desc: 'FAQ dan panduan', action: () => {} },
        { icon: '📄', label: 'Syarat & Ketentuan', desc: 'Baca kebijakan layanan', action: () => {} },
        { icon: '🔒', label: 'Kebijakan Privasi', desc: 'Perlindungan data Anda', action: () => {} },
      ]
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="lg:hidden bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white">
        <div className="px-5 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl">
              {phone ? phone.charAt(1).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">Pengguna SIM Online</h1>
              <p className="text-slate-300 text-sm">{phone || 'Nomor tidak tersedia'}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                nikVerified
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {nikVerified ? '✓ NIK Terverifikasi' : '⚠ NIK Belum Verifikasi'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="hidden lg:block">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4">
                  {phone ? phone.charAt(1).toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pengguna SIM Online</h2>
                <p className="text-gray-500 text-sm">{phone || 'Nomor tidak tersedia'}</p>
                <span className={`inline-block mt-3 px-4 py-1.5 text-sm font-medium rounded-full ${
                  nikVerified
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {nikVerified ? '✓ NIK Terverifikasi' : '⚠ NIK Belum Verifikasi'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-xs text-gray-900 truncate max-w-[150px]">
                    {userId || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Status</span>
                  <span className="text-emerald-600 font-medium">Aktif</span>
                </div>
                {profile?.created_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">Bergabung</span>
                    <span className="text-gray-900">
                      {new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Keluar dari Akun
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="lg:hidden card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-xs text-gray-900 truncate max-w-[200px]">
                    {userId || '-'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(userId);
                    Swal.fire({ icon: 'success', title: 'Disalin!', timer: 1000, showConfirmButton: false });
                  }}
                  className="text-blue-600 text-sm font-medium"
                >
                  Salin
                </button>
              </div>
            </div>

            {menuItems.map((section, sectionIndex) => (
              <section key={sectionIndex} className="card overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{item.label}</h4>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              item.badge.color === 'emerald'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </section>
            ))}

            <div className="lg:hidden">
              <button
                onClick={handleLogout}
                className="w-full py-4 rounded-xl font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                Keluar dari Akun
              </button>
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-gray-400">SIM Online v1.0.0</p>
              <p className="text-xs text-gray-400">© 2024 Layanan Lalu Lintas</p>
            </div>
          </div>
        </div>
      </main>

      {showNikModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verifikasi NIK</h3>
            <p className="text-gray-600 text-sm mb-6">
              Masukkan NIK (Nomor Induk Kependudukan) 16 digit Anda untuk verifikasi.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
              <input
                type="text"
                value={nikInput}
                onChange={(e) => setNikInput(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="3201010101010001"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-mono"
                maxLength={16}
              />
              <p className="mt-2 text-xs text-gray-500">{nikInput.length}/16 digit</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNikModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleVerifyNik}
                disabled={verifyingNik || nikInput.length !== 16}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all ${
                  !verifyingNik && nikInput.length === 16
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {verifyingNik ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const serviceCards = [
  {
    href: '/dashboard/new',
    title: 'Pembuatan SIM Baru',
    description: 'Pengajuan pembuatan SIM untuk pemohon pertama kali',
    icon: '🆕',
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    shadow: 'shadow-blue-500/30',
  },
  {
    href: '/dashboard/renew',
    title: 'Perpanjang SIM',
    description: 'Perpanjangan masa berlaku SIM yang akan habis',
    icon: '♻️',
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    shadow: 'shadow-emerald-500/30',
  },
  {
    href: '/dashboard/lost',
    title: 'Kehilangan SIM',
    description: 'Laporan kehilangan dan penggantian kartu SIM',
    icon: '🆘',
    gradient: 'from-amber-500 via-orange-500 to-orange-600',
    shadow: 'shadow-amber-500/30',
  },
  {
    href: '/dashboard/profile',
    title: 'Profil Saya',
    description: 'Kelola data akun dan pengaturan keamanan',
    icon: '👤',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    shadow: 'shadow-slate-500/30',
  },
];

const statusColors = {
  diajukan: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  diperiksa: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  disetujui: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  proses_ujian: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  ujian_gagal: { bg: 'bg-red-500/20', text: 'text-red-400' },
  selesai: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  ditolak: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

const statusLabels = {
  diajukan: 'Diajukan',
  diperiksa: 'Diperiksa',
  disetujui: 'Disetujui',
  proses_ujian: 'Proses Ujian',
  ujian_gagal: 'Ujian Gagal',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export default function DashboardHome() {
  const [pendaftaran, setPendaftaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  });

  useEffect(() => {
    fetchPendaftaran();
  }, []);

  const fetchPendaftaran = async () => {
    try {
      const response = await api.get('/api/pendaftaran?limit=10');
      const data = await response.json();

      if (data.success && data.data) {
        const list = data.data.pendaftaran || data.data || [];
        setPendaftaran(list);

        const total = list.length;
        const selesai = list.filter(p => p.status === 'selesai').length;
        const ditolak = list.filter(p => p.status === 'ditolak' || p.status === 'ujian_gagal').length;
        const diproses = total - selesai - ditolak;

        setStats({ total, diproses, selesai, ditolak });
      }
    } catch (error) {
      console.error('Error fetching pendaftaran:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: 'Total Pengajuan', value: stats.total.toString(), change: '', positive: true },
    { label: 'Diproses', value: stats.diproses.toString(), change: '', positive: true },
    { label: 'Selesai', value: stats.selesai.toString(), change: '', positive: true },
    { label: 'Ditolak', value: stats.ditolak.toString(), change: '', positive: false },
  ];

  return (
    <div className="min-h-screen">
      <header className="lg:hidden px-5 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">SIM Online</h1>
              <p className="text-blue-100 text-sm">Selamat datang kembali!</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <section className="hidden lg:block mb-8 fade-in">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Ringkasan</h3>
          <div className="grid grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`card p-6 stagger-${index + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Layanan SIM</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {serviceCards.map((card, index) => (
              <Link
                key={card.href}
                href={card.href}
                className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${card.gradient} text-white shadow-xl ${card.shadow} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] fade-in stagger-${index + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                  <h4 className="font-bold text-lg mb-2">{card.title}</h4>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{card.description}</p>

                  <div className="flex items-center justify-end">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pendaftaran Saya</h3>
            <Link href="/dashboard/new" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
              + Buat Baru
            </Link>
          </div>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memuat data...
                </div>
              </div>
            ) : pendaftaran.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📋</span>
                </div>
                <h4 className="font-semibold text-slate-100 mb-2">Belum Ada Pendaftaran</h4>
                <p className="text-slate-400 text-sm mb-4">Mulai daftar SIM baru dengan klik tombol di bawah</p>
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>🆕</span> Daftar SIM Baru
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden lg:grid grid-cols-5 gap-4 px-6 py-4 bg-slate-700/50 text-sm font-semibold text-slate-400 border-b border-slate-600">
                  <span>Kode Pendaftaran</span>
                  <span>Jenis SIM</span>
                  <span>Tanggal Ujian</span>
                  <span>Status</span>
                  <span>Aksi</span>
                </div>

                {pendaftaran.map((item) => (
                  <div
                    key={item.pendaftaran_id}
                    className="flex flex-col lg:grid lg:grid-cols-5 gap-2 lg:gap-4 px-6 py-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <span className="lg:hidden text-xs text-slate-500">Kode: </span>
                      <span className="font-mono text-sm font-medium text-slate-100">
                        {item.kode_pendaftaran || item.pendaftaran_id?.substring(0, 10)}
                      </span>
                    </div>
                    <div>
                      <span className="lg:hidden text-xs text-slate-500">Jenis: </span>
                      <span className="text-slate-200 font-medium">
                        SIM {item.jenis_sim?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="lg:hidden text-xs text-slate-500">Tanggal: </span>
                      <span className="text-slate-400">
                        {item.tanggal_ujian
                          ? new Date(item.tanggal_ujian).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${statusColors[item.status]?.bg || 'bg-slate-700'}
                        ${statusColors[item.status]?.text || 'text-slate-300'}
                      `}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </div>
                    <div>
                      <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Detail</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <section className="fade-in">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 lg:p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2">Butuh Bantuan?</h3>
                <p className="text-white/80 max-w-xl">Tim support kami siap membantu Anda 24/7. Hubungi melalui berbagai kanal yang tersedia.</p>
              </div>
              <button className="flex-shrink-0 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Hubungi Support
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

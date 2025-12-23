'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import api from '@/lib/api';

const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-700 rounded-xl flex items-center justify-center">
      <div className="flex items-center gap-2 text-slate-400">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Memuat peta...
      </div>
    </div>
  ),
});

const simTypes = [
  { type: 'a', title: 'SIM A', desc: 'Kendaraan roda 4 penumpang pribadi', price: 'Rp 120.000', popular: false, category: 'Mobil' },
  { type: 'a_umum', title: 'SIM A Umum', desc: 'Kendaraan roda 4 penumpang umum', price: 'Rp 120.000', popular: false, category: 'Mobil' },
  { type: 'bi', title: 'SIM B1', desc: 'Kendaraan roda 4 barang (< 3.500 kg)', price: 'Rp 120.000', popular: false, category: 'Truk' },
  { type: 'bi_umum', title: 'SIM B1 Umum', desc: 'Kendaraan roda 4 barang umum', price: 'Rp 120.000', popular: false, category: 'Truk' },
  { type: 'bii', title: 'SIM B2', desc: 'Kendaraan roda 4 barang (> 3.500 kg)', price: 'Rp 120.000', popular: false, category: 'Truk' },
  { type: 'bii_umum', title: 'SIM B2 Umum', desc: 'Kendaraan roda 4 barang besar umum', price: 'Rp 120.000', popular: false, category: 'Truk' },
  { type: 'c', title: 'SIM C', desc: 'Sepeda motor (> 250 cc)', price: 'Rp 100.000', popular: true, category: 'Motor' },
  { type: 'ci', title: 'SIM C1', desc: 'Sepeda motor (100-250 cc)', price: 'Rp 100.000', popular: false, category: 'Motor' },
  { type: 'cii', title: 'SIM C2', desc: 'Sepeda motor (< 100 cc)', price: 'Rp 100.000', popular: false, category: 'Motor' },
  { type: 'd', title: 'SIM D', desc: 'Kendaraan khusus penyandang disabilitas', price: 'Rp 50.000', popular: false, category: 'Khusus' },
  { type: 'di', title: 'SIM D1', desc: 'Kendaraan motor penyandang disabilitas', price: 'Rp 50.000', popular: false, category: 'Khusus' },
];

const requirements = [
  { icon: '🪪', title: 'KTP/NIK Terverifikasi', desc: 'NIK harus sudah terverifikasi di profil Anda' },
  { icon: '📋', title: 'Usia Minimal', desc: 'Sesuai golongan SIM (17-21 tahun)' },
  { icon: '❤️', title: 'Sehat Jasmani', desc: 'Surat keterangan sehat dari dokter' },
  { icon: '📸', title: 'Pas Foto', desc: 'Foto 4x6 background merah' },
];

export default function NewSimPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [satpasList, setSatpasList] = useState([]);
  const [loadingSatpas, setLoadingSatpas] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [selectedSimType, setSelectedSimType] = useState('');
  const [selectedSatpas, setSelectedSatpas] = useState(null);
  const [tanggalUjian, setTanggalUjian] = useState('');

  const steps = [
    { number: 1, title: 'Pilih Jenis SIM', status: step > 1 ? 'completed' : step === 1 ? 'current' : 'pending' },
    { number: 2, title: 'Pilih Satpas', status: step > 2 ? 'completed' : step === 2 ? 'current' : 'pending' },
    { number: 3, title: 'Jadwal Ujian', status: step > 3 ? 'completed' : step === 3 ? 'current' : 'pending' },
    { number: 4, title: 'Konfirmasi', status: step === 4 ? 'current' : 'pending' },
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchSatpas();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/auth/users/me');
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchSatpas = async () => {
    try {
      const response = await api.get('/api/satpas?limit=100');
      const data = await response.json();
      if (data.success && data.data) {
        setSatpasList(data.data.satpas || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching satpas:', error);
    } finally {
      setLoadingSatpas(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSimType || !selectedSatpas || !tanggalUjian) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Harap lengkapi semua data pendaftaran',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/pendaftaran', {
        satpas_id: selectedSatpas.satpas_id,
        jenis_sim: selectedSimType,
        tanggal_ujian: tanggalUjian,
      });

      const data = await response.json();

      if (data.success) {
        if (data.csrf_token) {
          localStorage.setItem('csrfToken', data.csrf_token);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil',
          text: `Pendaftaran SIM ${selectedSimType.toUpperCase()} Anda telah berhasil diajukan. Kode pendaftaran: ${data.data?.kode_pendaftaran || 'N/A'}`,
          confirmButtonColor: '#3B82F6',
        });
        router.push('/dashboard');
      } else {
        const err =
          typeof data?.errors === 'string' ? data.errors
          : Array.isArray(data?.errors) ? data.errors.join(', ')
          : (data?.errors && typeof data.errors === 'object') ? Object.values(data.errors).flat().join(', ')
          : data?.message || 'Gagal melakukan pendaftaran';
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err,
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error('Error submitting:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Terjadi kesalahan saat mengirim pendaftaran',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  const nikVerified = Boolean(userProfile?.nik);

  return (
    <div className="min-h-screen">
      <header className="lg:hidden px-5 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Pembuatan SIM Baru</h1>
            <p className="text-blue-100 text-sm">Langkah {step} dari 4</p>
          </div>
        </div>
      </header>

      <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="hidden lg:block mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Langkah Pengajuan</h3>
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      ${s.status === 'completed' ? 'bg-emerald-500 text-white' :
                        s.status === 'current' ? 'bg-blue-600 text-white' :
                          'bg-slate-700 text-slate-400'}`}>
                      {s.status === 'completed' ? '✓' : s.number}
                    </div>
                    <span className={`font-medium ${s.status === 'current' ? 'text-blue-400' : 'text-slate-200'}`}>{s.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!nikVerified && !loadingProfile && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-amber-400">NIK Belum Terverifikasi</h4>
                <p className="text-sm text-amber-300/80 mt-1">
                  Anda harus memverifikasi NIK terlebih dahulu sebelum dapat mendaftar SIM.
                </p>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="mt-2 text-sm font-medium text-amber-400 hover:underline"
                >
                  Verifikasi NIK di Profil →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                <section className="card p-6">
                  <h2 className="font-bold text-lg text-slate-100 mb-4">Persyaratan Umum</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                        <span className="text-2xl">{req.icon}</span>
                        <div>
                          <h4 className="font-semibold text-slate-100">{req.title}</h4>
                          <p className="text-sm text-slate-400">{req.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card p-6">
                  <h2 className="font-bold text-lg text-slate-100 mb-4">Pilih Jenis SIM</h2>
                  
                  {/* Group SIM by category */}
                  {['Motor', 'Mobil', 'Truk', 'Khusus'].map((category) => {
                    const categoryItems = simTypes.filter(sim => sim.category === category);
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-6 last:mb-0">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          {category === 'Motor' && '🏍️'}
                          {category === 'Mobil' && '🚗'}
                          {category === 'Truk' && '🚚'}
                          {category === 'Khusus' && '♿'}
                          {category}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {categoryItems.map((sim) => (
                            <div
                              key={sim.type}
                              onClick={() => setSelectedSimType(sim.type)}
                              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg
                                ${selectedSimType === sim.type
                                  ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                                  : sim.popular
                                    ? 'border-blue-400/50 bg-blue-500/5'
                                    : 'border-slate-600 hover:border-blue-400'}`}
                            >
                              {sim.popular && (
                                <span className="absolute -top-2 right-4 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                                  Populer
                                </span>
                              )}
                              <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                  {sim.type.replace('_umum', '').replace('ii', '2').replace('i', '1').toUpperCase()}
                                </div>
                                <span className="font-bold text-blue-400 text-sm">{sim.price}</span>
                              </div>
                              <h4 className="font-semibold text-slate-100 text-sm">{sim.title}</h4>
                              <p className="text-xs text-slate-400 line-clamp-2">{sim.desc}</p>
                              {selectedSimType === sim.type && (
                                <div className="absolute top-2 left-2">
                                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              </>
            )}

            {step === 2 && (
              <section className="card p-6">
                <h2 className="font-bold text-lg text-slate-100 mb-4">Pilih Lokasi Satpas</h2>
                <p className="text-slate-400 mb-4">Klik marker pada peta untuk memilih lokasi Satpas terdekat Anda.</p>

                {loadingSatpas ? (
                  <div className="w-full h-[400px] bg-slate-700 rounded-xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memuat data satpas...
                    </div>
                  </div>
                ) : satpasList.length === 0 ? (
                  <div className="w-full h-[400px] bg-slate-700 rounded-xl flex items-center justify-center">
                    <p className="text-slate-400">Tidak ada data satpas tersedia</p>
                  </div>
                ) : (
                  <MapWithNoSSR
                    satpasList={satpasList}
                    selectedSatpas={selectedSatpas}
                    onSelectSatpas={setSelectedSatpas}
                  />
                )}

                {selectedSatpas && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100">{selectedSatpas.name}</h4>
                        <p className="text-sm text-slate-400">
                          {Number(selectedSatpas.latitude)?.toFixed(6)}, {Number(selectedSatpas.longitude)?.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 3 && (
              <section className="card p-6">
                <h2 className="font-bold text-lg text-slate-100 mb-4">Pilih Tanggal Ujian</h2>
                <p className="text-slate-400 mb-4">Pilih tanggal ujian minimal 7 hari dari sekarang.</p>

                <div className="max-w-sm">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tanggal Ujian</label>
                  <input
                    type="date"
                    value={tanggalUjian}
                    onChange={(e) => setTanggalUjian(e.target.value)}
                    min={minDateStr}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-slate-100"
                  />
                </div>

                {tanggalUjian && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100">Tanggal Terpilih</h4>
                        <p className="text-sm text-slate-400">
                          {new Date(tanggalUjian).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 4 && (
              <section className="card p-6">
                <h2 className="font-bold text-lg text-slate-100 mb-4">Konfirmasi Pendaftaran</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-xl">
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Jenis SIM</h4>
                    <p className="font-semibold text-slate-100">SIM {selectedSimType?.toUpperCase()}</p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-xl">
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Lokasi Satpas</h4>
                    <p className="font-semibold text-slate-100">{selectedSatpas?.name}</p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-xl">
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Tanggal Ujian</h4>
                    <p className="font-semibold text-slate-100">
                      {tanggalUjian && new Date(tanggalUjian).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg text-slate-100 mb-4">Ringkasan</h3>

              <div className="space-y-3 mb-6">
                {selectedSimType && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Jenis SIM</span>
                    <span className="font-medium text-slate-100">SIM {selectedSimType.toUpperCase()}</span>
                  </div>
                )}
                {selectedSatpas && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Satpas</span>
                    <span className="font-medium text-slate-100 text-right max-w-[150px] truncate">{selectedSatpas.name}</span>
                  </div>
                )}
                {tanggalUjian && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Tanggal</span>
                    <span className="font-medium text-slate-100">{new Date(tanggalUjian).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-3 border-2 border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Kembali
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && !selectedSimType) {
                        Swal.fire({ icon: 'warning', title: 'Pilih Jenis SIM', text: 'Silakan pilih jenis SIM terlebih dahulu', confirmButtonColor: '#3B82F6' });
                        return;
                      }
                      if (step === 2 && !selectedSatpas) {
                        Swal.fire({ icon: 'warning', title: 'Pilih Satpas', text: 'Silakan pilih lokasi Satpas terlebih dahulu', confirmButtonColor: '#3B82F6' });
                        return;
                      }
                      if (step === 3 && !tanggalUjian) {
                        Swal.fire({ icon: 'warning', title: 'Pilih Tanggal', text: 'Silakan pilih tanggal ujian terlebih dahulu', confirmButtonColor: '#3B82F6' });
                        return;
                      }
                      setStep(step + 1);
                    }}
                    disabled={!nikVerified}
                    className={`flex-1 py-3 font-semibold rounded-xl transition-all ${nikVerified
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Lanjutkan
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !nikVerified}
                    className={`flex-1 py-3 font-semibold rounded-xl transition-all ${!loading && nikVerified
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

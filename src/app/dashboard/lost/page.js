'use client';

import { useState } from 'react';

export default function LostSimPage() {
  const [selectedReason, setSelectedReason] = useState('');

  const lossReasons = [
    { id: 'theft', icon: '🔓', title: 'Pencurian', desc: 'SIM hilang karena dicuri' },
    { id: 'lost', icon: '❓', title: 'Kehilangan', desc: 'SIM hilang tidak diketahui' },
    { id: 'damaged', icon: '💔', title: 'Rusak', desc: 'SIM rusak atau tidak terbaca' },
    { id: 'other', icon: '📝', title: 'Lainnya', desc: 'Alasan lain' },
  ];

  const steps = [
    { number: 1, title: 'Isi Formulir', desc: 'Lengkapi data laporan kehilangan' },
    { number: 2, title: 'Upload Bukti', desc: 'Surat kehilangan dari kepolisian' },
    { number: 3, title: 'Verifikasi', desc: 'Tim kami akan memverifikasi' },
    { number: 4, title: 'Pengajuan Baru', desc: 'Proses pembuatan SIM pengganti' },
  ];

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden px-5 pt-6 pb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-orange-700 text-white">
        <h1 className="text-xl font-bold">Kehilangan SIM</h1>
        <p className="text-amber-100 text-sm mt-1">Laporan kehilangan dan penggantian SIM</p>
      </header>

      <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Warning Banner */}
            <div className="card p-6 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Perhatian!</h3>
                  <p className="text-sm text-slate-300">
                    Untuk laporan kehilangan, Anda memerlukan surat keterangan kehilangan dari kepolisian. 
                    Pastikan Anda sudah membuat laporan di kantor polisi terdekat.
                  </p>
                </div>
              </div>
            </div>

            {/* Loss Reason Selection */}
            <section className="card p-6">
              <h2 className="font-bold text-lg text-white mb-4">Alasan Kehilangan</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {lossReasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg
                      ${selectedReason === reason.id 
                        ? 'border-amber-500 bg-amber-900/30' 
                        : 'border-slate-600 hover:border-amber-500/50 bg-slate-800/50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{reason.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{reason.title}</h4>
                        <p className="text-sm text-slate-400">{reason.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Report Form Preview */}
            <section className="card p-6">
              <h2 className="font-bold text-lg text-white mb-4">Formulir Laporan</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nomor SIM yang Hilang
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nomor SIM"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Jenis SIM
                  </label>
                  <select className="input-field">
                    <option value="">Pilih jenis SIM</option>
                    <option value="A">SIM A</option>
                    <option value="B1">SIM B1</option>
                    <option value="C">SIM C</option>
                    <option value="D">SIM D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tanggal Kehilangan
                  </label>
                  <input 
                    type="date" 
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Kronologi Kejadian
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Jelaskan kronologi kehilangan SIM Anda..."
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Surat Kehilangan
                  </label>
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer bg-slate-800/50">
                    <div className="w-12 h-12 mx-auto bg-amber-800/50 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-amber-400">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Steps */}
            <div className="card p-6">
              <h3 className="font-bold text-lg text-white mb-4">Proses Pelaporan</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-800/50 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Card */}
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg text-white mb-4">Biaya Penggantian</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Biaya Admin</span>
                  <span className="font-medium text-slate-200">Rp 30.000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Biaya SIM Baru</span>
                  <span className="font-medium text-slate-200">Sesuai jenis</span>
                </div>
                <hr className="border-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-300">Estimasi</span>
                  <span className="font-bold text-lg text-amber-400">Rp 130.000</span>
                </div>
              </div>
              <button 
                disabled={!selectedReason}
                className={`w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98]
                  ${selectedReason 
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Laporkan Kehilangan
              </button>
            </div>

            {/* Contact */}
            <div className="card p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-800/50 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Hotline Darurat</h4>
                  <p className="text-sm text-slate-300 mb-2">Lapor cepat ke call center</p>
                  <a href="tel:14020" className="text-lg font-bold text-amber-400 hover:underline">14020</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

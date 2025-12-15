export default function RenewSimPage() {
  const simData = [
    { type: 'C', number: '1234-5678-9012', expiry: '25 Jan 2025', status: 'expiring', daysLeft: 42 },
    { type: 'A', number: '9876-5432-1098', expiry: '15 Mar 2026', status: 'active', daysLeft: 456 },
  ];

  const steps = [
    { icon: '📝', title: 'Pilih SIM', desc: 'Pilih SIM yang akan diperpanjang' },
    { icon: '📤', title: 'Upload Dokumen', desc: 'KTP dan SIM lama' },
    { icon: '💳', title: 'Pembayaran', desc: 'Bayar biaya perpanjangan' },
    { icon: '📅', title: 'Jadwal', desc: 'Pilih waktu pengambilan' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'expiring':
        return 'bg-amber-100 text-amber-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  const getStatusLabel = (status, daysLeft) => {
    switch (status) {
      case 'expiring':
        return `Expired dalam ${daysLeft} hari`;
      case 'expired':
        return 'Sudah Expired';
      default:
        return 'Aktif';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden px-5 pt-6 pb-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <h1 className="text-xl font-bold">Perpanjang SIM</h1>
        <p className="text-emerald-100 text-sm mt-1">Perpanjangan masa berlaku SIM</p>
      </header>

      <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Banner */}
            <div className="card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Informasi Perpanjangan</h3>
                  <p className="text-sm text-gray-600">
                    Perpanjangan SIM dapat dilakukan maksimal 1 tahun sebelum masa berlaku habis. 
                    Pastikan dokumen Anda masih berlaku.
                  </p>
                </div>
              </div>
            </div>

            {/* My SIM Cards */}
            <section className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">SIM Saya</h2>
              <div className="space-y-4">
                {simData.map((sim, index) => (
                  <div 
                    key={index}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg
                      ${sim.status === 'expiring' 
                        ? 'border-amber-300 bg-amber-50/50' 
                        : 'border-gray-200 hover:border-emerald-300'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                          {sim.type}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">SIM {sim.type}</h4>
                          <p className="text-sm text-gray-500 font-mono">{sim.number}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Berlaku hingga: <span className="font-medium">{sim.expiry}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(sim.status)}`}>
                          {getStatusLabel(sim.status, sim.daysLeft)}
                        </span>
                        {sim.status === 'expiring' && (
                          <button className="block mt-3 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all">
                            Perpanjang Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Steps */}
            <section className="card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Langkah Perpanjangan</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div key={index} className="text-center p-4">
                    <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="w-8 h-8 mx-auto -mt-6 mb-2 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <div className="card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Dokumen Diperlukan</h3>
              <ul className="space-y-3">
                {[
                  { icon: '🪪', text: 'KTP yang masih berlaku' },
                  { icon: '💳', text: 'SIM lama' },
                  { icon: '📸', text: 'Pas foto 4x6 (opsional)' },
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Biaya Perpanjangan</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Biaya SIM C</span>
                  <span className="font-medium text-gray-900">Rp 75.000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Biaya SIM A/B1</span>
                  <span className="font-medium text-gray-900">Rp 80.000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Biaya Admin</span>
                  <span className="font-medium text-gray-900">Rp 30.000</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Ajukan Perpanjangan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

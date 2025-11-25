import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Pilih layanan SIM</p>
      </header>

      <main className="px-5 pb-24 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard/new" className="rounded-2xl p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md active:scale-[0.98] transition">
            <div className="text-3xl mb-2">🆕</div>
            <div className="font-semibold">Pembuatan SIM Baru</div>
            <div className="text-sm text-blue-100 mt-1">Pengajuan pertama kali</div>
          </Link>

          <Link href="/dashboard/renew" className="rounded-2xl p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md active:scale-[0.98] transition">
            <div className="text-3xl mb-2">♻️</div>
            <div className="font-semibold">Perpanjang SIM</div>
            <div className="text-sm text-emerald-100 mt-1">Perpanjangan masa berlaku</div>
          </Link>

          <Link href="/dashboard/lost" className="rounded-2xl p-4 bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md active:scale-[0.98] transition">
            <div className="text-3xl mb-2">🆘</div>
            <div className="font-semibold">Kehilangan SIM</div>
            <div className="text-sm text-amber-100 mt-1">Laporan & penggantian</div>
          </Link>

          <Link href="/dashboard/profile" className="rounded-2xl p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-md active:scale-[0.98] transition">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold">Profil</div>
            <div className="text-sm text-slate-200 mt-1">Data akun & keamanan</div>
          </Link>
        </div>
      </main>
    </div>
  );
}

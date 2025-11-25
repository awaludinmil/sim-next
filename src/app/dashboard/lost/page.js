export default function LostSimPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-gray-900">Kehilangan SIM</h1>
        <p className="text-gray-600 mt-1 text-sm">Laporan kehilangan dan penggantian SIM</p>
      </header>

      <main className="px-5 pb-24 max-w-md mx-auto space-y-4">
        <section className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <h2 className="font-semibold text-amber-800 mb-2">Petunjuk</h2>
          <ol className="list-decimal list-inside text-sm text-amber-900 space-y-1">
            <li>Buat laporan kehilangan</li>
            <li>Unggah bukti/berita acara</li>
            <li>Ajukan penggantian kartu</li>
          </ol>
        </section>

        <button className="w-full py-4 rounded-xl bg-amber-600 text-white font-semibold shadow-md active:scale-[0.98]">
          Laporkan Kehilangan
        </button>
      </main>
    </div>
  );
}

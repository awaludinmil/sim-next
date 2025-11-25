export default function RenewSimPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-gray-900">Perpanjang SIM</h1>
        <p className="text-gray-600 mt-1 text-sm">Perpanjangan masa berlaku SIM</p>
      </header>

      <main className="px-5 pb-24 max-w-md mx-auto space-y-4">
        <section className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h2 className="font-semibold text-emerald-800 mb-2">Informasi</h2>
          <p className="text-sm text-emerald-900">Perpanjangan dapat dilakukan sebelum masa berlaku berakhir.</p>
        </section>

        <section className="p-4 rounded-2xl bg-white border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Dokumen</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>SIM lama</li>
            <li>KTP yang masih berlaku</li>
          </ul>
        </section>

        <button className="w-full py-4 rounded-xl bg-emerald-600 text-white font-semibold shadow-md active:scale-[0.98]">
          Ajukan Perpanjangan
        </button>
      </main>
    </div>
  );
}

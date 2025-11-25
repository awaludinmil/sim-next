export default function NewSimPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-gray-900">Pembuatan SIM Baru</h1>
        <p className="text-gray-600 mt-1 text-sm">Pengajuan pembuatan SIM untuk pemohon baru</p>
      </header>

      <main className="px-5 pb-24 max-w-md mx-auto space-y-4">
        <section className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <h2 className="font-semibold text-blue-800 mb-2">Persyaratan Umum</h2>
          <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
            <li>KTP/Identitas diri yang masih berlaku</li>
            <li>Usia minimal sesuai golongan SIM</li>
            <li>Sehat jasmani dan rohani</li>
          </ul>
        </section>

        <section className="p-4 rounded-2xl bg-white border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Langkah Pengajuan</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Isi data diri dan alamat</li>
            <li>Unggah dokumen yang diminta</li>
            <li>Jadwalkan ujian teori/praktik</li>
          </ol>
        </section>

        <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md active:scale-[0.98]">
          Mulai Pengajuan
        </button>
      </main>
    </div>
  );
}

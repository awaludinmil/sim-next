'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const statusColors = {
    diajukan: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    diperiksa: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    disetujui: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    proses_ujian: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    ujian_gagal: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    selesai: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    ditolak: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
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

export default function RiwayatTransaksiPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_items: 0,
        total_pages: 1,
        current_page: 1,
        limit: 10,
        has_next: false,
        has_prev: false,
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/api/pendaftaran?page=${page}&limit=10`);
            const data = await response.json();

            if (data.success && data.data) {
                setTransactions(data.data);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchTransactions(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen">
            {/* Mobile Header */}
            <header className="lg:hidden px-5 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📋</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Riwayat Transaksi</h1>
                        <p className="text-blue-100 text-sm">Lihat semua pendaftaran Anda</p>
                    </div>
                </div>
            </header>

            <main className="px-5 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="hidden lg:block">
                        <h2 className="text-2xl font-bold text-slate-100 mb-1">Riwayat Transaksi</h2>
                        <p className="text-slate-400">Semua riwayat pendaftaran SIM Anda</p>
                    </div>
                    <Link
                        href="/dashboard/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        <span>➕</span> Buat Pendaftaran Baru
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card p-4">
                        <p className="text-xs text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-100">{pagination.total_items}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs text-slate-400 mb-1">Diproses</p>
                        <p className="text-2xl font-bold text-amber-400">
                            {transactions.filter(t => ['diajukan', 'diperiksa', 'disetujui'].includes(t.status)).length}
                        </p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs text-slate-400 mb-1">Selesai</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            {transactions.filter(t => t.status === 'selesai').length}
                        </p>
                    </div>
                    <div className="card p-4">
                        <p className="text-xs text-slate-400 mb-1">Ditolak</p>
                        <p className="text-2xl font-bold text-red-400">
                            {transactions.filter(t => ['ditolak', 'ujian_gagal'].includes(t.status)).length}
                        </p>
                    </div>
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="card p-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="font-medium">Memuat data...</span>
                        </div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-20 h-20 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-4xl">📋</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">Belum Ada Transaksi</h3>
                        <p className="text-slate-400 mb-6">Anda belum memiliki riwayat pendaftaran SIM</p>
                        <Link
                            href="/dashboard/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            <span>🆕</span> Buat Pendaftaran Baru
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.pendaftaran_id}
                                    className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-xl">🎫</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-mono text-sm font-semibold text-slate-100">
                                                            {transaction.kode_pendaftaran}
                                                        </h3>
                                                        <p className="text-xs text-slate-400">
                                                            ID: {transaction.pendaftaran_id.substring(0, 12)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2
                          ${statusColors[transaction.status]?.bg || 'bg-slate-700'}
                          ${statusColors[transaction.status]?.text || 'text-slate-300'}
                          ${statusColors[transaction.status]?.border || 'border-slate-600'}
                        `}
                                            >
                                                {statusLabels[transaction.status] || transaction.status}
                                            </span>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg">🪪</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">Jenis SIM</p>
                                                    <p className="font-bold text-slate-100">SIM {transaction.jenis_sim?.toUpperCase()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg">📅</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">Tanggal Ujian</p>
                                                    <p className="font-semibold text-slate-100 text-sm">
                                                        {transaction.tanggal_ujian
                                                            ? new Date(transaction.tanggal_ujian).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })
                                                            : '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg">🏢</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">SATPAS</p>
                                                    <p className="font-semibold text-slate-100 text-sm">
                                                        {transaction.satpas_name || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-xs text-slate-400">
                                                Dibuat: {formatDate(transaction.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                            <div className="card p-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-400">
                                        Halaman {pagination.current_page} dari {pagination.total_pages}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={!pagination.has_prev}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.has_prev
                                                ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                }`}
                                        >
                                            ← Sebelumnya
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={!pagination.has_next}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.has_next
                                                ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                }`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

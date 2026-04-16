"use client";

import { useEffect, useState } from "react";
import { Download, BarChart2, Package, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";

export default function LaporanPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/laporan/summary")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSummary(data);
        setIsLoading(false);
      });
  }, []);

  const handleExport = () => {
    window.location.href = "/api/laporan/export";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pusat Analitik & Laporan</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan inventaris dan performa stok barang</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
        >
          <Download size={18} />
          Export Data Stok (.CSV)
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-slate-400">
          <RefreshCcw className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Model Barang</p>
              <h3 className="text-3xl font-black text-slate-800">{summary?.totalBarangModel || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Item Stok (Pcs)</p>
              <h3 className="text-3xl font-black text-slate-800">{summary?.totalStokKeseluruhan?.toLocaleString() || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Stok Masuk (Bulan Ini)</p>
              <h3 className="text-3xl font-black text-slate-800">{summary?.pergerakanBulanIni?.masuk?.toLocaleString() || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Stok Keluar (Bulan Ini)</p>
              <h3 className="text-3xl font-black text-slate-800">{summary?.pergerakanBulanIni?.keluar?.toLocaleString() || 0}</h3>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 bg-gradient-to-tr from-slate-900 to-slate-800 p-8 rounded-3xl shadow-lg border border-slate-700 text-white relative overflow-hidden mt-4">
             <div className="relative z-10">
                <p className="text-slate-400 font-medium tracking-widest uppercase text-sm mb-2">Evaluasi Aset Tersimpan</p>
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
                  Rp {summary?.totalNilaiInventaris?.toLocaleString('id-ID') || "0"}
                </h2>
                <p className="text-slate-300 max-w-lg mt-4 leading-relaxed">
                  Angka di atas dihitung berdasarkan harga beli/standar dari setiap Unit Master yang memiliki stok di gudang. Total dihitung secara *real-time*.
                </p>
             </div>
             
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
             <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
          </div>

        </div>
      )}
    </div>
  );
}
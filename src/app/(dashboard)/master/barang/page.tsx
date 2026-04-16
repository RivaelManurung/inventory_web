import React from "react";
import { Plus, Search, Filter, Download, Box, ChevronRight, Edit2, Trash2, QrCode } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BarangPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const search = searchParams?.q || "";

  const barangList = await prisma.barang.findMany({
    where: {
      deletedAt: null,
      OR: [
        { barangNama: { contains: search, mode: "insensitive" } },
        { barangKode: { contains: search, mode: "insensitive" } },
      ]
    },
    include: {
      jenisBarang: true,
      satuan: true,
      barangCategory: true,
      barangGudangs: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalBarang = barangList.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Box className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Master Barang</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola daftar seluruh aset atau stok barang inventory Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/master/barang/qr-bulk" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest shadow-sm">
            <QrCode className="w-4 h-4" /> Cetak QR Bulk
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/master/barang/create" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
            <Plus className="w-4 h-4" /> Tambah Barang
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                      {totalBarang}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Barang</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-200" />
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <form className="relative w-full md:w-96" action="/master/barang" method="GET">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={search}
              placeholder="Cari SKU atau nama..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all shadow-sm font-medium"
            />
          </form>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kode/SKU</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Barang</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Harga</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {barangList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 w-32">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest">{item.barangKode}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/master/barang/${item.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 transition-transform group-hover:scale-105 border border-slate-200 shrink-0">
                            {item.barangGambar ? (
                              <img src={item.barangGambar} alt={item.barangNama} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <Box className="w-4 h-4" />
                            )}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight block">{item.barangNama}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Stok Min: {item.stokMinimum} {item.satuan?.name}</span>
                        </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-600">{item.barangCategory?.name || "-"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-600">{item.jenisBarang?.name || "-"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-700">Rp {Number(item.barangHarga).toLocaleString("id-ID")}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/master/barang/${item.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1" title="Lihat Detail & QR">
                        <QrCode className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {barangList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                    <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Belum Ada Barang</p>
                    <p className="text-xs text-slate-400 mt-1">Silakan tambah barang baru untuk mulai.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Menampilkan {barangList.length} hasil</p>
        </div>
      </div>
    </div>
  );
}
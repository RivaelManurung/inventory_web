import React from "react";
import { Plus, Search, Filter, Download, Scale, ChevronRight, Archive, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SatuanPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const search = searchParams?.q || "";

  const satuan = await prisma.satuan.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ]
    },
    include: {
      _count: {
        select: { barangs: { where: { deletedAt: null } } }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalSatuan = satuan.length;
  const totalItems = satuan.reduce((acc, curr) => acc + curr._count.barangs, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Scale className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Satuan Barang</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola satuan (Pcs, Box, dll) untuk pengukuran barang inventaris.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/master/satuan/create" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
            <Plus className="w-4 h-4" /> Tambah Satuan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                      {totalSatuan}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Satuan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-200" />
          </div>
          {/* other stat blocks can be simplified or changed for aesthetics */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold group-hover:scale-110 transition-transform">
                      {totalItems}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Item Terkait</span>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <form className="relative w-full md:w-96" action="/master/satuan" method="GET">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={search}
              placeholder="Cari nama atau slug..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Slug</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Satuan</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deskripsi</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Items</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {satuan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider">{item.slug}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                            <Scale className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-xs truncate text-sm text-slate-500">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <Archive className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">{item._count.barangs}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

              {satuan.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    Tidak ada satuan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Menampilkan {satuan.length} hasil</p>
        </div>
      </div>
    </div>
  );
}
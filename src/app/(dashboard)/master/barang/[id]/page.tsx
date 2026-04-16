import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Box, ArrowLeft, QrCode, Tag, Package, Download } from "lucide-react";
import Link from "next/link";
import DetailClient from "./DetailClient";

export const dynamic = "force-dynamic";

export default async function DetailBarangPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.barang.findUnique({
    where: { id: params.id, deletedAt: null },
    include: {
      jenisBarang: true,
      satuan: true,
      barangCategory: true,
      barangGudangs: {
        include: {
          gudang: true,
        },
      },
    },
  });

  if (!data) return notFound();

  const totalTersedia = data.barangGudangs.reduce((a, b) => a + b.stokTersedia, 0);
  const totalDipinjam = data.barangGudangs.reduce((a, b) => a + b.stokDipinjam, 0);
  const totalMaintenance = data.barangGudangs.reduce((a, b) => a + b.stokMaintenance, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/master/barang" className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Box className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Detail Asset</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{data.barangKode}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Info Barang */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <div className="flex items-start gap-6 border-b border-slate-100 pb-6 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                {data.barangGambar ? (
                  <img src={data.barangGambar} alt={data.barangNama} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Box className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">{data.barangNama}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {data.barangCategory?.name}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                    {data.jenisBarang?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga Satuan</p>
                <p className="text-sm font-bold text-slate-700">Rp {Number(data.barangHarga).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satuan Pengukuran</p>
                <p className="text-sm font-bold text-slate-700">{data.satuan?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stok Minimal</p>
                <p className="text-sm font-bold text-rose-600">{data.stokMinimum} {data.satuan?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Didaftarkan</p>
                <p className="text-sm font-bold text-slate-700">{new Date(data.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
            </div>
          </div>

          {/* Tabel Stok by Gudang */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Package className="w-4 h-4 text-blue-600" /> Distribusi Stok Gudang
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lokasi Gudang</th>
                    <th className="px-6 py-4 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Tersedia</th>
                    <th className="px-6 py-4 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Dipinjam</th>
                    <th className="px-6 py-4 text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.barangGudangs.map((bg) => (
                    <tr key={bg.gudangId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{bg.gudang?.name}</td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-600">{bg.stokTersedia}</td>
                      <td className="px-6 py-4 text-sm font-black text-amber-600">{bg.stokDipinjam}</td>
                      <td className="px-6 py-4 text-sm font-black text-rose-600">{bg.stokMaintenance}</td>
                    </tr>
                  ))}
                  {data.barangGudangs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50/30">
                        Belum ada stok barang ini di gudang manapun
                      </td>
                    </tr>
                  )}
                  {data.barangGudangs.length > 0 && (
                    <tr className="bg-slate-50 font-black">
                      <td className="px-6 py-4 text-xs text-slate-700 uppercase tracking-widest text-right">TOTAL GABUNGAN :</td>
                      <td className="px-6 py-4 text-sm text-emerald-600">{totalTersedia}</td>
                      <td className="px-6 py-4 text-sm text-amber-600">{totalDipinjam}</td>
                      <td className="px-6 py-4 text-sm text-rose-600">{totalMaintenance}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: QR Code Generator */}
        <div className="lg:col-span-1">
          <DetailClient data={data as any} />
        </div>

      </div>
    </div>
  );
}
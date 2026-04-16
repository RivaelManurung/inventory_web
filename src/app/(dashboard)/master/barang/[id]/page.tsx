import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit2, Package, Tag } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import DetailClient from "./DetailClient";
import DeleteAction from "@/components/actions/DeleteAction";

export const dynamic = "force-dynamic";

export default async function DetailBarangPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.barang.findUnique({
    where: { id, deletedAt: null },
    include: {
      jenisBarang: true,
      satuan: true,
      barangCategory: true,
      barangGudangs: { include: { gudang: true } },
    },
  });
  if (!data) return notFound();

  const totalTersedia = data.barangGudangs.reduce((a, b) => a + b.stokTersedia, 0);
  const totalDipinjam = data.barangGudangs.reduce((a, b) => a + b.stokDipinjam, 0);
  const totalMaintenance = data.barangGudangs.reduce((a, b) => a + b.stokMaintenance, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={data.barangKode} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/master/barang" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Barang</p>
            <h1 className="text-lg font-semibold text-foreground">{data.barangNama}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAction id={data.id} name={data.barangNama} module="barang" />
          <Link href={`/master/barang/${data.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all font-semibold">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Info Utama */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Detail Barang</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 pb-4 mb-4 border-b border-border">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-foreground">{data.barangNama}</h3>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border">
                      <div className={`w-1.5 h-1.5 rounded-full ${data.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={`text-[9px] font-bold uppercase ${data.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {data.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-muted border border-border text-[10px] font-semibold text-muted-foreground rounded uppercase">
                      <Tag className="inline w-2.5 h-2.5 mr-1" />{data.barangCategory?.name}
                    </span>
                    <span className="px-2 py-0.5 bg-muted border border-border text-[10px] font-semibold text-muted-foreground rounded uppercase">
                      {data.jenisBarang?.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">SKU</p>
                  <p className="text-sm font-mono text-foreground">{data.barangKode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Harga Satuan</p>
                  <p className="text-sm font-semibold text-foreground">Rp {Number(data.barangHarga).toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Satuan</p>
                  <p className="text-sm text-foreground">{data.satuan?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Stok Minimum</p>
                  <p className="text-sm font-semibold text-destructive">{data.stokMinimum} {data.satuan?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stok Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Distribusi Stok Gudang</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Lokasi</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-emerald-600 uppercase tracking-[0.2em]">Tersedia</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-amber-500 uppercase tracking-[0.2em]">Dipinjam</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-destructive uppercase tracking-[0.2em] pr-6">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.barangGudangs.map((bg) => (
                    <tr key={bg.gudangId} className="hover:bg-muted/30 transition-colors">
                      <td className="pl-6 pr-4 py-4 text-sm font-medium text-foreground">{bg.gudang?.name}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-emerald-600">{bg.stokTersedia}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-amber-500">{bg.stokDipinjam}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-destructive pr-6">{bg.stokMaintenance}</td>
                    </tr>
                  ))}
                  {data.barangGudangs.length > 0 && (
                    <tr className="bg-muted/30 font-semibold">
                      <td className="pl-6 pr-4 py-3 text-xs text-muted-foreground">Total</td>
                      <td className="px-4 py-3 text-sm text-emerald-600">{totalTersedia}</td>
                      <td className="px-4 py-3 text-sm text-amber-500">{totalDipinjam}</td>
                      <td className="px-4 py-3 text-sm text-destructive pr-6">{totalMaintenance}</td>
                    </tr>
                  )}
                  {data.barangGudangs.length === 0 && (
                    <tr><td colSpan={4} className="h-20 text-center text-sm text-muted-foreground">Belum ada stok di gudang manapun.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* QR Code Side */}
        <div className="lg:col-span-1">
          <DetailClient data={JSON.parse(JSON.stringify(data))} />
        </div>
      </div>
    </div>
  );
}
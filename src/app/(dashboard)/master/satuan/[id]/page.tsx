import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit2, Box } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import DeleteAction from "@/components/actions/DeleteAction";

export const dynamic = "force-dynamic";

export default async function DetailSatuanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.satuan.findUnique({
    where: { id, deletedAt: null },
    include: {
      _count: { select: { barangs: { where: { deletedAt: null } } } },
      barangs: { where: { deletedAt: null }, take: 10, orderBy: { createdAt: "desc" } },
    },
  });
  if (!data) return notFound();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={data.name} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/master/satuan" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Satuan Barang</p>
            <h1 className="text-lg font-semibold text-foreground">{data.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAction id={data.id} name={data.name} module="satuan" />
          <Link href={`/master/satuan/${data.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all font-semibold">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Satuan</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nama</p>
              <p className="text-sm font-medium text-foreground">{data.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Slug</p>
              <p className="text-sm font-mono text-muted-foreground">{data.slug}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Keterangan</p>
              <p className="text-sm text-foreground">{data.description || <span className="text-muted-foreground italic">Belum ada keterangan.</span>}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Terdaftar</p>
              <p className="text-sm font-mono text-muted-foreground">{new Date(data.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <div className="inline-flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 uppercase">Aktif</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Populasi Item</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{data._count.barangs}</p>
            <p className="text-xs text-muted-foreground mt-1">barang menggunakan satuan ini</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Box className="w-3.5 h-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Barang dengan Satuan Ini</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">SKU</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Nama Barang</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-right pr-6">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.barangs.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="pl-6 pr-4 py-4 text-xs font-mono text-muted-foreground">{b.barangKode}</td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{b.barangNama}</td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground text-right pr-6">Rp {Number(b.barangHarga).toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {data.barangs.length === 0 && (
                <tr><td colSpan={3} className="h-20 text-center text-sm text-muted-foreground">Belum ada barang.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

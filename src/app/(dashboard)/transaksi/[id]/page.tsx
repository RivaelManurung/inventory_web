import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Calendar, User as UserIcon, Package } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import HeaderTitle from "@/components/layout/HeaderTitle";

export const dynamic = "force-dynamic";

export default async function DetailTransaksiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.transaction.findUnique({
    where: { id, deletedAt: null },
    include: {
      transactionType: true,
      user: true,
      details: { include: { barang: true, gudang: true } },
    },
  });
  if (!data) return notFound();

  const isMasuk = data.transactionType.slug.includes("masuk");

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={data.transactionCode} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/transaksi" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Operasional / Transaksi</p>
            <h1 className="text-lg font-semibold text-foreground font-mono">{data.transactionCode}</h1>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-semibold uppercase tracking-wider ${
          isMasuk ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
        }`}>
          {data.transactionType.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Detail Items Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Item & Lokasi Mutasi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Barang</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Lokasi Gudang</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center pr-6">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.details.map((detail) => (
                  <tr key={detail.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <p className="text-sm font-medium text-foreground">{detail.barang?.barangNama}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{detail.barang?.barangKode}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{detail.gudang?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center pr-6">
                      <span className={`text-base font-bold ${isMasuk ? "text-emerald-600" : "text-destructive"}`}>
                        {isMasuk ? "+" : "-"}{detail.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.details.length === 0 && (
                  <tr><td colSpan={3} className="h-20 text-center text-sm text-muted-foreground">Tidak ada item dalam transaksi ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="rounded-xl border border-border bg-card overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Header</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tanggal Transaksi</p>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-mono">{format(new Date(data.transactionDate), "dd MMMM yyyy")}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Penanggung Jawab</p>
              <div className="flex items-center gap-2 text-foreground">
                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{data.user.name}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipe</p>
              <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-semibold uppercase tracking-wider ${
                isMasuk ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}>
                {data.transactionType.name}
              </span>
            </div>
            {data.description && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Catatan / Deskripsi</p>
                <p className="text-sm text-foreground">{data.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

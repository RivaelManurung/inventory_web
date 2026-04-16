import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit2, Package } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import DeleteAction from "@/components/actions/DeleteAction";

export const dynamic = "force-dynamic";

export default async function DetailGudangPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await prisma.gudang.findUnique({
    where: { id, deletedAt: null },
    include: {
      barangGudangs: {
        where: { deletedAt: null },
        include: { barang: true },
      },
    },
  });

  if (!data) return notFound();

  const totalItems = data.barangGudangs.length;
  const totalStock = data.barangGudangs.reduce((a, b) => a + b.stokTersedia, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={data.name} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/master/gudang"
            className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Master Data / Gudang
            </p>
            <h1 className="text-lg font-semibold text-foreground">{data.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAction id={data.id} name={data.name} module="gudang" />
          <Link
            href={`/master/gudang/${data.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all font-semibold"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      {/* Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Detail */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              Informasi Lokasi
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Nama Gudang
                </p>
                <p className="text-sm font-medium text-foreground">{data.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Slug
                </p>
                <p className="text-sm font-mono text-muted-foreground">{data.slug}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Deskripsi / Alamat
                </p>
                <p className="text-sm text-foreground">
                  {data.description || <span className="text-muted-foreground italic">Belum ada deskripsi.</span>}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Status
                </p>
                <div className="inline-flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase">Aktif</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Dibuat
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {new Date(data.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Jenis Aset
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-3xl font-bold text-foreground">{totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">model barang</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Total Unit
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-3xl font-bold text-foreground">{totalStock}</p>
              <p className="text-xs text-muted-foreground mt-1">unit fisik tersedia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barang Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Daftar Aset di Lokasi Ini
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">SKU</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Nama Barang</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center pr-6">Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.barangGudangs.map((bg) => (
                <tr key={bg.barangId} className="hover:bg-muted/30 transition-colors">
                  <td className="pl-6 pr-4 py-4 text-xs font-mono text-muted-foreground">{bg.barang?.barangKode}</td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{bg.barang?.barangNama}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-primary text-center pr-6">{bg.stokTersedia}</td>
                </tr>
              ))}
              {data.barangGudangs.length === 0 && (
                <tr>
                  <td colSpan={3} className="h-24 text-center text-sm text-muted-foreground">
                    Tidak ada aset yang terdaftar di lokasi ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

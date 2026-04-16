import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Search, Filter, FileText, ArrowRightLeft, ArrowUpDown, Plus, User } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const search = q || "";

  // Fetching data with N+1 avoidance using 'include'
  const data = await prisma.transaction.findMany({
    where: {
      deletedAt: null,
      AND: [
        {
          OR: [
            { transactionCode: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { transactionType: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        type ? { transactionType: { slug: { contains: type, mode: "insensitive" } } } : {},
      ],
    },
    include: {
      transactionType: true,
      user: true,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500 font-inter">
      <PageHeader
        category="OPERASIONAL"
        title="Riwayat Transaksi"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          <form className="relative" action="/transaksi" method="GET">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              name="q"
              type="text"
              defaultValue={search}
              placeholder="Cari transaksi atau petugas..."
              className="h-8 w-64 pl-8 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            />
          </form>
          {data.length > 0 && (
            <span className="text-xs text-muted-foreground px-1 font-medium">
              {data.length} transaksi
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 bg-card border border-border text-foreground rounded-md text-xs font-medium hover:bg-accent transition-all flex items-center gap-1.5 flex-none">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <Link href="/transaksi/create" className="h-8 px-4 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm flex-none">
            <Plus className="w-3.5 h-3.5" /> Buat Transaksi
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[25%]">
                  <div className="flex items-center gap-1.5">
                    Kode Transaksi <ArrowUpDown className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%] text-center">Tanggal</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%] text-center">Tipe Transaksi</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[25%]">Penanggung Jawab</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[10%] pr-6">Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <Link href={`/transaksi/${item.id}`} className="group/link flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-tight">
                          {item.transactionCode}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center font-mono">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {format(new Date(item.transactionDate), "dd MMM yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded border text-[10px] font-bold min-w-[110px] ${
                        item.transactionType.slug.includes('masuk') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        item.transactionType.slug.includes('keluar') ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        'bg-slate-50 border-slate-100 text-slate-700'
                      }`}>
                        {item.transactionType.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono">
                      <span className="text-[11px] font-semibold text-foreground">{item.user.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center pr-6">
                      <Link href={`/transaksi/${item.id}`} className="inline-flex p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title="Lihat Detail">
                        <FileText className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Plus className="h-5 w-5 opacity-20 rotate-45" />
                      <p className="text-sm">Belum ada aktivitas transaksi.</p>
                    </div>
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
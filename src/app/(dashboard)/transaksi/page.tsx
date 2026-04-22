import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Search, Filter, FileText, ArrowRightLeft, ArrowUpDown, Plus, User, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; startDate?: string; endDate?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q || "";
  const type = params.type || "";
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";
  const currentPage = Number(params.page) || 1;
  const pageSize = 20;

  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.lte = end;
  }

  const whereClause = {
    deletedAt: null,
    AND: [
      {
        OR: [
          { transactionCode: { contains: search, mode: "insensitive" } },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { transactionType: { name: { contains: search, mode: "insensitive" } } },
        ],
      },
      type ? { transactionTypeId: type } : {},
      Object.keys(dateFilter).length > 0 ? { transactionDate: dateFilter } : {},
    ],
  };

  const [data, totalItems, transactionTypes] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause as any,
      include: {
        transactionType: true,
        user: true,
      },
      orderBy: {
        transactionDate: "desc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({
      where: whereClause as any,
    }),
    prisma.transactionType.findMany()
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 font-inter">
      <PageHeader
        category="OPERASIONAL"
        title="Riwayat Transaksi"
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <form className="flex flex-wrap items-center gap-3" action="/transaksi" method="GET">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              type="text"
              defaultValue={search}
              placeholder="Cari transaksi atau petugas..."
              className="h-9 w-64 pl-9 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          
          <select 
            name="type" 
            defaultValue={type}
            className="h-9 px-3 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Semua Jenis Transaksi</option>
            {transactionTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              name="startDate" 
              defaultValue={startDate}
              className="h-9 px-3 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <span className="text-muted-foreground text-sm">-</span>
            <input 
              type="date" 
              name="endDate" 
              defaultValue={endDate}
              className="h-9 px-3 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button type="submit" className="h-9 px-3 bg-card border border-border text-foreground rounded-md text-sm font-medium hover:bg-accent transition-all flex items-center gap-1.5">
            <Filter className="w-4 h-4" /> Filter
          </button>

          <Link href="/transaksi/create" className="ml-auto h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" /> Buat Transaksi
          </Link>
        </form>
        {totalItems > 0 && (
          <div className="text-xs text-muted-foreground font-medium">
            Ditemukan {totalItems} transaksi
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[25%]">
                  <div className="flex items-center gap-1.5">
                    Kode Transaksi <ArrowUpDown className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%] text-center">Tanggal</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%] text-center">Jenis Transaksi</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[25%]">Penanggung Jawab</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[10%] pr-6">Berkas</th>
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
                      <span className="text-xs font-semibold text-muted-foreground">
                        {format(new Date(item.transactionDate), "dd MMM yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded border text-[11px] font-bold min-w-[110px] ${
                        item.transactionType.slug.includes('masuk') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        item.transactionType.slug.includes('keluar') ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        'bg-slate-50 border-slate-100 text-slate-700'
                      }`}>
                        {item.transactionType.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono">
                      <span className="text-sm font-semibold text-foreground">{item.user.name}</span>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> sampai <span className="font-semibold">{Math.min(currentPage * pageSize, totalItems)}</span> dari <span className="font-semibold">{totalItems}</span> data
          </p>
          <div className="flex gap-2">
            <Link
              href={`/transaksi?q=${search}&type=${type}&startDate=${startDate}&endDate=${endDate}&page=${currentPage - 1}`}
              className={`p-2 rounded-md border border-border bg-card transition-colors hover:bg-muted ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/transaksi?q=${search}&type=${type}&startDate=${startDate}&endDate=${endDate}&page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                    currentPage === p 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
            <Link
              href={`/transaksi?q=${search}&type=${type}&startDate=${startDate}&endDate=${endDate}&page=${currentPage + 1}`}
              className={`p-2 rounded-md border border-border bg-card transition-colors hover:bg-muted ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
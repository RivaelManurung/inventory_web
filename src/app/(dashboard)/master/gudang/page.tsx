import React from "react";
import { Search, MapPin, Filter, ArrowUpDown, Plus, Box, Calendar } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default async function GudangPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q || "";

  const gudang = await prisma.gudang.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ]
    },
    include: {
      _count: {
        select: { barangGudangs: { where: { deletedAt: null } } }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500 font-inter">
      <PageHeader
        category="MASTER DATA"
        title="Gudang / Lokasi"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          <form className="relative" action="/master/gudang" method="GET">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              name="q"
              type="text"
              defaultValue={search}
              placeholder="Cari lokasi gudang..."
              className="h-8 w-64 pl-8 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
          </form>
          {gudang.length > 0 && (
            <span className="text-xs text-slate-400 px-1 font-medium">
              {gudang.length} gudang terdaftar
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50 transition-all flex items-center gap-1.5 flex-none">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <Link href="/master/gudang/create" className="h-8 px-4 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm flex-none">
            <Plus className="w-3.5 h-3.5" /> Tambah Gudang
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[30%]">
                  <div className="flex items-center gap-1.5">
                    Gudang / Lokasi <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[30%]">Deskripsi</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[25%]">Kapasitas & Info</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[15%] pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gudang.length > 0 ? (
                gudang.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <Link href={`/master/gudang/${item.id}`} className="group/link flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-tight">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono font-normal">
                          {item.slug}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4 pr-6 text-xs font-normal text-muted-foreground">
                      {item.description || "-"}
                    </td>
                    <td className="px-4 py-4 text-xs font-normal text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{item._count.barangGudangs} barang</span>
                        <span className="text-border">|</span>
                        <span>
                          {item.createdAt.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center pr-6">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase">Aktif</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Plus className="h-5 w-5 opacity-20 rotate-45" />
                      <p className="text-sm">Tidak ada gudang ditemukan.</p>
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
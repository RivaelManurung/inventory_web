import React from "react";
import { Plus, Search, Filter, Scale, Archive, ArrowUpDown } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SatuanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q || "";

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

  return (
    <div className="space-y-4 animate-in fade-in duration-500 font-inter">
      <PageHeader
        category="MASTER DATA"
        title="Satuan Barang"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          <form className="relative" action="/master/satuan" method="GET">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              name="q"
              type="text" 
              defaultValue={search}
              placeholder="Cari satuan..."
              className="h-8 w-64 pl-8 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            />
          </form>
          {satuan.length > 0 && (
            <span className="text-xs text-muted-foreground px-1 font-medium">
              {satuan.length} satuan terdaftar
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 bg-card border border-border text-foreground rounded-md text-xs font-medium hover:bg-accent transition-all flex items-center gap-1.5 flex-none">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <Link href="/master/satuan/create" className="h-8 px-4 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm flex-none">
            <Plus className="w-3.5 h-3.5" /> Tambah Satuan
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[35%]">
                  <div className="flex items-center gap-1.5">
                    Satuan <ArrowUpDown className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[30%]">Deskripsi</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%]">Info Item</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[15%] pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {satuan.length > 0 ? (
                satuan.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <Link href={`/master/satuan/${item.id}`} className="group/link flex items-center gap-3">
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
                    <td className="px-4 py-4 text-sm font-normal text-muted-foreground">
                      <span>{item._count.barangs} item terkait</span>
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
                      <p className="text-sm">Tidak ada satuan ditemukan.</p>
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
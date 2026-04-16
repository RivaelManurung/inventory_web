import React from "react";
import { Search, MapPin, UserPlus, Filter, Mail, Phone, ArrowUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q || "";

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    },
    include: {
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <PageHeader
        category="ADMINISTRASI"
        title="Manajemen Pengguna"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          <form className="relative" action="/users" method="GET">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              name="q"
              type="text"
              defaultValue={search}
              placeholder="Cari nama atau email..."
              className="h-8 w-64 pl-8 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
          </form>
          {users.length > 0 && (
            <span className="text-xs text-slate-400 px-1 font-medium">
              {users.length} personil terdaftar
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50 transition-all flex items-center gap-1.5 flex-none">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <Link href="/users/create" className="h-8 px-4 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm flex-none">
            <Plus className="w-3.5 h-3.5" /> Tambah User
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
                    User / Karyawan <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%] text-center">Jabatan / Role</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[30%]">Kontak & Akses</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[15%] pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4">
                      <Link href={`/users/${user.id}`} className="group/link flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono font-normal tracking-tight">
                          @{user.username}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-1 rounded bg-foreground text-background text-xs font-semibold uppercase tracking-wider min-w-[90px]">
                        {user.role?.name || "Member"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
                        <span>{user.email || "—"}</span>
                        <span className="text-border">|</span>
                        <span>{user.phone || "—"}</span>
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
                      <p className="text-sm">Tidak ada user ditemukan.</p>
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


import React from 'react';
import { 
  Calendar, 
  ChevronDown,
  ArrowUpRight, 
  ArrowDownRight, 
  Package,
  History,
  Activity,
  Search
} from 'lucide-react';
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

import HeaderTitle from "@/components/layout/HeaderTitle";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const search = q || "";

  // Mengambil data Aktivitas asli dari ActivityLog
  // Digabung dengan Transaction untuk detail lebih lengkap jika diperlukan
  const activityLogs = await prisma.activityLog.findMany({
    where: {
      OR: [
        { description: { contains: search, mode: "insensitive" } },
        { action: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ],
      ...(type && type !== "Semua Jenis" ? { action: { contains: type, mode: "insensitive" } } : {}),
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const totalLogs = await prisma.activityLog.count();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <HeaderTitle title="Aktivitas Terkini" />
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{totalLogs} total log aktivitas</span>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <form className="relative flex-1 md:max-w-xs" action="/dashboard" method="GET">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
           <input 
             name="q"
             type="text" 
             defaultValue={search}
             placeholder="Cari aktivitas atau petugas..."
             className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/40 transition-all"
           />
        </form>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Periode</span>
          <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-2 bg-card font-medium text-foreground min-w-[150px] justify-between">
            <span className="text-sm font-mono">{format(new Date(), "yyyy-MM-dd")}</span>
            <Calendar size={14} className="text-muted-foreground" />
          </div>
        </div>

        <div className="relative group">
          <select 
            name="type"
            className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-10 font-medium text-foreground focus:outline-none cursor-pointer hover:bg-accent transition-all text-sm min-w-[140px]"
          >
            <option>Semua Jenis</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
            <option>LOGIN</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        <button className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all text-sm">
          Filter
        </button>
      </div>

      {/* Activity Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[20%]">Waktu</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center w-[12%]">Aksi</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[15%] text-center">Modul</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[18%]">Petugas</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-[35%]">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="pl-6 pr-4 py-4 whitespace-nowrap text-[11px] font-mono font-medium text-muted-foreground">
                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded text-[10px] font-semibold min-w-[80px] uppercase border ${
                      log.action === 'DELETE' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                      log.action === 'CREATE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                      'bg-primary/10 border-primary/20 text-primary'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-[10px] font-semibold text-muted-foreground/60 uppercase group-hover:text-foreground transition-colors">
                    {log.module}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-foreground">{log.user.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">{log.description}</p>
                  </td>
                </tr>
              ))}

              {activityLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Tidak ada record aktivitas ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center py-2 px-1">
           <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{activityLogs.length} record ditampilkan</p>
           <button className="text-[10px] font-semibold text-primary uppercase tracking-wider hover:underline">Export Log Aktivitas ›</button>
      </div>
    </div>
  );
}

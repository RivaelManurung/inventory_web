"use client";

import React, { useState, useEffect } from "react";
import { Activity, Clock, User, Box, Search, Filter, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "UPDATE": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "DELETE": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "LOGIN": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <HeaderTitle title="Log Aktivitas Sistem" />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Administrasi / Keamanan</p>
          <h1 className="text-xl font-bold text-foreground">Audit Trail</h1>
        </div>
        <button 
          onClick={() => fetchLogs(pagination.page)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-accent transition-all disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Waktu</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">User</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Aksi</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Modul</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] pr-6">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 border-b border-border animate-pulse bg-muted/20"></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="pl-6 pr-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          {format(new Date(log.createdAt), "dd MMM yyyy", { locale: idLocale })}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {format(new Date(log.createdAt), "HH:mm:ss")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {log.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground leading-tight">{log.user.name}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">@{log.user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground pr-6 italic group-hover:text-foreground transition-colors">
                      {log.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground text-sm font-medium">
                    Tidak ada aktivitas ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 bg-card/50 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="font-semibold">{logs.length}</span> dari <span className="font-semibold">{pagination.total}</span> audit log
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="p-2 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center px-3 text-xs font-bold text-foreground bg-primary/10 border border-primary/20 rounded-md">
              Halaman {pagination.page} dari {pagination.totalPages}
            </div>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="p-2 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

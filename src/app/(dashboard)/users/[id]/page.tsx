import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit2, Mail, Phone, Calendar, Activity } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import DeleteAction from "@/components/actions/DeleteAction";

export const dynamic = "force-dynamic";

export default async function DetailUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id, deletedAt: null },
    include: {
      role: true,
      activityLogs: { take: 10, orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) return notFound();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={user.name} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/users" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Administrasi / Users</p>
            <h1 className="text-lg font-semibold text-foreground">{user.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAction id={user.id} name={user.name} module="../users" />
          <Link href={`/users/${user.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all font-semibold">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Profil</h2>
            </div>
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 mx-auto flex items-center justify-center text-primary font-bold text-2xl mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">{user.name}</h3>
              <p className="text-xs text-muted-foreground font-mono mb-3">@{user.username}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-semibold uppercase tracking-wider ${
                user.role?.name.toLowerCase() === "admin"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                {user.role?.name}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Kontak</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">{user.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">{user.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Bergabung {new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Log Aktivitas Terakhir</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Waktu</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Aksi</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] pr-6">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {user.activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="pl-6 pr-4 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold uppercase border ${
                        log.action === "DELETE" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                        log.action === "CREATE" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                        "bg-primary/10 border-primary/20 text-primary"
                      }`}>{log.action}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground pr-6">{log.description}</td>
                  </tr>
                ))}
                {user.activityLogs.length === 0 && (
                  <tr><td colSpan={3} className="h-24 text-center text-sm text-muted-foreground">Belum ada catatan aktivitas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

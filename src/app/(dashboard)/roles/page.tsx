import React from "react";
import { Shield, ArrowRight, Settings2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: { users: true, permissions: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        category="ADMINISTRASI"
        title="Manajemen Hak Akses"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div 
            key={role.id}
            className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {role.name}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  {role.slug}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-8 flex-1 line-clamp-2">
              {role.description || "Tidak ada deskripsi untuk role ini."}
            </p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">{role._count.users}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Pengguna</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">{role._count.permissions}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Hak Akses</span>
              </div>
            </div>

            <Link 
              href={`/roles/${role.id}`}
              className="mt-auto w-full h-11 bg-muted hover:bg-primary hover:text-white text-muted-foreground rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn"
            >
              Atur Izin Akses
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}

        {/* Create New Role Button */}
        <Link 
          href="/roles/create"
          className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
            <Settings2 className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">Tambah Role Baru</p>
            <p className="text-xs opacity-60">Buat level akses kustom</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

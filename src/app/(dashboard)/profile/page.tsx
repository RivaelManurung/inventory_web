import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Phone, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter max-w-4xl">
      <PageHeader
        category="PERSONAL"
        title="Profil Pengguna"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-card shadow-sm flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">@{user.username || "username"}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">{user.role?.name || "Member"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
              Informasi Kontak
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/50 rounded-lg text-muted-foreground mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Lengkap</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/50 rounded-lg text-muted-foreground mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alamat Email</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{user.email || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/50 rounded-lg text-muted-foreground mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nomor Telepon</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{user.phoneNumber || "—"}</p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                Pengaturan Profil & Keamanan
              </h3>
              <Link 
                href="/profile/edit" 
                className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
              >
                Edit Profil
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Anda dapat memperbarui informasi pribadi dan mengubah kata sandi dengan menekan tombol Edit Profil di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

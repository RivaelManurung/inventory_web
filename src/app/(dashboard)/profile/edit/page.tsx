"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Mail, Phone, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [form, setForm] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    phoneNumber: "", 
    password: "" 
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            const user = d.data;
            setForm({
              name: user.name || "",
              username: user.username || "",
              email: user.email || "",
              phoneNumber: user.phoneNumber || "",
              password: ""
            });
          }
        })
        .finally(() => setFetching(false));
    }
  }, [session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.username) { 
      toast.error("Nama dan Username wajib diisi!"); 
      return; 
    }
    setLoading(true);
    const toastId = toast.loading("Sedang memperbarui profil...");
    
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(form) 
      });
      const data = await res.json();
      
      if (data.success) { 
        toast.success("Profil berhasil diperbarui!", { id: toastId });
        await update(); // Update NextAuth session
        router.push("/profile"); 
        router.refresh(); 
      } else {
        toast.error(data.message || "Gagal memperbarui profil", { id: toastId });
      }
    } catch { 
      toast.error("Terjadi kesalahan koneksi.", { id: toastId }); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Memuat data profil...</div>;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-4xl">
      <HeaderTitle title="Edit Profil" />
      <div className="flex items-center gap-3">
        <Link href="/profile" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Personal / Profil</p>
          <h1 className="text-lg font-semibold text-foreground">Perbarui Informasi Profil</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Pribadi</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Nama Lengkap <span className="text-destructive">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso" className={inputCls} required />
                </div>
                
                <div className="space-y-1.5">
                  <label className={labelCls}>Username <span className="text-destructive">*</span></label>
                  <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/ /g, "") })}
                    placeholder="budi_s" className={inputCls} required />
                </div>

                <div className="space-y-1.5">
                  <label className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="email@perusahaan.com" className={`${inputCls} pl-9`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelCls}>No. Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input type="text" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="0812..." className={`${inputCls} pl-9`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Security */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Keamanan</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Password Baru</label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Biarkan kosong jika tidak diubah" className={inputCls} />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Hanya isi form ini jika Anda ingin mengubah kata sandi lama Anda.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
              <Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

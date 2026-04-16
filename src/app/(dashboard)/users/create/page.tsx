"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Shield, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", password: "", roleId: "", avatar: "" });

  useEffect(() => {
    fetch("/api/users/roles").then(r => r.json()).then(d => { if (d.success) setRoles(d.data); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password || !form.roleId) { alert("Lengkapi semua field wajib!"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { router.push("/users"); router.refresh(); }
      else alert("Gagal: " + data.message);
    } catch { alert("Terjadi kesalahan."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title="Tambah User" />
      <div className="flex items-center gap-3">
        <Link href="/users" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Administrasi / Users</p>
          <h1 className="text-lg font-semibold text-foreground">Tambah User Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form Fields — 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Profil Personal</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Nama Lengkap <span className="text-destructive">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Rivel Manurung" className={inputCls} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Username <span className="text-destructive">*</span></label>
                    <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/ /g, "") })}
                      placeholder="rivel_m" className={inputCls} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Password <span className="text-destructive">*</span></label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••" className={inputCls} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="email@perusahaan.com" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>No. Telepon</label>
                    <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="0812..." className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar — 1/3 */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Hak Akses</h2>
              </div>
              <div className="p-4 space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    form.roleId === role.id ? "bg-primary/10 border-primary/30 text-primary" : "border-border hover:bg-accent"
                  }`}>
                    <span className="text-xs font-medium">{role.name}</span>
                    <input type="radio" name="role" value={role.id} onChange={e => setForm({ ...form, roleId: e.target.value })}
                      className="w-3.5 h-3.5 text-primary" required />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Foto Profil</h2>
              </div>
              <div className="p-4 flex justify-center">
                <div className="w-28">
                  <ImageUpload 
                    value={form.avatar} 
                    onChange={(url) => setForm({ ...form, avatar: url })}
                    uploadLabel="Upload Foto"
                    previewClassName="w-28 h-28 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Panduan</h2>
              </div>
              <div className="p-5 space-y-2 text-xs text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Nama, username, password, dan role wajib diisi</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Username harus unik dan lowercase</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Pilih role sesuai tanggung jawab pengguna</li>
                </ul>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
              <Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan User"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

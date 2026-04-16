"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Mail, Phone, Shield, Info, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold";
const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    avatar: ""
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${id}`).then(r => r.json()),
      fetch("/api/users/roles").then(r => r.json()),
    ]).then(([uRes, rRes]) => {
      if (uRes.success) {
        setUser(uRes.data);
        setForm({
          name: uRes.data.name,
          email: uRes.data.email || "",
          phoneNumber: uRes.data.phoneNumber || "",
          roleId: uRes.data.roleId,
          avatar: uRes.data.avatar || ""
        });
      }
      if (rRes.success) setRoles(rRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/users/${id}`);
        router.refresh();
      } else {
        alert(data.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><RefreshCcw className="w-5 h-5 animate-spin mx-auto mb-2" /> Memuat Data...</div>;
  if (!user) return <div className="p-20 text-center text-muted-foreground">User tidak ditemukan.</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={`Edit: ${user.name}`} />
      <div className="flex items-center gap-3">
        <Link href={`/users/${id}`} className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Administrasi / Users / {user.name}</p>
          <h1 className="text-lg font-semibold text-foreground">Edit Akun Pengguna</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Profil Personal</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className={labelCls}>Nama Lengkap <span className="text-destructive">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}><Mail className="inline w-3 h-3 mr-1" />Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@perusahaan.com" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}><Phone className="inline w-3 h-3 mr-1" />Telepon</label>
                  <input type="text" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="0812..." className={inputCls} />
                </div>
              </div>
            </div>
            <div className="p-6 pt-2 border-t border-border flex items-center justify-between bg-muted/5">
              <Link href={`/users/${id}`} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Foto Profil</h2>
              </div>
              <div className="p-4 flex justify-center">
                <div className="w-32">
                  <ImageUpload 
                    value={form.avatar} 
                    onChange={(url) => setForm({ ...form, avatar: url })}
                    uploadLabel="Upload Foto"
                    previewClassName="w-32 h-32 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Hak Akses</h2>
              </div>
              <div className="p-4 space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    form.roleId === role.id ? "bg-primary/10 border-primary/30 text-primary scale-[1.02]" : "border-border hover:bg-accent opacity-70"
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-tight">{role.name}</span>
                    <input type="radio" name="role" value={role.id} checked={form.roleId === role.id} onChange={e => setForm({...form, roleId: e.target.value})} className="w-3.5 h-3.5 text-primary" />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Info Akun</h2>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Username</p>
                  <p className="text-sm font-mono text-foreground">@{user.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Mail, Phone, Shield, Info, RefreshCcw, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";
import { toast } from "sonner";

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
    username: "",
    password: "",
    phoneNumber: "",
    roleId: "",
    avatar: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`/api/users/${id}`).then(r => r.json()),
          fetch("/api/users/roles").then(r => r.json()),
        ]);

        if (uRes.success) {
          const userData = uRes.data;
          setUser(userData);
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            username: userData.username || "",
            password: "",
            phoneNumber: userData.phoneNumber || "",
            roleId: userData.roleId || "",
            avatar: userData.avatar || ""
          });
        }
        
        if (rRes.success) {
          setRoles(rRes.data);
        } else {
          toast.error("Gagal memuat daftar role");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan memuat data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Create payload, only include non-empty password
    const payload = { ...form };
    if (!payload.password.trim()) {
      delete (payload as any).password;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Perubahan berhasil disimpan");
        setTimeout(() => {
          router.push(`/users/${id}`);
          router.refresh();
        }, 1500);
      } else {
        toast.error(data.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi");
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
          <div className="lg:col-span-2 space-y-4">
            {/* Profil Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Profil Personal</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={labelCls}>Nama Lengkap <span className="text-destructive">*</span></label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      className={inputCls} 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}><Mail className="inline w-3 h-3 mr-1" />Email <span className="text-destructive">*</span></label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      className={inputCls} 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}><Phone className="inline w-3 h-3 mr-1" />Telepon</label>
                    <input 
                      type="text" 
                      value={form.phoneNumber} 
                      onChange={e => setForm({...form, phoneNumber: e.target.value})} 
                      placeholder="0812..." 
                      className={inputCls} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Keamanan & Akun</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">@</span>
                      <input 
                        type="text" 
                        value={form.username} 
                        onChange={e => setForm({...form, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '')})} 
                        placeholder="username"
                        className={inputCls + " pl-7 font-mono"} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Ubah Password</label>
                    <input 
                      type="password" 
                      value={form.password} 
                      onChange={e => setForm({...form, password: e.target.value})} 
                      placeholder="Isi untuk ubah password" 
                      className={inputCls} 
                    />
                    <p className="text-[10px] text-muted-foreground italic">* Kosongkan jika tidak ingin mengubah password</p>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-2 border-t border-border flex items-center justify-between bg-muted/5">
                <Link href={`/users/${id}`} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                >
                  {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Image Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Foto Profil</h2>
              </div>
              <div className="p-6 flex justify-center">
                <ImageUpload 
                  value={form.avatar} 
                  onChange={(url) => setForm({ ...form, avatar: url })}
                  uploadLabel="Upload Foto"
                  previewClassName="w-32 h-32 rounded-full ring-4 ring-muted"
                />
              </div>
            </div>

            {/* Roles Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Hak Akses</h2>
              </div>
              <div className="p-4 space-y-2">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <label key={role.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      form.roleId === role.id 
                        ? "bg-primary/5 border-primary text-primary ring-1 ring-primary/20" 
                        : "border-border hover:bg-muted/50"
                    }`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-tight">{role.name}</span>
                        <span className="text-[10px] text-muted-foreground/60 leading-none mt-0.5 lowercase">{role.slug}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        form.roleId === role.id ? "bg-primary border-primary" : "border-border"
                      }`}>
                        {form.roleId === role.id && <div className="w-1.5 h-1.5 rounded-full bg-white transition-all scale-100" />}
                      </div>
                      <input 
                        type="radio" 
                        name="role" 
                        value={role.id} 
                        checked={form.roleId === role.id} 
                        onChange={e => setForm({...form, roleId: e.target.value})} 
                        className="hidden" 
                      />
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-center text-[10px] text-muted-foreground italic font-semibold">Memuat role...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

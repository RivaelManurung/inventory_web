"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Database, 
  Bell, 
  ShieldCheck, 
  Info, 
  Save, 
  Layout, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    webNama: "",
    webDeskripsi: "",
    webLogo: "",
  });

  useEffect(() => {
    fetch("/api/settings/get") // I'll create this or just fetch in useEffect
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          setForm({
            webNama: d.data.webNama || "",
            webDeskripsi: d.data.webDeskripsi || "",
            webLogo: d.data.webLogo || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await refreshSettings();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
        <RefreshCcw className="w-5 h-5 animate-spin mr-3" /> Memuat Pengaturan...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title="Pengaturan Sistem" />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Administrasi / Konfigurasi</p>
          <h1 className="text-lg font-semibold text-foreground">Pengaturan Sistem</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Pengaturan berhasil diperbarui secara sistem.</span>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kolom Kiri: Info & Status */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Status Sistem</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Versi Aplikasi</p>
                <p className="text-sm font-bold text-foreground font-mono">Inventory v1.2.0-F</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Environment</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-semibold text-emerald-600 uppercase">Production Active</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Uptime</p>
                <p className="text-sm text-foreground">99.9% Reliable SLA</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Database Core</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Engine</span>
                <span className="font-mono text-foreground font-semibold">PostgreSQL 16</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ORM Layer</span>
                <span className="font-mono text-foreground font-semibold">Prisma v7.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Tengah & Kanan: Form Pengaturan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Layout className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Identitas Visual & Brand</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Nama Website / Entitas</label>
                  <input 
                    type="text" 
                    value={form.webNama}
                    onChange={e => setForm({ ...form, webNama: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Slogan / Deskripsi Singkat</label>
                  <input 
                    type="text" 
                    value={form.webDeskripsi}
                    onChange={e => setForm({ ...form, webDeskripsi: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Logo Aplikasi</label>
                <div className="max-w-xs">
                  <ImageUpload 
                    value={form.webLogo} 
                    onChange={(url) => setForm({ ...form, webLogo: url })}
                    uploadLabel="Upload Logo"
                    previewClassName="w-32 h-32"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Disarankan logo dengan background transparan (PNG) ukuran minimal 512x512px.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Otomasi Notifikasi</h2>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/30 transition-all border border-transparent hover:border-border group">
                <div>
                  <p className="text-sm font-semibold text-foreground">Alert Stok Minimum</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Kirim notifikasi sistem saat stok barang menyentuh limit minimum.</p>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative shadow-inner cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-primary-foreground rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/30 transition-all border border-transparent hover:border-border group">
                <div>
                  <p className="text-sm font-semibold text-foreground">Laporan Harian Otomatis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Generate dan kirim ringkasan transaksi 24 jam terakhir.</p>
                </div>
                <div className="w-10 h-5 bg-muted border border-border rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-muted-foreground/30 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Sistem & Keamanan</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Global API Access Key</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Kunci enkripsi utama untuk integrasi API pihak ketiga (System only).</p>
                </div>
                <button className="px-4 py-2 border border-border text-xs font-bold uppercase tracking-widest text-foreground rounded-md hover:bg-accent transition-all whitespace-nowrap">
                  Rotate API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

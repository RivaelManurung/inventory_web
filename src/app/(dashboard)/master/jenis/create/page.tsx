"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

export default function CreateJenisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/master/jenis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { 
        toast.success("Jenis barang berhasil disimpan!");
        router.push("/master/jenis"); 
        router.refresh(); 
      }
      else toast.error("Gagal: " + data.message);
    } catch { toast.error("Terjadi kesalahan koneksi."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title="Tambah Jenis" />
      <div className="flex items-center gap-3">
        <Link href="/master/jenis" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Jenis Barang</p>
          <h1 className="text-lg font-semibold text-foreground">Tambah Jenis Barang</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Jenis</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Jenis <span className="text-destructive">*</span></label>
              <input type="text" value={form.name} onChange={(e) => { const v = e.target.value; setForm({ ...form, name: v, slug: v.toLowerCase().replace(/ /g, "-") }); }}
                placeholder="Contoh: Elektronik"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Slug Sistem (Otomatis)</label>
              <input type="text" value={form.slug} readOnly className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm font-mono text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Keterangan</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan karakteristik barang dalam kelompok ini..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link href="/master/jenis" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                <Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Panduan</h2>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">Jenis barang digunakan untuk klasifikasi sifat fisik atau fungsional dari item inventaris.</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Nama jenis wajib diisi dan unik</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Slug otomatis dibuat dari nama</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Keterangan opsional namun dianjurkan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
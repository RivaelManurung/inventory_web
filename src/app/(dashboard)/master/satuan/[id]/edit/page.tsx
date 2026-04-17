"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Info, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

export default function EditSatuanPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetch(`/api/master/satuan/${id}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData(d.data);
          setForm({ name: d.data.name, description: d.data.description || "" });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Sedang menyimpan perubahan...");
    try {
      const res = await fetch(`/api/master/satuan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("Perubahan satuan berhasil disimpan!", { id: toastId });
        router.push(`/master/satuan/${id}`);
        router.refresh();
      } else {
        toast.error(resData.message || "Gagal menyimpan perubahan", { id: toastId });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><RefreshCcw className="w-5 h-5 animate-spin mx-auto mb-2" /> Memuat Data...</div>;
  if (!data) return <div className="p-20 text-center text-muted-foreground">Data tidak ditemukan.</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title={`Edit: ${data.name}`} />
      <div className="flex items-center gap-3">
        <Link href={`/master/satuan/${id}`} className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Satuan / {data.name}</p>
          <h1 className="text-lg font-semibold text-foreground">Edit Satuan Barang</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Satuan</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Satuan <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold" 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Slug Identitas</label>
              <input type="text" value={data.slug} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm font-mono text-muted-foreground cursor-not-allowed" disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Keterangan</label>
              <textarea 
                rows={3} 
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Penjelasan penggunaan satuan ini..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
              />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link href={`/master/satuan/${id}`} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Info Satuan</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <div className="inline-flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 uppercase">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

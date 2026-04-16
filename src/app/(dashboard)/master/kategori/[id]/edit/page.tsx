"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Info, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

export default function EditKategoriPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(`/api/master/kategori/${id}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData(d.data);
          setName(d.data.name);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/master/kategori/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("Perubahan kategori berhasil disimpan!");
        router.push(`/master/kategori/${id}`);
        router.refresh();
      } else {
        toast.error(resData.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.");
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
        <Link href={`/master/kategori/${id}`} className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Kategori / {data.name}</p>
          <h1 className="text-lg font-semibold text-foreground">Edit Kategori</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Kategori</h2>
          </div>
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nama Kategori <span className="text-destructive">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold" 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Slug (URL Identitas)</label>
              <input type="text" value={data.slug}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed font-mono" disabled />
              <p className="text-[10px] text-muted-foreground">Slug bersifat permanen untuk integritas link aset.</p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link href={`/master/kategori/${id}`} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Info Kategori</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Terakhir Diperbarui</p>
                <p className="text-sm font-mono text-muted-foreground">{new Date(data.updatedAt).toLocaleString("id-ID")}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3 font-medium">
                Sistem akan memperbarui nama pada semua barang yang terkait dengan kategori ini secara otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

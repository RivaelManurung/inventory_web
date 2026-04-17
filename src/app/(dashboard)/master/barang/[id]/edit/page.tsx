"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Image as ImageIcon, Info, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";
import { toast } from "sonner";

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold";
const selectCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

export default function EditBarangPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [jenis, setJenis] = useState<any[]>([]);
  const [satuan, setSatuan] = useState<any[]>([]);

  const [form, setForm] = useState({
    barangKode: "",
    barangNama: "",
    barangHarga: "",
    stokMinimum: "",
    barangCategoryId: "",
    jenisBarangId: "",
    satuanId: "",
    barangGambar: "",
    isActive: true
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/master/barang/${id}`).then(r => r.json()),
      fetch("/api/master/kategori").then(r => r.json()),
      fetch("/api/master/jenis").then(r => r.json()),
      fetch("/api/master/satuan").then(r => r.json()),
    ]).then(([bRes, katRes, jenRes, satRes]) => {
      if (bRes.success) {
        setData(bRes.data);
        setForm({
          barangKode: bRes.data.barangKode,
          barangNama: bRes.data.barangNama,
          barangHarga: bRes.data.barangHarga.toString(),
          stokMinimum: bRes.data.stokMinimum.toString(),
          barangCategoryId: bRes.data.barangCategoryId,
          jenisBarangId: bRes.data.jenisBarangId,
          satuanId: bRes.data.satuanId,
          barangGambar: bRes.data.barangGambar || "",
          isActive: bRes.data.isActive ?? true
        });
      }
      if (katRes.success) setCategories(katRes.data);
      if (jenRes.success) setJenis(jenRes.data);
      if (satRes.success) setSatuan(satRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Sedang menyimpan perubahan...");
    try {
      const res = await fetch(`/api/master/barang/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("Perubahan berhasil disimpan!", { id: toastId });
        router.push(`/master/barang/${id}`);
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
      <HeaderTitle title={`Edit: ${data.barangNama}`} />
      <div className="flex items-center gap-3">
        <Link href={`/master/barang/${id}`} className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Barang / {data.barangKode}</p>
          <h1 className="text-lg font-semibold text-foreground">Edit Barang</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Dasar</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Kode Asset (SKU)</label>
                  <input type="text" value={form.barangKode} onChange={e => setForm({...form, barangKode: e.target.value})} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Nama Barang <span className="text-destructive">*</span></label>
                  <input type="text" value={form.barangNama} onChange={e => setForm({...form, barangNama: e.target.value})} className={inputCls} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Kategori</label>
                  <select value={form.barangCategoryId} onChange={e => setForm({...form, barangCategoryId: e.target.value})} className={selectCls}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Jenis Barang</label>
                  <select value={form.jenisBarangId} onChange={e => setForm({...form, jenisBarangId: e.target.value})} className={selectCls}>
                    {jenis.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Harga Satuan (IDR)</label>
                  <input type="number" value={form.barangHarga} onChange={e => setForm({...form, barangHarga: e.target.value})} min="0" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Satuan Ukur</label>
                  <select value={form.satuanId} onChange={e => setForm({...form, satuanId: e.target.value})} className={selectCls}>
                    {satuan.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 pt-2">
                  <label className={labelCls}>Status Aktif</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${form.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {form.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Link href={`/master/barang/${id}`} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
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
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Gambar Produk</h2>
            </div>
            <div className="p-4">
              <ImageUpload 
                value={form.barangGambar} 
                onChange={(url) => setForm({ ...form, barangGambar: url })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

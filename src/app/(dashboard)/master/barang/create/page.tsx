"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import ImageUpload from "@/components/forms/ImageUpload";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { barangSchema } from "@/lib/validations";

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const selectCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";
const errorCls = "text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-tight";

export default function CreateBarangPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [kategori, setKategori] = useState<any[]>([]);
  const [jenis, setJenis] = useState<any[]>([]);
  const [satuan, setSatuan] = useState<any[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(barangSchema),
    defaultValues: {
      barangNama: "",
      barangHarga: 0,
      stokMinimum: 0,
      barangCategoryId: "",
      jenisBarangId: "",
      satuanId: "",
      barangGambar: "",
      isActive: true,
    }
  });

  const isActive = watch("isActive", true as any);

  useEffect(() => {
    Promise.all([
      fetch("/api/master/kategori").then(r => r.json()),
      fetch("/api/master/jenis").then(r => r.json()),
      fetch("/api/master/satuan").then(r => r.json()),
    ]).then(([katRes, jenRes, satRes]) => {
      if (katRes.success) setKategori(katRes.data);
      if (jenRes.success) setJenis(jenRes.data);
      if (satRes.success) setSatuan(satRes.data);
    }).finally(() => setFetching(false));
  }, []);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const toastId = toast.loading("Sedang menambahkan barang baru...");
    try {
      const res = await fetch("/api/master/barang", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      const resData = await res.json();
      if (resData.success) { 
        toast.success("Barang berhasil ditambahkan!", { id: toastId });
        router.push(`/master/barang/${resData.data.id}`); 
        router.refresh(); 
      }
      else toast.error(resData.message || "Gagal menyimpan data", { id: toastId });
    } catch { toast.error("Terjadi kesalahan koneksi.", { id: toastId }); }
    finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-40 text-xs text-muted-foreground uppercase tracking-widest">Memuat data form...</div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title="Tambah Barang Baru" />

      <div className="flex items-center gap-3">
        <Link href="/master/barang" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Barang</p>
          <h1 className="text-lg font-semibold text-foreground">Tambah Barang Baru</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Form — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Informasi Dasar */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Dasar</h2>
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} id="barang-form" className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className={labelCls}>Nama Barang <span className="text-destructive">*</span></label>
                <input type="text" {...register("barangNama")}
                  placeholder="Contoh: Laptop Dell XPS 13" className={inputCls} />
                {errors.barangNama && <p className={errorCls}>{errors.barangNama.message as string}</p>}
                <p className="text-xs text-muted-foreground">SKU dan QR Code akan digenerate otomatis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Kategori <span className="text-destructive">*</span></label>
                  <select {...register("barangCategoryId")} className={selectCls}>
                    <option value="">-- Pilih Kategori --</option>
                    {kategori.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                  {errors.barangCategoryId && <p className={errorCls}>{errors.barangCategoryId.message as string}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Jenis Barang <span className="text-destructive">*</span></label>
                  <select {...register("jenisBarangId")} className={selectCls}>
                    <option value="">-- Pilih Jenis --</option>
                    {jenis.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                  </select>
                  {errors.jenisBarangId && <p className={errorCls}>{errors.jenisBarangId.message as string}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Satuan <span className="text-destructive">*</span></label>
                  <select {...register("satuanId")} className={selectCls}>
                    <option value="">-- Pilih Satuan --</option>
                    {satuan.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.satuanId && <p className={errorCls}>{errors.satuanId.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Harga / Nilai Barang (Rp)</label>
                  <input type="number" step="0.01" {...register("barangHarga", { valueAsNumber: true })}
                    placeholder="Contoh: 15000000" className={inputCls} />
                  {errors.barangHarga && <p className={errorCls}>{errors.barangHarga.message as string}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Stok Minimum (Alert)</label>
                  <input type="number" {...register("stokMinimum", { valueAsNumber: true })}
                    className={inputCls} />
                  {errors.stokMinimum && <p className={errorCls}>{errors.stokMinimum.message as string}</p>}
                  <p className="text-xs text-muted-foreground">Sistem akan memberi peringatan jika stok di bawah nilai ini.</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className={labelCls}>Status Aktif</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("isActive", !isActive as any)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isActive ? 'Aktif' : 'Non-aktif'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Link href="/master/barang" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
                <button type="submit" form="barang-form" disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                  <Save className="w-4 h-4" />{loading ? "Menyimpan..." : "Simpan Barang"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info — 1/3 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Panduan</h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">Setiap barang akan mendapatkan SKU unik dan QR code yang bisa dipindai.</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Nama, Kategori, Jenis, Satuan wajib diisi</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />SKU otomatis digenerate sistem</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Harga digunakan untuk kalkulasi nilai aset</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />Stok minimum untuk notifikasi peringatan</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Gambar Produk</h2>
            </div>
            <div className="p-4">
              <ImageUpload
                value={watch("barangGambar")}
                onChange={(url) => setValue("barangGambar", url)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Setelah Disimpan</h2>
            </div>
            <div className="p-5 space-y-2 text-xs text-muted-foreground">
              <p>Setelah barang dibuat, kamu dapat:</p>
              <ul className="space-y-1.5 mt-2">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />Menetapkan stok ke gudang via transaksi masuk</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />Menambahkan foto barang</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />Mencetak QR code label</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
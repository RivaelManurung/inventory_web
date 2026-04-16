"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Box } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateBarangPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [kategori, setKategori] = useState<any[]>([]);
  const [jenis, setJenis] = useState<any[]>([]);
  const [satuan, setSatuan] = useState<any[]>([]);

  const [form, setForm] = useState({
    barangNama: "",
    barangHarga: "",
    stokMinimum: "0",
    barangCategoryId: "",
    jenisBarangId: "",
    satuanId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [katRes, jenRes, satRes] = await Promise.all([
          fetch("/api/master/kategori").then(r => r.json()),
          fetch("/api/master/jenis").then(r => r.json()),
          fetch("/api/master/satuan").then(r => r.json()),
        ]);

        if (katRes.success) setKategori(katRes.data);
        if (jenRes.success) setJenis(jenRes.data);
        if (satRes.success) setSatuan(satRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.barangNama.trim() || !form.barangCategoryId || !form.jenisBarangId || !form.satuanId) {
      alert("Mohon lengkapi semua field yang wajib!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/master/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/master/barang/${data.data.id}`); // redirect to detail to see generated QR
        router.refresh();
      } else {
        alert("Gagal menambahkan barang: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat data form...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/master/barang" className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Box className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Tambah Barang</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Barang *</label>
            <input 
              type="text" 
              value={form.barangNama}
              onChange={(e) => setForm({ ...form, barangNama: e.target.value })}
              placeholder="Contoh: Laptop Dell XPS 13"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all font-bold text-slate-700"
              required
            />
            <p className="text-xs text-slate-400 mt-2 font-medium">SKU (Kode Barang) dan QR Code akan digenerate otomatis.</p>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Kategori *</label>
            <select
               value={form.barangCategoryId}
               onChange={(e) => setForm({ ...form, barangCategoryId: e.target.value })}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all font-bold text-slate-700"
               required
            >
              <option value="">-- Pilih Kategori --</option>
              {kategori.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Jenis Barang *</label>
            <select
               value={form.jenisBarangId}
               onChange={(e) => setForm({ ...form, jenisBarangId: e.target.value })}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all font-bold text-slate-700"
               required
            >
              <option value="">-- Pilih Jenis --</option>
              {jenis.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Satuan *</label>
            <select
               value={form.satuanId}
               onChange={(e) => setForm({ ...form, satuanId: e.target.value })}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all font-bold text-slate-700"
               required
            >
              <option value="">-- Pilih Satuan --</option>
              {satuan.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Stok Minimum</label>
            <input 
              type="number" 
              min="0"
              value={form.stokMinimum}
              onChange={(e) => setForm({ ...form, stokMinimum: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Harga / Nilai Barang (Rp)</label>
            <input 
              type="number" 
              min="0"
              value={form.barangHarga}
              onChange={(e) => setForm({ ...form, barangHarga: e.target.value })}
              placeholder="Contoh: 15000000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all font-bold text-slate-700"
            />
          </div>

          <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              disabled={loading}
              type="submit" 
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan Barang Baru</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
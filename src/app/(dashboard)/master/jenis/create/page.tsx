"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateJenisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/master/jenis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/master/jenis");
        router.refresh();
      } else {
        alert("Gagal menambahkan jenis: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/master/jenis" className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Tambah Jenis</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Jenis</label>
            <input 
              type="text" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Barang Habis Pakai"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all font-medium"
              required
            />
            <p className="text-xs text-slate-400 mt-2 font-medium">Slug akan di-generate otomatis.</p>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Deskripsi (Opsional)</label>
            <textarea 
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-slate-400 transition-all font-medium resize-none"
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              disabled={loading}
              type="submit" 
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan Jenis</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
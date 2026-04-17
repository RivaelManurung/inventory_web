"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Shield, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const inputCls = "w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
const labelCls = "text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5 block";

export default function CreateRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Nama dan Slug wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Role berhasil ditambahkan!");
        router.push("/roles");
        router.refresh();
      } else {
        toast.error("Gagal: " + data.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlugUpdate = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setForm({ ...form, name, slug });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <Link 
          href="/roles" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Manajemen Role
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/20">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Informasi Dasar</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className={labelCls}>Nama Role <span className="text-destructive">*</span></label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => handleSlugUpdate(e.target.value)}
                    placeholder="Contoh: Manager Operasional" 
                    className={inputCls} 
                    required 
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5 italic">Gunakan nama yang jelas mendeskripsikan tanggung jawab role.</p>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Slug Identitas <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={form.slug} 
                      onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                      placeholder="manager-ops" 
                      className={cn(inputCls, "pl-11 font-mono")} 
                      required 
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-sm">
                      @
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">Slug digunakan oleh sistem untuk identifikasi teknis (tidak boleh ada spasi).</p>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Deskripsi Penjelasan</label>
                  <textarea 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Jelaskan secara singkat apa saja tanggung jawab dari role ini..." 
                    className={cn(inputCls, "min-h-[120px] resize-none py-3")} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-primary" />
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Instruksi</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">1</div>
                <p className="text-xs text-muted-foreground leading-relaxed">Isi nama role dan slug yang unik untuk identifikasi.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">2</div>
                <p className="text-xs text-muted-foreground leading-relaxed">Setelah disimpan, Anda dapat mengatur hak akses spesifik di halaman detail role.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">3</div>
                <p className="text-xs text-muted-foreground leading-relaxed">Pastikan deskripsi cukup jelas bagi admin lain.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Simpan Role
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

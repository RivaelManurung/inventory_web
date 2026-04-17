"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

export default function CreateKategoriPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const toastId = toast.loading("Sedang menyimpan kategori...");
    try {
      const res = await fetch("/api/master/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Kategori berhasil ditambahkan!", { id: toastId });
        router.push("/master/kategori");
        router.refresh();
      } else {
        toast.error(data.message || "Gagal menyimpan data", { id: toastId });
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <HeaderTitle title="Tambah Kategori" />

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/master/kategori" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Master Data / Kategori</p>
          <h1 className="text-lg font-semibold text-foreground">Tambah Kategori Baru</h1>
        </div>
      </div>

      {/* Full-width 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form — 2/3 */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Informasi Kategori</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nama Kategori <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Elektronik"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
              <p className="text-xs text-muted-foreground">Slug akan di-generate otomatis dari nama kategori.</p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link href="/master/kategori" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Batal</Link>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                <Save className="w-4 h-4" />
                {loading ? "Menyimpan..." : "Simpan Kategori"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Panel — 1/3 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Panduan</h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kategori digunakan untuk mengelompokkan barang berdasarkan jenis atau kegunaannya.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Nama kategori wajib diisi dan harus unik
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Slug otomatis dibuat dari nama kategori
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Kategori dapat digunakan saat menambahkan barang baru
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

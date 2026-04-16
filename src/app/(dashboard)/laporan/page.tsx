"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useEffect, useState } from "react";
import { Download, BarChart2, Package, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";

export default function LaporanPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/laporan/summary")
      .then(res => res.json())
      .then(data => { if (!data.error) setSummary(data); setIsLoading(false); });
  }, []);

  const handleExport = () => { window.location.href = "/api/laporan/export"; };

  const statCards = [
    { label: "Total Model Barang", value: summary?.totalBarangModel || 0, icon: Package },
    { label: "Total Item Stok (Pcs)", value: summary?.totalStokKeseluruhan?.toLocaleString() || 0, icon: BarChart2 },
    { label: "Stok Masuk (Bulan Ini)", value: summary?.pergerakanBulanIni?.masuk?.toLocaleString() || 0, icon: TrendingUp, accent: "emerald" },
    { label: "Stok Keluar (Bulan Ini)", value: summary?.pergerakanBulanIni?.keluar?.toLocaleString() || 0, icon: TrendingDown, accent: "red" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        category="ADMINISTRASI"
        title="Pusat Analitik & Laporan"
        subtitle="Ringkasan inventaris dan performa stok barang secara real-time."
        actionLabel="EXPORT (.CSV)"
        onAction={handleExport}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-muted-foreground">
          <RefreshCcw className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${
                    accent === "emerald" ? "bg-emerald-500/10 text-emerald-600" :
                    accent === "red" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Nilai */}
          <div className="rounded-xl border border-border bg-card overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative p-8">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-2">Evaluasi Aset Tersimpan</p>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Rp {summary?.totalNilaiInventaris?.toLocaleString("id-ID") || "0"}
              </h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Angka di atas dihitung berdasarkan harga beli/standar dari setiap Unit Master yang memiliki stok di gudang. Total dihitung secara <em>real-time</em>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, X, Search, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StockAdjustmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    transactionDate: new Date().toISOString().slice(0, 10),
    description: "Stock Adjustment (Opname)",
  });

  const [details, setDetails] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/master/barang/search?q=${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const addDetail = (barang: any) => {
    let gudangId = "";
    let gudangName = "Pilih Gudang...";
    let currentQty: any = 0;

    if (barang.barangGudangs && barang.barangGudangs.length > 0) {
      gudangId = barang.barangGudangs[0].gudangId;
      gudangName = barang.barangGudangs[0].gudang.name;
      currentQty = barang.barangGudangs[0].stokTersedia;
    }

    setDetails([...details, {
      uid: Date.now().toString(),
      barangId: barang.id, 
      barangKode: barang.barangKode, 
      barangNama: barang.barangNama,
      gudangs: barang.barangGudangs || [], 
      gudangId, 
      gudangName, 
      quantity: currentQty, // Default to current stock for easy adjustment
      oldQty: currentQty,
    }]);
    setSearchResults([]); 
    setSearchQuery("");
  };

  const removeDetail = (uid: string) => setDetails(details.filter((d) => d.uid !== uid));

  const updateDetail = (uid: string, field: string, value: any) => {
    setDetails(details.map((d) => {
      if (d.uid === uid) {
        if (field === "gudangId") {
          const selected = d.gudangs.find((g: any) => g.gudangId === value);
          return { ...d, gudangId: value, gudangName: selected?.gudang?.name || "Gudang Unknown", oldQty: selected?.stokTersedia || 0, quantity: selected?.stokTersedia || 0 };
        }
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (details.length === 0) { toast.error("Silakan tambahkan minimal 1 item barang."); return; }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang menyimpan penyesuaian stok...");
    try {
      const payload = { 
        type: "Stock Adjustment", 
        transactionDate: form.transactionDate,
        description: form.description,
        details: details.map((d) => ({ 
          barangId: d.barangId, 
          gudangId: d.gudangId, 
          quantity: d.quantity 
        })) 
      };
      
      const res = await fetch("/api/transaksi", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal menyimpan penyesuaian");
      
      toast.success("Stok berhasil disesuaikan!", { id: toastId });
      router.push("/transaksi"); 
      router.refresh();
    } catch (err: any) {
      toast.error(err.message, { id: toastId }); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-20">
      <HeaderTitle title="Stock Adjustment" />

      <div className="flex items-center gap-3">
        <Link href="/transaksi" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Operasional / Inventory</p>
          <h1 className="text-lg font-semibold text-foreground">Penyesuaian Stok (Stock Opname)</h1>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-600 leading-relaxed font-medium">
          <p className="font-bold uppercase tracking-wider mb-1">Peringatan Modul Opname</p>
          Fitur ini akan <span className="underline">menimpa langsung</span> jumlah stok di sistem dengan angka yang Anda masukkan. Pastikan perhitungan fisik sudah benar sebelum menyimpan.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Data Penyesuaian</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tanggal Opname</label>
                <input type="date" required value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Catatan Umum</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Contoh: Opname Triwulan Q1" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Item Barang</h2>
            <div className="relative w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-3.5 h-3.5" />
               <input type="text" placeholder="Cari barang..." value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(e); } }}
                 className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs" />
               
               {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button key={item.id} type="button" onClick={() => addDetail(item)}
                      className="w-full flex items-center justify-between p-3 hover:bg-accent transition border-b border-border text-left">
                      <div>
                        <p className="font-semibold text-foreground text-xs">{item.barangNama}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.barangKode}</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Barang</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Gudang</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center">Stok Sistem</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-32">Stok Fisik</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center">Selisih</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-16 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {details.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-xs text-muted-foreground">Cari barang di pojok kanan atas untuk memulai penyesuaian.</td></tr>
                  ) : (
                    details.map((d) => {
                      const diff = d.quantity - d.oldQty;
                      return (
                        <tr key={d.uid} className="hover:bg-muted/20">
                          <td className="px-6 py-3">
                            <p className="font-semibold text-foreground text-xs">{d.barangNama}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{d.barangKode}</p>
                          </td>
                          <td className="px-6 py-3">
                             <select value={d.gudangId} onChange={(e) => updateDetail(d.uid, "gudangId", e.target.value)}
                                className="w-full bg-background border border-border rounded px-2 py-1 text-xs">
                                {d.gudangs.map((bg: any) => (
                                  <option key={bg.gudangId} value={bg.gudangId}>{bg.gudang.name}</option>
                                ))}
                             </select>
                          </td>
                          <td className="px-6 py-3 text-center font-mono text-xs text-muted-foreground">{d.oldQty}</td>
                          <td className="px-6 py-3">
                            <input type="number" value={d.quantity} onChange={(e) => updateDetail(d.uid, "quantity", Number(e.target.value))}
                              className="w-full px-3 py-1 bg-background border border-border rounded-md text-center font-bold text-xs" />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded",
                              diff === 0 ? "text-slate-400 bg-slate-100" :
                              diff > 0 ? "text-emerald-600 bg-emerald-500/10" : "text-rose-600 bg-rose-500/10"
                            )}>
                              {diff === 0 ? "±0" : (diff > 0 ? `+${diff}` : diff)}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button type="button" onClick={() => removeDetail(d.uid)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-card border border-border rounded-xl">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">Batal</button>
          <button type="submit" disabled={isSubmitting || details.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
            <Save size={14} />
            {isSubmitting ? "Menyimpan..." : "Posting Penyesuaian"}
          </button>
        </div>
      </form>
    </div>
  );
}

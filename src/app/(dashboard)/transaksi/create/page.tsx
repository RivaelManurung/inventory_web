"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ScanLine, X, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";

export default function CreateTransaksiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    type: "Barang Masuk",
    transactionDate: new Date().toISOString().slice(0, 10),
    description: "",
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
    if (barang.barangGudangs && barang.barangGudangs.length > 0) {
      gudangId = barang.barangGudangs[0].gudang.id;
      gudangName = barang.barangGudangs[0].gudang.name;
    }
    setDetails([...details, {
      uid: Date.now().toString(),
      barangId: barang.id, barangKode: barang.barangKode, barangNama: barang.barangNama,
      gudangs: barang.barangGudangs || [], gudangId, gudangName, quantity: 1, maxQty: "∞",
    }]);
    setSearchResults([]); setSearchQuery("");
  };

  const removeDetail = (uid: string) => setDetails(details.filter((d) => d.uid !== uid));

  const updateDetail = (uid: string, field: string, value: any) => {
    setDetails(details.map((d) => {
      if (d.uid === uid) {
        if (field === "gudangId") {
          const selected = d.gudangs.find((g: any) => g.gudangId === value);
          return { ...d, gudangId: value, gudangName: selected?.gudang?.name || "Gudang Unknown", maxQty: selected?.stokTersedia || 0 };
        }
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (details.length === 0) { toast.error("Silakan tambahkan minimal 1 item barang."); return; }
    for (const item of details) {
      if (!item.gudangId) { toast.error(`Silakan pilih gudang untuk barang ${item.barangNama}.`); return; }
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang menyimpan transaksi...");
    try {
      const payload = { ...form, details: details.map((d) => ({ barangId: d.barangId, gudangId: d.gudangId, quantity: d.quantity })) };
      const res = await fetch("/api/transaksi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal menyimpan transaksi");
      
      toast.success("Transaksi berhasil dicatat!", { id: toastId });
      router.push("/transaksi"); 
      router.refresh();
    } catch (err: any) {
      toast.error(err.message, { id: toastId }); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-20">
      <HeaderTitle title="Catat Transaksi" />

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/transaksi" className="p-2 bg-card border border-border text-muted-foreground rounded-md hover:bg-accent transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Operasional / Transaksi</p>
          <h1 className="text-lg font-semibold text-foreground">Catat Transaksi Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Header Transaksi</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipe Transaksi</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Barang Masuk">Barang Masuk / Pembelian</option>
                    <option value="Barang Keluar">Barang Keluar / Pemakaian</option>
                    <option value="Peminjaman">Peminjaman</option>
                    <option value="Pengembalian">Pengembalian</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tanggal</label>
                  <input type="date" required value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Keterangan</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="No PO / Referensi / Info Tambahan" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
            <ScanLine className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gunakan scanner fisik ke input pencarian untuk scan otomatis
            </p>
          </div>
        </div>

        {/* Item Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Daftar Barang</h2>
          </div>
          <div className="p-5">
            <div className="mb-5 relative z-10">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
                  <input type="text" placeholder="Ketik nama atau [SCAN BARCODE] lalu Enter..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(e); } }}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <button type="button" onClick={handleSearch}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
                  Cari
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <div className="flex justify-between p-3 border-b border-border bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground">Hasil ({searchResults.length})</span>
                    <button type="button" onClick={() => setSearchResults([])} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                  </div>
                  {searchResults.map((item) => (
                    <button key={item.id} type="button" onClick={() => addDetail(item)}
                      className="w-full flex items-center justify-between p-4 hover:bg-accent transition border-b border-border text-left">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.barangNama}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.barangKode} &bull; Ada di {item.barangGudangs?.length || 0} Gudang</p>
                      </div>
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-10 text-center">#</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] min-w-[200px]">Barang</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-48">Pilih Gudang</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-32 text-center">Stok. T</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-32">Qty ({form.type.includes('Masuk') ? '+' : '-'})</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] w-16 text-center">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {details.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Belum ada barang dipilih. Scan atau cari barang untuk menambahkan.</td></tr>
                  ) : (
                    details.map((d, index) => (
                      <tr key={d.uid} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-center text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{d.barangNama}</p>
                          <p className="text-xs font-mono text-muted-foreground">{d.barangKode}</p>
                        </td>
                        <td className="px-4 py-3">
                          {d.gudangs.length === 0 && !form.type.includes("Masuk") ? (
                            <span className="text-destructive text-xs">Kosong di manapun</span>
                          ) : (
                            <select value={d.gudangId} onChange={(e) => updateDetail(d.uid, "gudangId", e.target.value)}
                              className="w-full px-3 py-1.5 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none">
                              <option disabled value="">-Pilih Gudang-</option>
                              {d.gudangs.map((bg: any) => (
                                <option key={bg.gudangId} value={bg.gudangId}>{bg.gudang.name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-muted-foreground bg-muted/20">{d.maxQty}</td>
                        <td className="px-4 py-3">
                          <input type="number" min="1" value={d.quantity} onChange={(e) => updateDetail(d.uid, "quantity", Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-border rounded-md text-center font-medium text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button type="button" onClick={() => removeDetail(d.uid)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-0 bg-card/90 backdrop-blur-md p-4 border-t border-border rounded-t-xl">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Batal</button>
          <button type="submit" disabled={isSubmitting || details.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
            <Save size={16} />
            {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
}
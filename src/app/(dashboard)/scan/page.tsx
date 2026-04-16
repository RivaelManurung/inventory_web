"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScanLine, Search, Loader2 } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [sku, setSku] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount so physical scanner hits it directly
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/master/barang/search?q=${sku}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // If exact SKU found
      const exactMatch = data.find((item: any) => item.barangKode.toLowerCase() === sku.toLowerCase());
      
      if (exactMatch) {
        router.push(`/master/barang/${exactMatch.id}`);
      } else if (data.length === 1) {
        router.push(`/master/barang/${data[0].id}`);
      } else if (data.length > 1) {
        setError(`Ditemukan ${data.length} barang mirip, namun SKU tidak cocok tepat. Coba ketik dengan benar.`);
      } else {
        setError("Barang tidak ditemukan. Pastikan QR Code benar.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
      // Reset input for next scan
      setSku("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ScanLine className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ketik / Scan QR Code</h1>
        <p className="text-slate-500 mt-3 text-sm max-w-sm mx-auto leading-relaxed">
          Gunakan scanner barcode fisik atau ketik manual SKU barang (contoh: <strong>BRG-0001</strong>) untuk melihat detail barang dan stok.
        </p>

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleScan} className="mt-8 relative max-w-sm mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="block w-full pl-11 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-mono placeholder:font-sans focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="BRG-XXXX..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !sku.trim()}
            className="absolute inset-y-2 right-2 flex items-center justify-center px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cari"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-6 mt-12 font-medium">
          Note: Otomatis mendeteksi input jika menggunakan USB Barcode Scanner
        </p>
      </div>
    </div>
  );
}
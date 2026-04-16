"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ScanLine, X, Search } from "lucide-react";

export default function CreateTransaksiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "Barang Masuk",
    transactionDate: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const [details, setDetails] = useState<any[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
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
    // Cari gudang default atau gudang pertama yg dimilikinya
    let gudangId = "";
    let gudangName = "Pilih Gudang...";
    if (barang.barangGudangs && barang.barangGudangs.length > 0) {
      gudangId = barang.barangGudangs[0].gudang.id;
      gudangName = barang.barangGudangs[0].gudang.name;
    }

    setDetails([
      ...details,
      {
        uid: Date.now().toString(),
        barangId: barang.id,
        barangKode: barang.barangKode,
        barangNama: barang.barangNama,
        gudangs: barang.barangGudangs || [], // For choices
        gudangId: gudangId,
        gudangName: gudangName,
        quantity: 1,
        maxQty: "∞",
      },
    ]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const removeDetail = (uid: string) => {
    setDetails(details.filter((d) => d.uid !== uid));
  };

  const updateDetail = (uid: string, field: string, value: any) => {
    setDetails(
      details.map((d) => {
        if (d.uid === uid) {
          if (field === "gudangId") {
            const selected = d.gudangs.find((g: any) => g.gudangId === value);
            return {
              ...d,
              gudangId: value,
              gudangName: selected?.gudang?.name || "Gudang Unknown",
              maxQty: selected?.stokTersedia || 0,
            };
          }
          return { ...d, [field]: value };
        }
        return d;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (details.length === 0) {
      setError("Silakan tambahkan minimal 1 item barang.");
      return;
    }

    // Validation for empty Gudang in any row
    for (const item of details) {
      if (!item.gudangId) {
        setError(`Silakan pilih gudang untuk barang ${item.barangNama}.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        details: details.map((d) => ({
          barangId: d.barangId,
          gudangId: d.gudangId,
          quantity: d.quantity,
        })),
      };

      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal menyimpan transaksi");

      router.push("/transaksi");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Catat Transaksi</h1>
        <p className="text-slate-500 text-sm mt-1">
          Formulir untuk mencatat stok masuk atau keluar
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tipe Transaksi
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Barang Masuk">Barang Masuk / Pembelian</option>
                <option value="Barang Keluar">Barang Keluar / Pemakaian</option>
                <option value="Peminjaman">Peminjaman</option>
                <option value="Pengembalian">Pengembalian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={form.transactionDate}
                onChange={(e) =>
                  setForm({ ...form, transactionDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Keterangan
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                placeholder="No PO / Referensi / Info Tambahan"
              ></textarea>
            </div>
          </div>

          <div className="md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
            <ScanLine className="w-16 h-16 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500 text-center px-4">
              Gunakan scanner fisik ke input pencarian untuk scan otomatis
            </p>
          </div>
        </div>

        {/* Item Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-4">
            Daftar Barang
          </h2>

          <div className="mb-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ketik nama atau [SCAN BARCODE] di sini lalu Enter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl shadow-md font-medium whitespace-nowrap hover:bg-slate-900"
              >
                Cari Barang
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                <div className="flex justify-between p-3 border-b border-slate-50 bg-slate-50/50">
                  <span className="text-xs font-semibold text-slate-500">
                    Hasil Pencarian ({searchResults.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchResults([])}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                </div>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addDetail(item)}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition border-b border-slate-50 text-left"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{item.barangNama}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        SKU: {item.barangKode} &bull; Ada di {item.barangGudangs?.length || 0} Gudang
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-blue-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left align-middle border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">#</th>
                  <th className="px-4 py-3 min-w-[200px]">Barang</th>
                  <th className="px-4 py-3 w-48">Pilih Gudang</th>
                  <th className="px-4 py-3 w-32 text-center">Stok. T</th>
                  <th className="px-4 py-3 w-32">Qty ({form.type.includes('Masuk') ? '+' : '-'})</th>
                  <th className="px-4 py-3 w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Belum ada barang dipilih. Scan atau cari barang untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  details.map((d, index) => (
                    <tr key={d.uid} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-center text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{d.barangNama}</p>
                        <p className="text-xs text-slate-500">{d.barangKode}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          {d.gudangs.length === 0 && !form.type.includes("Masuk") ? (
                            <span className="text-red-500 text-xs">Kosong di manapun</span>
                          ) : (
                            <select
                              value={d.gudangId}
                              onChange={(e) => updateDetail(d.uid, "gudangId", e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                              <option disabled value="">-Pilih Gudang-</option>
                              {d.gudangs.map((bg: any) => (
                                <option key={bg.gudangId} value={bg.gudangId}>
                                  {bg.gudang.name}
                                </option>
                              ))}
                              {/* If Masuk, we ideally want to allow a new Gudang connection, but let's stick to existing for MVP or user should pre-assign manually */}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-slate-500 bg-slate-50">
                        {d.maxQty}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={d.quantity}
                          onChange={(e) => updateDetail(d.uid, "quantity", Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-0 focus:border-blue-500 text-center font-bold text-slate-800"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeDetail(d.uid)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-slate-100 rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || details.length === 0}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import React, { useRef, useState } from "react";
import { FileSpreadsheet, RefreshCcw, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ImportBarangButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const toastId = toast.loading("Membaca file Excel...");

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);

          if (data.length === 0) {
            toast.error("File Excel kosong", { id: toastId });
            setImporting(false);
            return;
          }

          toast.loading(`Mengimpor ${data.length} data barang...`, { id: toastId });

          const res = await fetch("/api/master/barang/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: data })
          });

          const resData = await res.json();
          if (resData.success) {
            toast.success(`Berhasil mengimpor ${resData.count} item!`, { id: toastId });
            router.refresh();
          } else {
            toast.error(resData.message || "Gagal mengimpor data", { id: toastId });
          }
        } catch (err) {
          toast.error("Gagal memproses file Excel", { id: toastId });
        } finally {
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
       toast.error("Terjadi kesalahan sistem", { id: toastId });
       setImporting(false);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const template = [
      {
        barangNama: "Contoh Nama Barang",
        barangHarga: 1500000,
        stokMinimum: 10,
        barangCategoryId: "isi_id_kategori",
        jenisBarangId: "isi_id_jenis",
        satuanId: "isi_id_satuan",
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format Import");
    XLSX.writeFile(wb, "Format_Import_Barang.xlsx");
    toast.info("Template berhasil diunduh");
  };

  return (
    <div className="flex items-center gap-2">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />
      <button 
        onClick={downloadTemplate}
        className="h-9 px-3 bg-white border border-slate-200 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1.5"
        title="Unduh Format Excel"
      >
        Format
      </button>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        className="h-9 px-3 bg-white border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-1.5 flex-none disabled:opacity-50"
      >
        {importing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
        {importing ? "Mengimpor..." : "Import Excel"}
      </button>
    </div>
  );
}

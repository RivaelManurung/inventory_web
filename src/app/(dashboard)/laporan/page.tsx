"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Table, FileSpreadsheet, RefreshCcw, Search, Filter, Printer } from "lucide-react";
import HeaderTitle from "@/components/layout/HeaderTitle";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { Box, PieChart as PieIcon, TrendingUp, DollarSign } from "lucide-react";

export default function LaporanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("stok");
  const [stats, setStats] = useState({
    totalItems: 0,
    totalStock: 0,
    totalValue: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/master/barang?all=true");
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
        
        // Calculate Stats
        let totalItems = resData.data.length;
        let totalStock = 0;
        let totalValue = 0;

        resData.data.forEach((item: any) => {
          const itemStok = item.barangGudangs.reduce((acc: number, curr: any) => acc + curr.stokTersedia, 0);
          totalStock += itemStok;
          totalValue += (itemStok * item.barangHarga);
        });

        setStats({ totalItems, totalStock, totalValue });
      }
    } catch (error) {
       toast.error("Gagal mengambil data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Stok Inventaris", 14, 15);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale })}`, 14, 22);

    const tableData = data.map((item, index) => [
      index + 1,
      item.barangKode,
      item.barangNama,
      item.barangCategory.name,
      item.barangGudangs.reduce((acc: number, curr: any) => acc + curr.stokTersedia, 0),
      item.satuan.name,
    ]);

    autoTable(doc, {
      head: [["No", "Kode", "Nama Barang", "Kategori", "Total Stok", "Satuan"]],
      body: tableData,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42] },
    });

    doc.save(`Laporan_Stok_${format(new Date(), "yyyyMMdd")}.pdf`);
    toast.success("PDF berhasil diunduh");
  };

  const exportExcel = () => {
    const worksheetData = data.map((item) => ({
      "Kode Barang": item.barangKode,
      "Nama Barang": item.barangNama,
      "Kategori": item.barangCategory.name,
      "Jenis": item.jenisBarang.name,
      "Total Stok": item.barangGudangs.reduce((acc: number, curr: any) => acc + curr.stokTersedia, 0),
      "Satuan": item.satuan.name,
      "Harga (Rp)": item.barangHarga,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stok Barang");
    XLSX.writeFile(workbook, `Laporan_Stok_${format(new Date(), "yyyyMMdd")}.xlsx`);
    toast.success("Excel berhasil diunduh");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <HeaderTitle title="Pusat Laporan & Ekspor" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-lg bg-primary/10 text-primary"><Box className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total SKU Barang</p>
               <h3 className="text-xl font-bold text-foreground">{stats.totalItems}</h3>
             </div>
           </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Unit Terdaftar</p>
               <h3 className="text-xl font-bold text-foreground">{stats.totalStock.toLocaleString()} Unit</h3>
             </div>
           </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500"><DollarSign className="w-5 h-5" /></div>
             <div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nilai Aset Inventaris</p>
               <h3 className="text-xl font-bold text-foreground">Rp {stats.totalValue.toLocaleString()}</h3>
             </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Sistem / Report</p>
          <h1 className="text-xl font-bold text-foreground">Manajemen Laporan</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-all shadow-sm">
             <FileText className="w-3.5 h-3.5" /> Export PDF
           </button>
           <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm">
             <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
           </button>
           <button onClick={() => window.print()} className="p-2 border border-border bg-card rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
             <Printer className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-card border border-border rounded-xl p-1 flex items-center md:col-span-1">
            <button 
              onClick={() => setFilter("stok")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filter === 'stok' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Box className="w-3.5 h-3.5" /> Stok
            </button>
         </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Pratinjau Data Laporan</h2>
          <button onClick={fetchData} className="text-muted-foreground hover:text-primary transition-colors">
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="pl-6 pr-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">No</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Info Barang</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Kategori & Jenis</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] text-center">Total Stok</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] pr-6">Nilai Aset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-8 text-center text-xs text-muted-foreground opacity-50">Menyiapkan data...</td></tr>
                ))
              ) : data.length > 0 ? (
                data.map((item, idx) => {
                  const totalStok = item.barangGudangs.reduce((acc: number, curr: any) => acc + curr.stokTersedia, 0);
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="pl-6 pr-4 py-4 text-xs font-medium text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-foreground text-sm">{item.barangNama}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{item.barangKode}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold text-primary uppercase block">{item.barangCategory.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">{item.jenisBarang.name}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${totalStok <= item.stokMinimum ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                          {totalStok} {item.satuan.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 pr-6 text-sm font-bold text-foreground">
                        Rp { (totalStok * item.barangHarga).toLocaleString() }
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">Tidak ada data untuk ditampilkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


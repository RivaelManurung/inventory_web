"use client";

import React from 'react';
import { 
  Calendar, 
  ChevronDown 
} from 'lucide-react';

export const tableData = [
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Budi Budiman", cabang: "002", petugas: "Fitri Handayani", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Tono Setiawan", cabang: "002", petugas: "Fitri Handayani", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Joko Lestari", cabang: "002", petugas: "Gunawan Prasetyo", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Fitri Wijaya", cabang: "002", petugas: "Gunawan Prasetyo", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Yanto Permana", cabang: "001", petugas: "Budi Santoso", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Citra Prasetyo", cabang: "001", petugas: "Budi Santoso", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
  { waktu: "14 Apr 2026, 14.23", jenis: "Telepon", debitur: "Eko Handoko", cabang: "001", petugas: "Dewi Lestari", catatan: "Ditugaskan ke Relationship Manager (DIRECT_MAP)" },
];

export default function AktivitasView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Aktivitas</h1>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">6191 total</span>
      </div>

      {/* Filters as in Image */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Dari</span>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:border-slate-300 transition-all">
            <span className="font-bold text-slate-700">04 / 14 / 2026</span>
            <Calendar size={14} className="text-slate-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Sampai</span>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:border-slate-300 transition-all">
            <span className="font-bold text-slate-700">04 / 14 / 2026</span>
            <Calendar size={14} className="text-slate-400" />
          </div>
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-1.5 pr-8 font-bold text-slate-700 focus:outline-none cursor-pointer hover:border-slate-300">
            <option>Telepon</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-1.5 pr-8 font-bold text-slate-700 focus:outline-none cursor-pointer hover:border-slate-300">
            <option>Semua Cabang</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-1.5 pr-8 font-bold text-slate-700 focus:outline-none cursor-pointer hover:border-slate-300">
            <option>Semua Petugas</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-all">
          Hari Ini
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pl-6 pr-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Jenis</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Debitur</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cabang</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Petugas</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{row.waktu}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-white text-slate-900 text-[11px] font-bold px-3 py-0.5 rounded border border-slate-200">
                      {row.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-blue-600 font-bold cursor-pointer hover:underline decoration-dashed">
                      {row.debitur}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-white text-slate-900 text-[11px] font-bold px-3 py-0.5 rounded border border-slate-200">
                      {row.cabang}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-bold">{row.petugas}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 leading-relaxed max-w-md group-hover:text-slate-700 transition-colors">
                    {row.catatan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

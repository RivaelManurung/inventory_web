"use client";

import React from 'react';
import { 
  Calendar, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  Activity 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stats = [
  { title: "Total Kasus", value: "1,284", change: "+12.5%", positive: true, icon: Briefcase },
  { title: "Tagihan Berjalan", value: "Rp 12.5M", change: "+5.2%", positive: true, icon: DollarSign },
  { title: "Collection Rate", value: "84.2%", change: "+2.1%", positive: true, icon: TrendingUp },
  { title: "Petugas Aktif", value: "48", change: "-2", positive: false, icon: UserCheck },
];

export const performanceData = [
  { label: "Sen", value: 45 },
  { label: "Sel", value: 52 },
  { label: "Rab", value: 48 },
  { label: "Kam", value: 65 },
  { label: "Jum", value: 59 },
  { label: "Sab", value: 32 },
  { label: "Min", value: 20 },
];

export default function DashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dasbor</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm font-bold text-slate-700">
            <Calendar size={14} className="text-slate-400" />
            16 April 2026
          </div>
        </div>
      </div>

      {/* Flat Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "text-[11px] font-bold px-2 py-1 rounded",
                stat.positive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              )}>
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Performance Chart - Flattened */}
        <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Performa Penagihan</h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-slate-900 rounded shadow-sm">Minggu</button>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Bulan</button>
            </div>
          </div>

          <div className="flex items-end justify-between h-[240px] gap-4 px-2">
            {performanceData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                <div className="w-full relative h-full flex items-end">
                  <div 
                    className="w-full bg-slate-100 rounded-t-md relative transition-all duration-500 hover:bg-blue-100" 
                    style={{ height: `${data.value}%` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {data.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Snippet - New Style */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Kasus Prioritas</h3>
            <button className="text-[11px] font-bold text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          
          <div className="flex-1 space-y-4">
            {[
              { name: "Andi Saputra", amount: "Rp 450M", risk: "Kritis" },
              { name: "Siti Aminah", amount: "Rp 125M", risk: "Tinggi" },
              { name: "Robertus K.", amount: "Rp 880M", risk: "Kritis" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div>
                  <p className="text-sm font-bold text-blue-600 group-hover:underline">{row.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{row.amount}</p>
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                  row.risk === "Kritis" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"
                )}>
                  {row.risk}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Sistem Status</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold">Semua sistem normal</span>
                </div>
                <Activity size={14} className="text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

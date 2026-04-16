"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  History,
  AlertTriangle,
  QrCode,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { stats, chartData, recentActivities } = data || {};

  const displayStats = [
    { label: "Total Barang", value: stats?.totalBarang || "0", icon: Package, color: "blue", trend: "-" },
    { label: "Stok Masuk (Bulan Ini)", value: stats?.stokMasuk || "0", icon: ArrowUpRight, color: "emerald", trend: "+" },
    { label: "Stok Keluar (Bulan Ini)", value: stats?.stokKeluar || "0", icon: ArrowDownRight, color: "rose", trend: "-" },
    { label: "Low Stock Items", value: stats?.lowStock || "0", icon: AlertTriangle, color: "amber", trend: "-" },
  ];
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Ringkasan Sistem</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-wide">Pantau status inventory dan aktivitas QR Code secara real-time.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        OP
                    </div>
                ))}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">3 Tim Online</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-${stat.color}-50 rounded-full transition-transform group-hover:scale-110 duration-500 opacity-50`}></div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <div className="flex items-baseline gap-3 mt-2">
                    <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">{stat.value}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {stat.trend}
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Statistik Pergerakan Barang</h3>
            </div>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 uppercase tracking-widest">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData || []}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}} 
                    cursor={{stroke: '#2563eb', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="masuk" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Aktivitas Terakhir</h3>
          </div>
          <div className="space-y-6">
            {(recentActivities || []).map((activity: any) => (
              <div key={activity.id} className="flex gap-4 group cursor-pointer hover:bg-slate-50 -mx-4 px-4 py-2 rounded-xl transition-all">
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:rotate-12 ${
                  activity.type === 'masuk' ? 'bg-emerald-50 text-emerald-600' : 
                  activity.type === 'keluar' ? 'bg-rose-50 text-rose-600' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  {activity.type === 'masuk' ? <ArrowUpRight className="w-5 h-5" /> : 
                   activity.type === 'keluar' ? <ArrowDownRight className="w-5 h-5" /> : 
                   <Clock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate leading-none mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {activity.item}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{activity.user} • {activity.time}</p>
                </div>
                <div className="text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                        activity.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                        {activity.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>

      {/* Warning/Info Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight leading-none mb-1">Peringatan Stok Rendah</h4>
                <p className="text-xs text-rose-600 font-medium">Terdapat 5 barang yang stoknya di bawah batas minimal. Segera lakukan pengadaan.</p>
            </div>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                <QrCode className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight leading-none mb-1">Fitur QR Scanner</h4>
                <p className="text-xs text-blue-600 font-medium">Gunakan perangkat mobile untuk melakukan scan QR Code pada fisik barang untuk info cepat.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

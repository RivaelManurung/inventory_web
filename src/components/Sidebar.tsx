"use client";

import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  Building2,
  Users,
  CreditCard,
  Settings,
  Upload,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const menuItems = [
  {
    group: "UTAMA", items: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Kasus", icon: Briefcase },
      { name: "Aktivitas", icon: Activity },
    ]
  },
  {
    group: "ADMINISTRASI", items: [
      { name: "Cabang", icon: Building2 },
      { name: "Pengguna", icon: Users },
      { name: "Produk Kredit", icon: CreditCard },
      { name: "Grup Kolektor", icon: Users },
      { name: "Hak Akses", icon: ShieldCheck },
      { name: "Aturan Penagihan", icon: Settings },
      { name: "Upload Snapshot", icon: Upload },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-72 bg-[#1a1f37] text-slate-400 flex flex-col fixed h-full z-50 transition-all duration-300 ease-in-out md:translate-x-0 border-r border-white/5 shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">
            CMS
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-inter font-bold text-lg leading-none tracking-tight">DOTS</h1>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">Collection Management System</p>
          </div>
        </div>

        
        <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-6 pb-8">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-3">
                {group.group}
              </h2>
              <div className="space-y-0.5">
                {group.items.map((item, idy) => (
                  <button
                    key={idy}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all duration-200 group relative",
                      activeTab === item.name
                        ? "bg-[#2d3748] text-white shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    {activeTab === item.name && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                    )}
                    <item.icon size={18} className={cn(
                      "transition-colors",
                      activeTab === item.name ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                    )} />
                    <span className="text-[14px] font-semibold tracking-tight">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate leading-none mb-1">John Doe</p>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

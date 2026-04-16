"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Warehouse,
  Tags,
  ArrowLeftRight,
  ClipboardList,
  BarChart3,
  Settings,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Main Menu",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Master Data",
    items: [
      { name: "Daftar Barang", href: "/master/barang", icon: Box },
      { name: "Gudang", href: "/master/gudang", icon: Warehouse },
      { name: "Kategori", href: "/master/kategori", icon: Tags },
    ],
  },
  {
    title: "Inventory",
    items: [
      { name: "Stok Masuk/Keluar", href: "/transaksi", icon: ArrowLeftRight },
      { name: "Stok Opname", href: "/opname", icon: ClipboardList },
    ],
  },
  {
    title: "Analitik",
    items: [
      { name: "Laporan Stok", href: "/laporan", icon: BarChart3 },
    ],
  },
  {
    title: "Sistem",
    items: [
      { name: "Manajemen User", href: "/users", icon: Users },
      { name: "Pengaturan", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-68 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
          <Warehouse className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-none">DOTS</h1>
          <p className="text-[10px] font-semibold text-slate-400 mt-1 tracking-wider uppercase">Inventory system</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {menuItems.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
          <span className="text-sm font-medium">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}

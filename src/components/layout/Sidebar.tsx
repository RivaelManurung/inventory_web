"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Warehouse,
  Tags,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Users,
  LogOut,
  ChevronRight,
  ChevronDown,
  PlusSquare,
  MinusSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const menuItems = [
  {
    title: "Utama",
    items: [
      { name: "Dasbor", href: "/dashboard", icon: LayoutDashboard },
      { name: "Master Barang", href: "/master/barang", icon: Box },
      { name: "Lokasi Gudang", href: "/master/gudang", icon: Warehouse },
    ],
  },
  {
    title: "Operasional",
    items: [
      {
        name: "Transaksi Stok",
        href: "/transaksi",
        icon: ArrowLeftRight,
        subItems: [
          { name: "Transaksi Masuk", href: "/transaksi?type=masuk", icon: PlusSquare },
          { name: "Transaksi Keluar", href: "/transaksi?type=keluar", icon: MinusSquare },
        ],
      },
      { name: "Laporan Inventaris", href: "/laporan", icon: BarChart3 },
    ],
  },
  {
    title: "Administrasi",
    items: [
      { name: "Kategori Barang", href: "/master/kategori", icon: Tags },
      { name: "Manajemen User", href: "/users", icon: Users },
      { name: "Pengaturan Sistem", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openMenus, setOpenMenus] = useState<string[]>(["Transaksi Stok"]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-60 flex flex-col shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* Brand Header */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold tracking-tight">CMS</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold leading-none">DOTS</p>
          <p className="text-sidebar-foreground/60 text-[10px] leading-tight mt-0.5 truncate">
            Inventory System
          </p>
        </div>
      </div>

      {/* Branch context */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-sidebar-accent/40 border border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wide font-medium">
          Kantor Pusat
        </p>
        <p className="text-xs text-sidebar-foreground mt-0.5 truncate">
          {session?.user?.name ?? "—"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        {menuItems.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const hasSubItems = !!item.subItems;
                const isOpen = openMenus.includes(item.name);
                const isActive =
                  pathname === item.href ||
                  (hasSubItems && item.subItems?.some((s) => pathname.startsWith(s.href))) ||
                  (!hasSubItems && item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <li key={item.name} className="space-y-0.5">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-primary" : "text-sidebar-foreground/40"
                          )}
                        />
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 text-sidebar-foreground/20 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-primary" : "text-sidebar-foreground/40"
                          )}
                        />
                        <span className="flex-1">{item.name}</span>
                        {isActive && <ChevronRight className="w-3 h-3 text-sidebar-foreground/20" />}
                      </Link>
                    )}

                    {/* Sub Items */}
                    {hasSubItems && isOpen && (
                      <ul className="mt-1 ml-5 pl-3 border-l border-sidebar-border space-y-0.5">
                        {item.subItems?.map((sub) => {
                          const subActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors",
                                  subActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : "text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/50"
                                )}
                              >
                                <sub.icon className="w-3.5 h-3.5" />
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-primary">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-none">
              {session?.user?.name ?? "—"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate mt-0.5">
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-sidebar-foreground/40 hover:text-red-400 hover:bg-sidebar-accent/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

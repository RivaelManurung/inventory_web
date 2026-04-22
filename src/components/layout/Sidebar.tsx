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
  ShieldCheck,
  History,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useSettings } from "@/context/SettingsContext";

const menuItems = [
  {
    title: "Utama",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
      { name: "Master Barang", href: "/master/barang", icon: Box, permission: "barang.view" },
      { name: "Lokasi Gudang", href: "/master/gudang", icon: Warehouse, permission: "gudang.view" },
    ],
  },
  {
    title: "Operasional",
    items: [
      {
        name: "Transaksi Stok",
        href: "/transaksi",
        icon: ArrowLeftRight,
        permission: "transaksi.view",
        subItems: [
          { name: "Transaksi Masuk", href: "/transaksi?type=masuk", icon: PlusSquare },
          { name: "Transaksi Keluar", href: "/transaksi?type=keluar", icon: MinusSquare },
          { name: "Penyesuaian Stok", href: "/transaksi/adjustment", icon: RefreshCcw },
        ],
      },
      { name: "Laporan Inventaris", href: "/laporan", icon: BarChart3, permission: "transaksi.view" },
    ],
  },
  {
    title: "Administrasi",
    items: [
      { name: "Kategori Barang", href: "/master/kategori", icon: Tags, permission: "barang.view" },
      { name: "Manajemen User", href: "/users", icon: Users, permission: "users.view" },
      { name: "Hak Akses", href: "/roles", icon: ShieldCheck, permission: "roles.view" },
      { name: "Audit Trail", href: "/logs", icon: History, permission: "superadmin" },
      { name: "Pusat Laporan", href: "/laporan", icon: BarChart3, permission: "transaksi.view" },
      { name: "Pengaturan Sistem", href: "/settings", icon: Settings, permission: "settings.view" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { settings } = useSettings();
  const [openMenus, setOpenMenus] = useState<string[]>(["Transaksi Stok"]);

  const userPermissions = (session?.user as any)?.permissions || [];
  const userRole = (session?.user as any)?.role || "";
  const userRoleName = (session?.user as any)?.roleName || "";
  const isSuperadmin = userRole === "superadmin";

  const hasPermission = (permission?: string) => {
    if (!permission || isSuperadmin) return true;
    return userPermissions.includes(permission);
  };

  const filteredMenuItems = menuItems.map(group => ({
    ...group,
    items: group.items.filter(item => hasPermission(item.permission))
  })).filter(group => group.items.length > 0);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-60 flex flex-col shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* Brand Header */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0 overflow-hidden">
          {settings?.webLogo ? (
            <img src={settings.webLogo} alt={settings.webNama} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-[10px] font-bold tracking-tight">
              {settings?.webNama?.substring(0, 3).toUpperCase() || "CMS"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-base font-bold leading-none truncate tracking-tight">
            {settings?.webNama || "DOTS"}
          </p>
          <p className="text-sidebar-foreground/60 text-xs leading-tight mt-1 truncate uppercase tracking-widest font-medium">
            Inventory System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        {filteredMenuItems.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">
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
                                   "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                                   subActive
                                     ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                     : "text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/50"
                                )}
                              >
                                <sub.icon className="w-4 h-4" />
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
            <p className="text-sm font-semibold text-white truncate leading-none">
              {session?.user?.name ?? "—"}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate mt-1 uppercase tracking-wider">
              {userRoleName || userRole || "User"}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-sidebar-foreground/40 hover:text-red-400 hover:bg-sidebar-accent/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

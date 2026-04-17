"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import NotificationWatcher from "@/components/layout/NotificationWatcher";
import { useState, useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Map paths to permissions for protection
const routePermissions: Record<string, string> = {
  "/dashboard": "dashboard.view",
  "/master/barang": "barang.view",
  "/master/gudang": "gudang.view",
  "/transaksi": "transaksi.view",
  "/laporan": "transaksi.view",
  "/master/kategori": "barang.view",
  "/users": "users.view",
  "/roles": "roles.view",
  "/settings": "settings.view",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings } = useSettings();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthorized = useMemo(() => {
    if (status === "loading") return true; 
    if (!session) return false;

    const user = session.user as any;
    if (user.role === "superadmin") return true;

    // Find the required permission for the current path
    const requiredPermission = Object.entries(routePermissions).find(([path]) => 
      pathname.startsWith(path)
    )?.[1];

    if (!requiredPermission) return true; // Public dashboard pages or catch-all
    return user.permissions?.includes(requiredPermission);
  }, [session, status, pathname]);

  // If not authorized and loading is finished, show access denied or redirect
  if (status !== "loading" && !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3.29V17a2 2 0 00-2-2h-1.03a3.33 3.33 0 00-6.44 0H4a2 2 0 00-2 2v3.29a2 2 0 00.584 1.41l1.41 1.41A2 2 0 005.41 22h13.18a2 2 0 001.41-.586l1.41-1.41a2 2 0 00.586-1.414z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-foreground">Akses Ditolak</h1>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator.
        </p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background font-sans antialiased overflow-hidden">
      <NotificationWatcher />
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto py-4">
          <div className="flex w-full flex-col gap-4 px-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 bg-card border-t border-border flex justify-between items-center shrink-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings?.webNama || "Inventory"} Inventory.
          </p>
          <span className="text-sm text-muted-foreground/60">Premium Enterprise Edition</span>
        </footer>
      </div>
    </div>
  );
}

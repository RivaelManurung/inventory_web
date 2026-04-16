"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import NotificationWatcher from "@/components/layout/NotificationWatcher";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings } = useSettings();

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

        <main className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto flex w-full flex-col gap-4">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 bg-card border-t border-border flex justify-between items-center shrink-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings?.webNama || "DOTS"} Inventory.
          </p>
          <span className="text-xs text-muted-foreground/60">Premium Enterprise Edition</span>
        </footer>
      </div>
    </div>
  );
}

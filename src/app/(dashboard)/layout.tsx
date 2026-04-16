"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-68 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-68 bg-white z-50 lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-6 lg:p-8 shrink-0">
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* Footer info (subtle) */}
        <footer className="px-6 lg:px-8 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} DOTS INVENTORY SYSTEM. v1.0.0
            </p>
            <div className="flex gap-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Premium Enterprise Edition</span>
            </div>
        </footer>
      </div>
    </div>
  );
}

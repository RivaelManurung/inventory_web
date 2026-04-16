"use client";

import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden border border-slate-200"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">CMS DOTS</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-all group">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

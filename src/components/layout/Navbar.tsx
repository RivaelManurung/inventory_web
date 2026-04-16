"use client";

import { useSession, signOut } from "next-auth/react";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left Wall */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari barang atau transaksi..." 
            className="bg-transparent border-none focus:outline-none text-sm w-64 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Wall */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group">
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-100 mx-2"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-full transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {session?.user?.name || "Premium User"}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">
                {session?.user?.role || "Administrator"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-100">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfile(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">User Sesi</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{session?.user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left uppercase font-medium tracking-wide">
                    <User className="w-4 h-4" /> Profil Saya
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left uppercase font-medium tracking-wide">
                    <Settings className="w-4 h-4" /> Pengaturan Akun
                  </button>
                </div>
                <div className="p-2 border-t border-gray-50">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left uppercase font-medium tracking-wide"
                  >
                    <LogOut className="w-4 h-4" /> Keluar Sistem
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Settings, User, Menu, Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useHeader } from "@/context/HeaderContext";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";
import { format } from "date-fns";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { title } = useHeader();
  const { settings } = useSettings();

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/notifications/unread");
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (e) {}
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications/unread", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {}
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Sync setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
        >
          <Menu className="w-4 h-4 text-muted-foreground" />
        </button>
        <h1 className="text-sm font-semibold text-foreground">{title === "Dashboard" ? (settings?.webNama || "Dashboard") : title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-md transition-all ${showNotifications ? 'bg-accent text-primary' : 'hover:bg-accent text-muted-foreground'}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-[11px] font-bold text-white flex items-center justify-center rounded-full border-2 border-card animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Notifikasi Sistem</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{notifications.length} Baru</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div key={note.id} className="p-4 border-b border-border/50 hover:bg-muted/20 transition-colors group relative">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 h-fit ${note.title.includes('Habis') ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {note.title.includes('Habis') ? <AlertCircle className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0 pr-6">
                            <p className="text-sm font-bold text-foreground leading-tight">{note.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{note.message}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-1.5 flex items-center gap-1">
                              {format(new Date(note.createdAt), "HH:mm")} • Baru saja
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => markAsRead(note.id)}
                          className="absolute top-4 right-4 p-1 rounded-md hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Tandai Baca"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center space-y-2">
                       <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto" />
                       <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Tidak ada notifikasi baru</p>
                    </div>
                  )}
                </div>
                 {notifications.length > 0 && (
                  <div className="p-2 bg-muted/20 border-t border-border">
                    <button className="w-full py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.1em]">
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="relative">
           <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {session?.user?.name ?? "—"}
            </span>
            <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-[11px] font-bold text-primary">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-in fade-in duration-150">
                 <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm text-muted-foreground font-medium">User Aktif</p>
                  <p className="text-base font-bold text-foreground truncate mt-0.5">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link 
                    href="/profile" 
                    onClick={() => setShowProfile(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" /> Profil
                  </Link>
                  <Link 
                    href="/settings"
                    onClick={() => setShowProfile(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-muted-foreground" /> Pengaturan
                  </Link>
                </div>
                <div className="p-1.5 border-t border-border">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

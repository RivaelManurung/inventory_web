"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, RefreshCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteAction({ id, name, module }: { id: string, name: string, module: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const toastId = toast.loading(`Sedang menghapus ${name}...`);
    try {
      const res = await fetch(`/api/master/${module}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${name} berhasil dihapus`, { id: toastId });
        router.push(`/master/${module}`);
        router.refresh();
      } else {
        toast.error(data.message || `Gagal menghapus ${module}`, { id: toastId });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.", { id: toastId });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium hover:bg-destructive hover:text-white transition-all group shadow-sm"
      >
        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
        Hapus
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2">Konfirmasi Hapus</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-bold text-foreground">"{name}"</span>? 
                Tindakan ini tidak dapat dibatalkan dan semua data terkait akan diarsipkan.
              </p>
            </div>

            <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold hover:bg-destructive/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {loading ? "Menghapus..." : "Ya, Hapus Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

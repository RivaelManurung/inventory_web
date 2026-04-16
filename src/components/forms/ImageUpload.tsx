"use client";

import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon, RefreshCcw } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  uploadLabel?: string;
  previewClassName?: string;
}

export default function ImageUpload({ value, onChange, label, uploadLabel = "Pilih Berkas", previewClassName = "w-full aspect-square" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onChange(data.url);
      } else {
        alert(data.message || "Gagal mengunggah gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat mengunggah.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`${previewClassName} rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all`}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Ganti Gambar</span>
            </div>
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {loading ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-tight">{uploadLabel}</p>
              <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, atau WEBP (Maks. 5MB)</p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={loading}
        />
      </div>
    </div>
  );
}

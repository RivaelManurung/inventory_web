"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera, RefreshCw, Zap, ZapOff, FlipHorizontal } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const startScanner = async () => {
    if (!isOpen) return;
    
    setIsCameraReady(false);
    setError(null);

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 180 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_128,
        ],
      };

      await scanner.start(
        { facingMode: cameraFacing },
        config,
        (decodedText) => {
          onScan(decodedText);
          stopScanner().then(onClose);
        },
        () => {} // silent on scan failure
      );

      setIsCameraReady(true);
    } catch (err: any) {
      console.error("Scanner Start Error:", err);
      setError("Izin kamera ditolak atau kamera tidak ditemukan. Pastikan browser diizinkan mengakses kamera.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure div is rendered
      const timer = setTimeout(startScanner, 500);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen, cameraFacing]);

  const toggleCamera = () => {
    setCameraFacing(prev => prev === "user" ? "environment" : "user");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Top Controls */}
        <div className="absolute top-0 inset-x-0 h-20 px-8 flex items-center justify-between z-20">
          <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Kamera Aktif</span>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleCamera} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all">
              <FlipHorizontal className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative aspect-square bg-black overflow-hidden group">
          <div id="reader" className="w-full h-full" />
          
          {!isCameraReady && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-10">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Menyiapkan Lensa...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-black z-10">
              <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
                <ZapOff className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-white font-bold mb-2">Akses Kamera Gagal</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-8">{error}</p>
              <button 
                onClick={startScanner}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Coba Lagi
              </button>
            </div>
          )}

          {/* Overlay Frame */}
          {isCameraReady && !error && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 border-[40px] border-black/40" />
              <div className="absolute inset-[40px] flex items-center justify-center">
                <div className="w-full h-full border-2 border-white/20 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                  <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                  <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                  <div className="absolute inset-x-8 top-1/2 h-0.5 bg-primary/40 animate-scan" />
                  <div className="absolute bottom-6 inset-x-0 text-center">
                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md inline-block px-4 py-2 rounded-full border border-white/10">Scanning...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#111] border-t border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Arahkan ke Barcode</h4>
              <p className="text-xs text-white/40 leading-relaxed">Letakkan barcode di tengah kotak. Pastikan tidak silau atau terlalu gelap.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        #reader { overflow: hidden; }
        #reader video { 
          width: 100% !important; 
          height: 100% !important; 
          object-fit: cover !important;
          transform: ${cameraFacing === "user" ? "scaleX(-1)" : "none"};
        }
        #reader canvas { display: none !important; }
        @keyframes scan {
          0%, 100% { transform: translateY(-80px); opacity: 0; }
          50% { transform: translateY(80px); opacity: 1; }
        }
        .animate-scan { animation: scan 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}


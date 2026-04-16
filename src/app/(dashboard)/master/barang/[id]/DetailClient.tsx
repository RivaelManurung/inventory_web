"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode } from "lucide-react";

export default function DetailClient({ data }: { data: any }) {
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    // Create canvas
    const svg: any = qrRef.current;
    
    // Parse SVG to canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Get SVG data
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 60; // Extra space for text text
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Set white bg
        ctx.drawImage(img, 20, 20); // Draw QR with padding
        
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(data.barangKode, canvas.width / 2, canvas.height - 15);
        
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `QR_${data.barangKode}.png`;
        a.click();
      }
    };
    img.src = image64;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 sticky top-24 text-center">
      <div className="flex items-center justify-center gap-2 text-blue-600 mb-6">
        <QrCode className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">QR Code Barang</span>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-100 inline-flex mx-auto">
        <QRCodeSVG 
          id="qr-gen"
          ref={qrRef}
          value={data.barangKode} 
          size={180}
          level="H" // High error correction
          includeMargin={false}
          className="rounded-lg shadow-sm"
        />
        <div className="mt-4 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{data.barangKode}</p>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-3">
        <button 
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200"
        >
          <Download className="w-4 h-4" /> Download PNG
        </button>
        <p className="text-[10px] text-slate-400 font-medium">Cetak dan tempelkan QR Code ini pada aset fisik untuk mempermudah scan transaksi.</p>
      </div>
    </div>
  );
}
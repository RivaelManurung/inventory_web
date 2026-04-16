"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Box } from "lucide-react";

export default function DetailClient({ data }: { data: any }) {
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg: any = qrRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const image64 = "data:image/svg+xml;base64," + svg64;

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 60;

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);

        ctx.fillStyle = "black";
        ctx.font = "bold 14px monospace";
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
    <div className="space-y-4">
      {/* Foto Barang */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Foto Barang</p>
        </div>
        <div className="p-4">
          <div className="aspect-square bg-muted/50 border border-border rounded-lg flex items-center justify-center overflow-hidden">
            {data.barangGambar ? (
              <img
                src={data.barangGambar}
                alt={data.barangNama}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                <Box className="w-10 h-10" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Belum ada foto</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">QR Code Barang</p>
        </div>
        <div className="p-5 flex flex-col items-center gap-4">
          {/* QR Display */}
          <div className="p-4 bg-white rounded-lg border border-border flex flex-col items-center gap-3">
            <QRCodeSVG
              id="qr-gen"
              ref={qrRef}
              value={data.barangKode}
              size={160}
              level="H"
              includeMargin={false}
            />
            <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-md w-full text-center">
              <p className="text-xs font-mono font-semibold text-foreground">{data.barangKode}</p>
            </div>
          </div>

          {/* Download Button - sama dengan tombol Edit */}
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            Cetak dan tempelkan QR code ini pada aset fisik untuk mempermudah scan transaksi.
          </p>
        </div>
      </div>
    </div>
  );
}
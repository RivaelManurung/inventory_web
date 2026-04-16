"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { HeaderProvider } from "@/context/HeaderContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HeaderProvider>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a1a1a', // Abu-abu gelap (Charcoal)
              border: '1px solid #333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#1a1a1a',
                border: '1px solid #10b981', // Border hijau
                color: '#10b981', // Teks hijau cerah
              },
            },
            error: {
              style: {
                background: '#1a1a1a',
                border: '1px solid #ef4444', // Border merah
                color: '#ef4444', // Teks merah cerah
              },
            },
          }}
        />
      </HeaderProvider>
    </SessionProvider>
  );
}

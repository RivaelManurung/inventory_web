"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { HeaderProvider } from "@/context/HeaderContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <HeaderProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            toastOptions={{
              style: {
                background: 'var(--card)', 
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              },
            }}
          />
        </HeaderProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

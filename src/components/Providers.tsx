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
              className: "border-none shadow-2xl",
              style: {
                padding: "16px 20px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
            }}
          />
        </HeaderProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}

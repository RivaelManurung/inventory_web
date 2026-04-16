"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Package } from "lucide-react";

export default function NotificationWatcher() {
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  const checkNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/unread");
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        data.data.forEach((note: any) => {
          // Show toast for each unread notification
          toast(note.title, {
            description: note.message,
            icon: note.title.includes("Habis") ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <Package className="w-4 h-4 text-amber-500" />,
            duration: 5000,
            action: {
              label: "Tandai Baca",
              onClick: () => markAsRead(note.id)
            }
          });
          
          // Auto mark as read or just let the user see it
          // We mark as read so they don't pop up again on next poll
          markAsRead(note.id);
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications/unread", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {}
  };

  useEffect(() => {
    // Check initially
    checkNotifications();

    // Poll every 30 seconds for new alerts
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything visible
}

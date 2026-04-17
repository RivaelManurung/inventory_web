"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Check, ShieldAlert, ShieldCheck, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  name: string;
  slug: string;
  module: string;
}

interface RolePermission {
  permissionId: string;
  isAllowed: boolean;
}

interface PermissionManagerProps {
  roleId: string;
  allPermissions: Permission[];
  rolePermissions: RolePermission[];
}

export default function PermissionManager({
  roleId,
  allPermissions,
  rolePermissions,
}: PermissionManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>(rolePermissions);

  // Group permissions by module
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const togglePermission = async (permissionId: string, currentStatus: boolean) => {
    setLoading(permissionId);
    const newStatus = !currentStatus;

    try {
      const res = await fetch(`/api/roles/${roleId}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionId, isAllowed: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui hak akses");

      setPermissions((prev) => {
        const index = prev.findIndex((p) => p.permissionId === permissionId);
        if (index === -1) {
          return [...prev, { permissionId, isAllowed: newStatus }];
        }
        const next = [...prev];
        next[index] = { ...next[index], isAllowed: newStatus };
        return next;
      });

      toast.success(newStatus ? "Akses diberikan" : "Akses dicabut");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(null);
    }
  };

  const isAllowed = (permissionId: string) => {
    return permissions.find((p) => p.permissionId === permissionId)?.isAllowed ?? false;
  };

  const modules = Object.keys(groupedPermissions).sort();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {modules.map((moduleName) => (
        <div 
          key={moduleName}
          className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm"
        >
          <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {moduleName}
            </h3>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {groupedPermissions[moduleName].length} Fitur
            </span>
          </div>
          
          <div className="p-2 divide-y divide-border/50">
            {groupedPermissions[moduleName].map((perm) => {
              const allowed = isAllowed(perm.id);
              const isLoading = loading === perm.id;
              
              return (
                <div 
                  key={perm.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-sm font-semibold transition-colors",
                      allowed ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {perm.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      {perm.slug}
                    </span>
                  </div>

                  <button
                    disabled={!!loading}
                    onClick={() => togglePermission(perm.id, allowed)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                      allowed ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center",
                        allowed ? "translate-x-5" : "translate-x-0"
                      )}
                    >
                      {isLoading ? (
                        <div className="w-2 h-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : allowed ? (
                        <Check className="w-3 h-3 text-primary font-black" />
                      ) : null}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

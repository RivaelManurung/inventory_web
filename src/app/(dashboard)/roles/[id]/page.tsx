import React from "react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";
import { notFound } from "next/navigation";
import PermissionManager from "@/components/roles/PermissionManager";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        select: {
          permissionId: true,
          isAllowed: true,
        }
      }
    }
  });

  if (!role) {
    return notFound();
  }

  const allPermissions = await prisma.permission.findMany({
    orderBy: [
      { module: 'asc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <Link 
          href="/roles" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Role
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{role.name}</h1>
                <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  {role.slug}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {role.description || "Atur hak akses untuk peran ini agar pengguna dapat mengakses fitur sesuai dengan tanggung jawab mereka."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <PermissionManager 
        roleId={role.id}
        allPermissions={allPermissions}
        rolePermissions={role.permissions}
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roleId } = await params;
    const { permissionId, isAllowed } = await req.json();

    if (!roleId || !permissionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rolePermission = await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      update: {
        isAllowed,
      },
      create: {
        roleId,
        permissionId,
        isAllowed,
      },
    });

    return NextResponse.json(rolePermission);
  } catch (error: any) {
    console.error("[PERMISSIONS_POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

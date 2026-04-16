import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true },
    });
    if (!user) return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phoneNumber, roleId, avatar } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, phoneNumber, roleId, avatar },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, message: "User berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

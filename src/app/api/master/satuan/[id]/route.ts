import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.satuan.findUnique({ where: { id, deletedAt: null } });
    if (!data) return NextResponse.json({ success: false, message: "Satuan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updated = await prisma.satuan.update({
      where: { id },
      data: { name, slug, description },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.satuan.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Satuan berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

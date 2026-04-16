import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await prisma.barangCategory.findUnique({
      where: { id, deletedAt: null },
    });
    if (!category) return NextResponse.json({ success: false, message: "Kategori tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updated = await prisma.barangCategory.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Soft delete
    await prisma.barangCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

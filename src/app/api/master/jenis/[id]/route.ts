import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/error-handler";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.jenisBarang.findUnique({ where: { id, deletedAt: null } });
    if (!data) return NextResponse.json({ success: false, message: "Jenis tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return handlePrismaError(error, "GET JENIS BARANG BY ID");
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;
    
    if (!name) return NextResponse.json({ success: false, message: "Nama harus diisi" }, { status: 400 });
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updated = await prisma.jenisBarang.update({
      where: { id },
      data: { name, slug, description },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return handlePrismaError(error, "PATCH JENIS BARANG");
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.jenisBarang.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Jenis berhasil dihapus" });
  } catch (error: any) {
    return handlePrismaError(error, "DELETE JENIS BARANG");
  }
}

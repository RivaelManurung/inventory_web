import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/error-handler";
import { createLog } from "@/lib/activity-log";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.barang.findUnique({
      where: { id, deletedAt: null },
      include: {
        jenisBarang: true,
        satuan: true,
        barangCategory: true,
      }
    });
    if (!data) return NextResponse.json({ success: false, message: "Barang tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return handlePrismaError(error, "GET BARANG BY ID");
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      barangNama, 
      barangHarga, 
      stokMinimum,
      barangCategoryId,
      jenisBarangId,
      satuanId,
      barangGambar,
      isActive
    } = body;
    
    if (!barangNama) return NextResponse.json({ success: false, message: "Nama barang harus diisi" }, { status: 400 });

    const barangSlug = barangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updated = await prisma.barang.update({
      where: { id },
      data: {
        barangNama,
        barangSlug,
        barangHarga: barangHarga ? (typeof barangHarga === 'number' ? barangHarga : parseFloat(barangHarga)) : undefined,
        stokMinimum: stokMinimum ? (typeof stokMinimum === 'number' ? stokMinimum : parseInt(stokMinimum)) : undefined,
        barangCategory: barangCategoryId ? { connect: { id: barangCategoryId } } : undefined,
        jenisBarang: jenisBarangId ? { connect: { id: jenisBarangId } } : undefined,
        satuan: satuanId ? { connect: { id: satuanId } } : undefined,
        barangGambar,
        isActive: typeof isActive === "boolean" ? isActive : undefined,
      },
    });

    const session = await auth();
    if (session?.user?.id) {
      await createLog(
        session.user.id,
        "UPDATE",
        "BARANG",
        `Memperbarui data barang: ${barangNama} (${updated.barangKode})`
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return handlePrismaError(error, "PATCH BARANG");
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.barang.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    const session = await auth();
    if (session?.user?.id) {
      await createLog(
        session.user.id,
        "DELETE",
        "BARANG",
        `Menghapus barang dengan ID: ${id}`
      );
    }

    return NextResponse.json({ success: true, message: "Barang berhasil dihapus" });
  } catch (error: any) {
    return handlePrismaError(error, "DELETE BARANG");
  }
}

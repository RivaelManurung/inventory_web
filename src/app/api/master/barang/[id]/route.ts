import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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

    const barangSlug = barangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    console.log("Updating Barang:", { id, barangNama, barangHarga, isActive });

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

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Prisma Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.barang.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, message: "Barang berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

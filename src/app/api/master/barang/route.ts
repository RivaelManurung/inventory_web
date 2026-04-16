import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = await prisma.barang.findMany({
      where: {
        deletedAt: null,
        OR: [
          { barangKode: { contains: search, mode: "insensitive" } },
          { barangNama: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        barangCategory: true,
        jenisBarang: true,
        satuan: true,
        barangGudangs: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // limit for now
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      barangNama,
      barangHarga,
      stokMinimum,
      jenisBarangId,
      satuanId,
      barangCategoryId,
      userId
    } = body;

    // Generate Slug
    const barangSlug = barangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Check if sluf or name already exists
    const existing = await prisma.barang.findFirst({
      where: { OR: [{ barangNama }, { barangSlug }] }
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Nama barang sudah terdaftar!" }, { status: 400 });
    }

    // Auto-generate barangKode: BRG-0001
    const latestBarang = await prisma.barang.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNum = 1;
    if (latestBarang && latestBarang.barangKode) {
      const match = latestBarang.barangKode.match(/\d+$/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    const barangKode = `BRG-${nextNum.toString().padStart(4, '0')}`;

    // Create Barang
    const newData = await prisma.barang.create({
      data: {
        barangKode,
        barangNama,
        barangSlug,
        barangHarga: Number(barangHarga) || 0,
        stokMinimum: Number(stokMinimum) || 0,
        jenisBarangId,
        satuanId,
        barangCategoryId,
        userId: userId || "clv0q1abc000008lc2j2x3j4k", // dummy default
      }
    });

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
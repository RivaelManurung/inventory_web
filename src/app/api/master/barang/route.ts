import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/error-handler";
import { createLog } from "@/lib/activity-log";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const all = searchParams.get("all") === "true";
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      OR: [
        { barangKode: { contains: search, mode: "insensitive" } },
        { barangNama: { contains: search, mode: "insensitive" } },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.barang.findMany({
        where,
        include: {
          barangCategory: true,
          jenisBarang: true,
          satuan: true,
          barangGudangs: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: all ? undefined : skip,
        take: all ? undefined : limit,
      }),
      prisma.barang.count({ where })
    ]);

    return NextResponse.json({ 
      success: true, 
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return handlePrismaError(error, "GET BARANG");
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      barangNama,
      barangHarga,
      stokMinimum,
      jenisBarangId,
      satuanId,
      barangCategoryId,
      barangGambar,
      isActive
    } = body;
    
    if (!barangNama) return NextResponse.json({ success: false, message: "Nama barang harus diisi" }, { status: 400 });

    // Generate Slug
    const barangSlug = barangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

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
        barangGambar,
        barangHarga: Number(barangHarga) || 0,
        stokMinimum: Number(stokMinimum) || 0,
        jenisBarangId,
        satuanId,
        barangCategoryId,
        isActive: typeof isActive === "boolean" ? isActive : true,
        userId: session.user.id,
      }
    });

    // Logging
    await createLog(
      session.user.id,
      "CREATE",
      "BARANG",
      `Menambahkan barang baru: ${barangNama} (${barangKode})`
    );

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return handlePrismaError(error, "CREATE BARANG");
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/error-handler";
import { createLog } from "@/lib/activity-log";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak valid" }, { status: 400 });
    }

    // Prepare data
    const results = await prisma.$transaction(async (tx) => {
      const createdItems = [];
      
      for (const item of items) {
        // Basic naming check
        if (!item.barangNama) continue;

        const barangSlug = item.barangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        
        // Auto-generate barangKode
        const lastTrx = await tx.barang.findFirst({ orderBy: { createdAt: 'desc' } });
        let nextNum = 1;
        if (lastTrx && lastTrx.barangKode) {
           const match = lastTrx.barangKode.match(/\d+$/);
           if (match) nextNum = parseInt(match[0], 10) + 1;
        }
        const barangKode = `BRG-${nextNum.toString().padStart(4, '0')}`;

        const newItem = await tx.barang.create({
          data: {
            barangKode,
            barangNama: item.barangNama,
            barangSlug,
            barangHarga: Number(item.barangHarga) || 0,
            stokMinimum: Number(item.stokMinimum) || 0,
            jenisBarangId: item.jenisBarangId,
            satuanId: item.satuanId,
            barangCategoryId: item.barangCategoryId,
            userId: session.user.id,
            isActive: true
          }
        });
        createdItems.push(newItem);
      }
      return createdItems;
    });

    await createLog(
      session.user.id,
      "CREATE",
      "BARANG",
      `Import massal barang: ${results.length} item berhasil diimpor`
    );

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    return handlePrismaError(error, "IMPORT BARANG");
  }
}

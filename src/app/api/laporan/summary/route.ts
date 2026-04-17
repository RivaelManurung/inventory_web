import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    // 1. Total Model Barang
    const totalBarangModel = await prisma.barang.count({
      where: { deletedAt: null }
    });

    // 2. Total Stok Keseluruhan
    const stokAggregation = await prisma.barangGudang.aggregate({
      _sum: { stokTersedia: true },
      where: { deletedAt: null }
    });
    const totalStokKeseluruhan = stokAggregation._sum.stokTersedia || 0;

    // 3. Masuk & Keluar (Bulan Ini)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: { gte: firstDayOfMonth },
        deletedAt: null,
        status: 'COMPLETED'
      },
      include: {
        transactionType: true,
        details: true
      }
    });

    let masuk = 0;
    let keluar = 0;

    transactions.forEach(trx => {
      const totalQty = trx.details.reduce((sum, d) => sum + d.quantity, 0);
      if (trx.transactionType.slug.includes('masuk')) {
        masuk += totalQty;
      } else if (trx.transactionType.slug.includes('keluar')) {
        keluar += totalQty;
      }
    });

    // 4. Total Nilai Inventaris
    const allStok = await prisma.barangGudang.findMany({
      where: { deletedAt: null },
      include: { barang: true }
    });

    const totalNilaiInventaris = allStok.reduce((sum, item) => {
      return sum + (item.stokTersedia * (item.barang.barangHarga || 0));
    }, 0);

    return NextResponse.json({
      totalBarangModel,
      totalStokKeseluruhan,
      pergerakanBulanIni: { masuk, keluar },
      totalNilaiInventaris
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
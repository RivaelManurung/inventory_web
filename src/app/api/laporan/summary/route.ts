import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const totalBarang = await prisma.barang.count({ where: { deletedAt: null } });
    
    // Total stock in Gudang
    const gudangsData = await prisma.barangGudang.findMany({
      include: { barang: true }
    });

    let totalStokKeseluruhan = 0;
    let totalNilaiInventaris = 0;

    gudangsData.forEach(bg => {
      totalStokKeseluruhan += bg.stokTersedia;
      totalNilaiInventaris += (bg.stokTersedia * Number(bg.barang.barangHarga));
    });

    // Transaksi Bulan ini
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const txBulanIni = await prisma.transaction.findMany({
      where: {
        transactionDate: { gte: startOfMonth },
        deletedAt: null
      },
      include: {
        transactionType: true,
        details: true
      }
    });

    let trMasuk = 0;
    let trKeluar = 0;

    txBulanIni.forEach(trx => {
      const isMasuk = trx.transactionType.slug.includes('masuk') || trx.transactionType.slug.includes('peminjaman');
      trx.details.forEach(d => {
        if (isMasuk) trMasuk += d.quantity;
        else trKeluar += d.quantity;
      });
    });

    return NextResponse.json({
      totalBarangModel: totalBarang,
      totalStokKeseluruhan,
      totalNilaiInventaris,
      pergerakanBulanIni: {
        masuk: trMasuk,
        keluar: trKeluar
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
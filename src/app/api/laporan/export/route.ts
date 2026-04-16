import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const items = await prisma.barang.findMany({
      where: { deletedAt: null },
      include: {
        barangGudangs: { include: { gudang: true } },
        satuan: true,
        jenisBarang: true,
        barangCategory: true
      },
      orderBy: { barangKode: 'asc' }
    });

    let csvContent = 'SKU,Nama Barang,Kategori,Jenis,Satuan,Harga Satuan (Rp),Total Stok Tersedia,Gudang Lokasi (Rincian)\n';

    items.forEach(item => {
      const totalStok = item.barangGudangs.reduce((sum, current) => sum + current.stokTersedia, 0);
      const rincian = item.barangGudangs.map(bg => `${bg.gudang.name}: ${bg.stokTersedia}`).join(' | ');

      csvContent += `${item.barangKode},"${item.barangNama}","${item.barangCategory.name}","${item.jenisBarang.name}",${item.satuan.name},${item.barangHarga},${totalStok},"${rincian}"\n`;
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="stok_laporan_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
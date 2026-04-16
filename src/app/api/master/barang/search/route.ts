import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json([]);
    }

    const items = await prisma.barang.findMany({
      where: {
        OR: [
          { barangKode: { contains: q, mode: 'insensitive' } },
          { barangNama: { contains: q, mode: 'insensitive' } }
        ],
        deletedAt: null
      },
      include: {
        satuan: true,
        jenisBarang: true,
        barangGudangs: {
          include: { gudang: true }
        }
      },
      take: 10
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
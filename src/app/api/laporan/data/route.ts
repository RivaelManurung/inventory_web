import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const all = searchParams.get('all') === 'true';

    const dateFilter: any = {};
    if (start && end) {
      dateFilter.gte = new Date(start);
      // Set end date to end of day
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.lte = endDate;
    }

    const where = {
      transaction: {
        transactionDate: dateFilter,
        deletedAt: null,
        status: 'COMPLETED'
      }
    };

    const [reportData, total] = await Promise.all([
      prisma.transactionDetail.findMany({
        where,
        include: {
          barang: true,
          gudang: true,
          transaction: {
            include: {
              transactionType: true,
              user: true
            }
          }
        },
        orderBy: {
          transaction: {
            transactionDate: 'desc'
          }
        },
        skip: all ? undefined : (page - 1) * limit,
        take: all ? undefined : limit,
      }),
      prisma.transactionDetail.count({ where })
    ]);

    const formatted = reportData.map(item => ({
      id: item.id,
      date: item.transaction.transactionDate,
      code: item.transaction.transactionCode,
      type: item.transaction.transactionType.name,
      barang: item.barang.barangNama,
      sku: item.barang.barangKode,
      gudang: item.gudang.name,
      qty: item.quantity,
      user: item.transaction.user.name
    }));

    return NextResponse.json({ data: formatted, total });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

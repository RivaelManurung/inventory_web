import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate total Barang
    const totalBarang = await prisma.barang.count({ where: { deletedAt: null } });

    // Calculate Stok Masuk (Bulan Ini)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stockIn = await prisma.transactionDetail.aggregate({
      _sum: { quantity: true },
      where: {
        transaction: {
          transactionDate: { gte: firstDayOfMonth },
          transactionType: { slug: { contains: 'masuk' } }
        }
      }
    });

    // Calculate Stok Keluar (Bulan Ini)
    const stockOut = await prisma.transactionDetail.aggregate({
      _sum: { quantity: true },
      where: {
        transaction: {
          transactionDate: { gte: firstDayOfMonth },
          transactionType: { slug: { contains: 'keluar' } }
        }
      }
    });

    // Example additional metric: low stock items (stokTersedia < 5)
    const lowStockCount = await prisma.barangGudang.count({
      where: { stokTersedia: { lt: 5 } }
    });

    // Monthly Data for charts (Last 6 months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const mIn = await prisma.transactionDetail.aggregate({
        _sum: { quantity: true },
        where: {
          transaction: {
            transactionDate: { gte: monthStart, lt: nextMonthStart },
            transactionType: { slug: { contains: 'masuk' } }
          }
        }
      });
      const mOut = await prisma.transactionDetail.aggregate({
        _sum: { quantity: true },
        where: {
          transaction: {
            transactionDate: { gte: monthStart, lt: nextMonthStart },
            transactionType: { slug: { contains: 'keluar' } }
          }
        }
      });

      const monthName = monthStart.toLocaleString('default', { month: 'short' });
      chartData.push({
        name: monthName,
        masuk: mIn._sum.quantity || 0,
        keluar: mOut._sum.quantity || 0,
      });
    }

    // Recent Activities
    const recentActivitiesRaw = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        transactionType: true,
        user: { select: { name: true } },
        details: { include: { barang: true } }
      }
    });

    const recentActivities = recentActivitiesRaw.map(trx => {
      const typeStr = trx.transactionType.slug.includes('masuk') ? 'masuk' : 'keluar';
      const items = trx.details.map(d => d.barang.barangNama).join(', ');
      // formatting time safely
      const d = trx.createdAt;
      return {
        id: trx.id,
        type: typeStr,
        item: items || 'Beberapa Barang',
        user: trx.user?.name || 'Sistem',
        time: d.toLocaleDateString(),
        status: 'Selesai'
      };
    });

    return NextResponse.json({
      stats: {
        totalBarang,
        stokMasuk: stockIn._sum.quantity || 0,
        stokKeluar: stockOut._sum.quantity || 0,
        lowStock: lowStockCount
      },
      chartData,
      recentActivities
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
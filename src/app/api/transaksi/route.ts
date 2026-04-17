import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null },
      include: {
        transactionType: true,
        user: { select: { name: true } },
        details: {
          include: {
            barang: { select: { barangKode: true, barangNama: true } },
            gudang: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, transactionDate, description, details } = body;

    if (!type || !details || details.length === 0) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const typeSlug = type.toLowerCase().replace(/ /g, '-');

    let trxType = await prisma.transactionType.findUnique({ where: { slug: typeSlug } });
    if (!trxType) {
      trxType = await prisma.transactionType.create({
        data: { name: type, slug: typeSlug }
      });
    }

    const transaction = await (prisma as any).$transaction(async (tx: any) => {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      let codePrefix = 'TRX-TRF-';
      if (typeSlug.includes('masuk')) codePrefix = 'TRX-IN-';
      else if (typeSlug.includes('keluar')) codePrefix = 'TRX-OUT-';
      else if (typeSlug.includes('adjustment')) codePrefix = 'TRX-ADJ-';
      
      const count = await tx.transaction.count({
        where: { transactionCode: { startsWith: codePrefix + dateStr } }
      });
      const code = codePrefix + dateStr + '-' + String(count + 1).padStart(4, '0');

      const newTrx = await tx.transaction.create({
        data: {
          transactionCode: code,
          transactionDate: new Date(transactionDate),
          description,
          userId: session.user.id,
          transactionTypeId: trxType.id,
        }
      });

      for (const item of details) {
        if (!item.barangId || !item.gudangId || !item.quantity) throw new Error('Detail transaksi tidak valid');
        
        await tx.transactionDetail.create({
          data: {
            transactionId: newTrx.id,
            barangId: item.barangId,
            gudangId: item.gudangId,
            quantity: Number(item.quantity)
          }
        });

        const isMasuk = typeSlug.includes('masuk');
        const isAdjustment = typeSlug.includes('adjustment');
        let bg = await tx.barangGudang.findUnique({
          where: { barangId_gudangId: { barangId: item.barangId, gudangId: item.gudangId } }
        });

        // Update stock
        let updatedBG;
        const qty = Number(item.quantity);
        if (!bg) {
          if (!isMasuk && !isAdjustment) {
            throw new Error('Stok tidak ditemukan untuk barang ID: ' + item.barangId);
          }
          updatedBG = await tx.barangGudang.create({
            data: { 
              barangId: item.barangId, 
              gudangId: item.gudangId, 
              stokTersedia: qty 
            }
          });
        } else {
          if (!isMasuk && !isAdjustment && bg.stokTersedia < qty) {
            throw new Error('Stok barang tidak mencukupi untuk dikeluarkan. Diminta: ' + qty + ', Tersedia: ' + bg.stokTersedia);
          }

          updatedBG = await tx.barangGudang.update({
            where: { barangId_gudangId: { barangId: item.barangId, gudangId: item.gudangId } },
            data: {
              stokTersedia: isAdjustment ? qty : (isMasuk ? { increment: qty } : { decrement: qty })
            }
          });
        }

        // Check if stock is low after update
        const barang = await tx.barang.findUnique({ where: { id: item.barangId } });
        if (barang && updatedBG.stokTersedia <= barang.stokMinimum) {
          await tx.notification.create({
            data: {
              userId: session.user.id,
              type: "STOK_MINIMUM",
              title: updatedBG.stokTersedia === 0 ? "Stok Habis!" : "Stok Menipis!",
              message: `Barang ${barang.barangNama} sisa ${updatedBG.stokTersedia} unit di gudang.`,
              data: { barangId: barang.id, currentStock: updatedBG.stokTersedia }
            }
          });
        }
      }

      return newTrx;
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
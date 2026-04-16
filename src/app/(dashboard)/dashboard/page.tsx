import React from 'react';
import { 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package,
  History,
  Activity,
  Search,
  TrendingUp,
  AlertCircle,
  Clock,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  ArrowRightLeft
} from 'lucide-react';
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from 'next/link';
import HeaderTitle from "@/components/layout/HeaderTitle";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch Metrics
  const totalBarang = await prisma.barang.count({ where: { deletedAt: null } });
  
  const stokGudang = await prisma.barangGudang.aggregate({
    _sum: { stokTersedia: true },
    where: { deletedAt: null }
  });

  const totalTransaksi = await prisma.transaction.count({ where: { deletedAt: null } });
  
  const stokMenipis = await prisma.barang.count({
    where: {
      deletedAt: null,
      barangGudangs: {
        some: {
          stokTersedia: { lte: 10 } // Contoh threshold 10
        }
      }
    }
  });

  const recentTransactions = await prisma.transaction.findMany({
    where: { deletedAt: null },
    include: {
      transactionType: true,
      user: true,
      _count: { select: { details: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const stats = [
    {
      title: "Total Asset Barang",
      value: totalBarang,
      label: "Item Terdaftar",
      icon: <Package className="w-5 h-5 text-blue-400" />,
      color: "blue",
      trend: "+12.5%",
      isPositive: true
    },
    {
      title: "Total Stok Fisik",
      value: stokGudang._sum.stokTersedia || 0,
      label: "Unit di Gudang",
      icon: <Boxes className="w-5 h-5 text-emerald-400" />,
      color: "emerald",
      trend: "+3.2%",
      isPositive: true
    },
    {
      title: "Volume Transaksi",
      value: totalTransaksi,
      label: "Total Aktivitas",
      icon: <History className="w-5 h-5 text-purple-400" />,
      color: "purple",
      trend: "-1.5%",
      isPositive: false
    },
    {
      title: "Stok Menipis",
      value: stokMenipis,
      label: "Butuh Perhatian",
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      color: "amber",
      trend: "Critical",
      isPositive: false
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-1">
        <HeaderTitle title="Overview Dashboard" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3" /> Update Terakhir: {format(new Date(), "dd MMM yyyy, HH:mm")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const colors: Record<string, string> = {
            blue: "text-blue-500",
            emerald: "text-emerald-500",
            purple: "text-purple-500",
            amber: "text-amber-500",
          };

          const colorClass = colors[stat.color] || colors.blue;

          return (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.title}</p>
                   <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.value.toLocaleString()}</h3>
                   <p className="text-[10px] text-muted-foreground font-medium mt-1">{stat.label}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50 border border-border ${colorClass}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions — 2/3 */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden shadow-sm h-fit">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Transaksi Terbaru
            </h2>
            <Link href="/transaksi" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Lihat Semua</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="pl-6 pr-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kode & Tanggal</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Tipe</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">PIC</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right pr-6">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="pl-6 pr-4 py-4">
                      <Link href={`/transaksi/${trx.id}`} className="block">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{trx.transactionCode}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{format(new Date(trx.transactionDate), "dd MMM yyyy")}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        trx.transactionType.slug.includes('masuk') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                        trx.transactionType.slug.includes('keluar') ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                        'bg-slate-500/10 border-slate-500/20 text-slate-600'
                      }`}>
                        {trx.transactionType.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-foreground">{trx.user.name}</td>
                    <td className="px-4 py-4 text-right pr-6">
                      <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">{trx._count.details} SKU</span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs text-muted-foreground">Belum ada transaksi tercatat</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity — 1/3 */}
        <div className="lg:col-span-1 space-y-4">
           {/* Section Navigasi */}
           <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Navigasi Cepat</h2>
              </div>
              <div className="p-4 space-y-3">
                <Link href="/transaksi/create" className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all group">
                   <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-bold">Input Transaksi</span>
                   </div>
                   <ArrowRightLeft className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                </Link>
                
                <Link href="/master/barang" className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted transition-all group">
                   <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">Katalog Barang</span>
                   </div>
                   <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-50 group-hover:opacity-100" />
                </Link>
              </div>
           </div>

           {/* Section Status */}
           <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">Sistem Status</h2>
              </div>
              <div className="p-5 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">Database Sync</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Connected</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">File Store</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Online</span>
                 </div>
                 <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Versi</span>
                    <span className="text-[10px] font-mono text-muted-foreground">v1.2.4-stable</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

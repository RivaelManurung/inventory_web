import "dotenv/config";
import { PrismaClient, TransactionStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Menjalankan Seeder Kompleks...");

  // 1. Transaction Types
  const transactionTypes = [
    { name: "Barang Masuk", slug: "barang-masuk", description: "Penerimaan barang baru atau restock ke gudang" },
    { name: "Barang Keluar", slug: "barang-keluar", description: "Pengeluaran barang untuk pemakaian atau distribusi" },
    { name: "Peminjaman", slug: "peminjaman", description: "Peminjaman aset oleh staf atau departemen" },
    { name: "Pengembalian", slug: "pengembalian", description: "Pengembalian aset yang telah selesai dipinjam" },
    { name: "Maintenance", slug: "maintenance", description: "Barang sedang dalam proses perbaikan/perawatan" },
    { name: "Selesai Maintenance", slug: "selesai-maintenance", description: "Barang kembali ke gudang setelah perbaikan" },
  ];

  for (const type of transactionTypes) {
    await prisma.transactionType.upsert({
      where: { slug: type.slug },
      update: { description: type.description },
      create: type,
    });
  }

  // 2. Roles
  const roles = [
    { name: "Superadmin", slug: "superadmin", description: "Akses penuh ke seluruh sistem dan pengaturan" },
    { name: "Admin", slug: "admin", description: "Akses manajemen data master dan transaksi" },
    { name: "Operator", slug: "operator", description: "Akses operasional harian dan stok" },
  ];

  const dbRoles: any = {};
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { slug: role.slug },
      update: { description: role.description },
      create: role,
    });
    dbRoles[role.slug] = createdRole;
  }

  // 2.5 Permissions
  console.log("🔐 Seeding Hak Akses Default...");
  const modules = [
    { 
      name: 'Dashboard', 
      slug: 'dashboard', 
      permissions: [
        { name: 'View Dashboard', slug: 'dashboard.view' }
      ] 
    },
    { 
      name: 'Master Barang', 
      slug: 'barang', 
      permissions: [
        { name: 'Lihat Barang', slug: 'barang.view' },
        { name: 'Tambah Barang', slug: 'barang.create' },
        { name: 'Edit Barang', slug: 'barang.update' },
        { name: 'Hapus Barang', slug: 'barang.delete' },
      ] 
    },
    { 
      name: 'Lokasi Gudang', 
      slug: 'gudang', 
      permissions: [
        { name: 'Lihat Gudang', slug: 'gudang.view' },
        { name: 'Tambah Gudang', slug: 'gudang.create' },
        { name: 'Edit Gudang', slug: 'gudang.update' },
        { name: 'Hapus Gudang', slug: 'gudang.delete' },
      ] 
    },
    { 
      name: 'Transaksi Stok', 
      slug: 'transaksi', 
      permissions: [
        { name: 'Lihat Transaksi', slug: 'transaksi.view' },
        { name: 'Buat Transaksi', slug: 'transaksi.create' },
        { name: 'Batalkan Transaksi', slug: 'transaksi.cancel' },
      ] 
    },
    { 
      name: 'Manajemen User', 
      slug: 'users', 
      permissions: [
        { name: 'Lihat User', slug: 'users.view' },
        { name: 'Tambah User', slug: 'users.create' },
        { name: 'Edit User', slug: 'users.update' },
        { name: 'Hapus User', slug: 'users.delete' },
      ] 
    },
    { 
      name: 'Hak Akses', 
      slug: 'roles', 
      permissions: [
        { name: 'Lihat Role', slug: 'roles.view' },
        { name: 'Atur Hak Akses', slug: 'roles.manage' },
      ] 
    },
    { 
      name: 'Pengaturan', 
      slug: 'settings', 
      permissions: [
        { name: 'Lihat Pengaturan', slug: 'settings.view' },
        { name: 'Ubah Pengaturan', slug: 'settings.update' },
      ] 
    },
  ];

  for (const mod of modules) {
    for (const perm of mod.permissions) {
      const p = await prisma.permission.upsert({
        where: { slug: perm.slug },
        update: { 
          name: perm.name,
          module: mod.name
        },
        create: {
          name: perm.name,
          slug: perm.slug,
          module: mod.name,
        }
      });
      
      // Assign to Superadmin automatically
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: dbRoles["superadmin"].id,
            permissionId: p.id,
          }
        },
        update: { isAllowed: true },
        create: {
          roleId: dbRoles["superadmin"].id,
          permissionId: p.id,
          isAllowed: true,
        }
      });
    }
  }

  // 3. Main User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: hashedPassword },
    create: {
      name: "Rivael Manurung",
      email: "admin@example.com",
      password: hashedPassword,
      roleId: dbRoles["superadmin"].id,
    },
  });

  // 4. Categories, Jenis, Satuans
  const categoriesData = [
    { name: "Consumable", slug: "habis-pakai" },
    { name: "Fixed Asset", slug: "berulang-pakai" },
    { name: "Safety Gear", slug: "safety-gear" },
    { name: "Raw Material", slug: "bahan-baku" },
  ];
  const dbCats = [];
  for (const cat of categoriesData) {
    const c = await prisma.barangCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, userId: adminUser.id },
    });
    dbCats.push(c);
  }

  const jenisData = [
    { name: "Komponen Elektronik", slug: "elektronik", description: "Komponen berbasis sirkuit dan listrik" },
    { name: "Furniture Kantor", slug: "furniture", description: "Meja, kursi, dan peralatan kantor" },
    { name: "Alat Perlindungan Diri", slug: "apd", description: "Helm, sepatu safety, rompi" },
    { name: "Hardware Server", slug: "server-hw", description: "Peralatan data center dan jaringan" },
    { name: "Stationery", slug: "atk", description: "Kertas, pulpen, dan alat tulis" },
  ];
  const dbJenis = [];
  for (const j of jenisData) {
    const c = await prisma.jenisBarang.upsert({
      where: { slug: j.slug },
      update: {},
      create: { ...j, userId: adminUser.id },
    });
    dbJenis.push(c);
  }

  const satuansData = [
    { name: "Pcs", slug: "pcs" },
    { name: "Box (Isi 12)", slug: "box-12" },
    { name: "Unit", slug: "unit" },
    { name: "Roll", slug: "roll" },
    { name: "Set", slug: "set" },
  ];
  const dbSatuans = [];
  for (const s of satuansData) {
    const c = await prisma.satuan.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, userId: adminUser.id },
    });
    dbSatuans.push(c);
  }

  const gudangsData = [
    { name: "Gudang Utama Rungkut", slug: "gudang-utama", description: "Pusat distribusi utama wilayah Surabaya" },
    { name: "Gudang Logistik Sidoarjo", slug: "gudang-sidoarjo", description: "Penyimpanan buffer dan transit" },
    { name: "Gudang Workshop", slug: "gudang-workshop", description: "Penyimpanan bahan baku produksi" },
  ];
  const dbGudangs = [];
  for (const g of gudangsData) {
    const c = await prisma.gudang.upsert({
      where: { slug: g.slug },
      update: {},
      create: { ...g, userId: adminUser.id },
    });
    dbGudangs.push(c);
  }

  // 5. Generate 100 BARANG (Realistic Data)
  console.log("📦 Membuat 100 Data Barang...");
  const productTemplates = [
    { name: "Laptop Business", brand: "ThinkPad", cat: "berulang-pakai", jenis: "elektronik", sat: "unit", price: 15500000 },
    { name: "Monitor UltraSharp", brand: "Dell", cat: "berulang-pakai", jenis: "elektronik", sat: "unit", price: 4200000 },
    { name: "Keyboard Mechanical", brand: "Keychron", cat: "berulang-pakai", jenis: "elektronik", sat: "unit", price: 1200000 },
    { name: "Switch Networking", brand: "Cisco", cat: "berulang-pakai", jenis: "server-hw", sat: "unit", price: 8500000 },
    { name: "Server Rack 2U", brand: "HP Enterprise", cat: "berulang-pakai", jenis: "server-hw", sat: "unit", price: 45000000 },
    { name: "Helm Safety Pro", brand: "Krisbow", cat: "habis-pakai", jenis: "apd", sat: "pcs", price: 150000 },
    { name: "Sepatu Safety Steel Toe", brand: "Caterpillar", cat: "habis-pakai", jenis: "apd", sat: "pcs", price: 850000 },
    { name: "Kabel UTP Cat6 305m", brand: "Belden", cat: "habis-pakai", jenis: "elektronik", sat: "roll", price: 2100000 },
    { name: "Meja Kerja Ergonomis", brand: "Informa", cat: "berulang-pakai", jenis: "furniture", sat: "unit", price: 2850000 },
    { name: "Kursi Manajer", brand: "IKEA", cat: "berulang-pakai", jenis: "furniture", sat: "unit", price: 1900000 },
    { name: "Kertas A4 80gr", brand: "PaperOne", cat: "habis-pakai", jenis: "atk", sat: "box-12", price: 450000 },
    { name: "SSD NVMe 1TB", brand: "Samsung", cat: "habis-pakai", jenis: "elektronik", sat: "pcs", price: 1850000 },
    { name: "RAM DDR4 16GB", brand: "Corsair", cat: "habis-pakai", jenis: "elektronik", sat: "pcs", price: 950000 },
    { name: "Mouse Wireless", brand: "Logitech", cat: "habis-pakai", jenis: "elektronik", sat: "pcs", price: 250000 },
    { name: "Router WiFi 6", brand: "TP-Link", cat: "berulang-pakai", jenis: "elektronik", sat: "unit", price: 1100000 },
  ];

  for (let i = 1; i <= 100; i++) {
    const template = productTemplates[i % productTemplates.length];
    const category = dbCats.find(c => c.slug === template.cat);
    const jenis = dbJenis.find(j => j.slug === template.jenis);
    const satuan = dbSatuans.find(s => s.slug === template.sat);
    
    const uniqueName = `${template.brand} ${template.name} Series ${i}`;
    const code = `BRG-${i.toString().padStart(4, '0')}`;
    const slug = uniqueName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + `-${i}`;

    const barang = await prisma.barang.upsert({
      where: { barangKode: code },
      update: {},
      create: {
        barangKode: code,
        barangNama: uniqueName,
        barangSlug: slug,
        barangHarga: template.price + (Math.random() * 500000),
        stokMinimum: 5 + Math.floor(Math.random() * 10),
        barangCategoryId: category!.id,
        jenisBarangId: jenis!.id,
        satuanId: satuan!.id,
        userId: adminUser.id,
      }
    });

    // 6. Assign Inventory levels to warehouses
    for (const gudang of dbGudangs) {
       const initialStock = Math.floor(Math.random() * 50);
       await prisma.barangGudang.upsert({
         where: {
           barangId_gudangId: {
             barangId: barang.id,
             gudangId: gudang.id
           }
         },
         update: {},
         create: {
           barangId: barang.id,
           gudangId: gudang.id,
           stokTersedia: initialStock,
           stokDipinjam: Math.floor(Math.random() * 5),
           stokMaintenance: Math.floor(Math.random() * 2),
         }
       });
    }
  }

  // 7. Generate some recent Transactions
  console.log("📝 Mencatat Riwayat Transaksi...");
  const trxTypeIn = await prisma.transactionType.findUnique({ where: { slug: "barang-masuk" } });
  const trxTypeOut = await prisma.transactionType.findUnique({ where: { slug: "barang-keluar" } });
  const allBarangs = await prisma.barang.findMany({ take: 20 });

  for (let i = 1; i <= 20; i++) {
    const isMasuk = i % 2 === 0;
    const type = isMasuk ? trxTypeIn : trxTypeOut;
    const itemsCount = 1 + Math.floor(Math.random() * 3);
    const timestamp = Date.now().toString().slice(-6);
    
    // Use upsert or unique code to avoid P2002
    await prisma.transaction.create({
      data: {
        transactionCode: `TRX-${isMasuk ? 'IN' : 'OUT'}-${new Date().getFullYear()}${(i + 100).toString()}-${timestamp}-${i}`,
        transactionDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        description: `Transaksi otomatis seeder nomor ${i}`,
        status: TransactionStatus.COMPLETED,
        userId: adminUser.id,
        transactionTypeId: type!.id,
        details: {
          create: Array.from({ length: itemsCount }).map((_, idx) => ({
            barangId: allBarangs[(i + idx) % allBarangs.length].id,
            gudangId: dbGudangs[0].id,
            quantity: 5 + Math.floor(Math.random() * 10),
            catatan: "Catatan item transaksi"
          }))
        }
      }
    });
  }

  console.log("✅ Seeding Berhasil Diselesaikan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
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

  const superadmin = await prisma.role.findUnique({ where: { slug: 'superadmin' } });
  if (!superadmin) {
    console.error("❌ Role superadmin tidak ditemukan. Silakan jalankan seeder utama terlebih dahulu.");
    return;
  }

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
            roleId: superadmin.id,
            permissionId: p.id,
          }
        },
        update: { isAllowed: true },
        create: {
          roleId: superadmin.id,
          permissionId: p.id,
          isAllowed: true,
        }
      });
    }
  }
  console.log("✅ Hak Akses berhasil di-seed!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });

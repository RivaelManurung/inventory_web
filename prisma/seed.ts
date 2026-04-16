import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // 1. Transaction Types
  const transactionTypes = [
    { name: "Barang Masuk", slug: "barang-masuk", description: "Penerimaan barang baru atau restock" },
    { name: "Barang Keluar", slug: "barang-keluar", description: "Pengeluaran barang untuk pemakaian" },
    { name: "Peminjaman", slug: "peminjaman", description: "Peminjaman barang oleh user/staf" },
    { name: "Pengembalian", slug: "pengembalian", description: "Pengembalian barang dari peminjaman" },
    { name: "Maintenance", slug: "maintenance", description: "Barang masuk perbaikan" },
    { name: "Selesai Maintenance", slug: "selesai-maintenance", description: "Barang selesai diperbaiki" },
  ];

  for (const type of transactionTypes) {
    await prisma.transactionType.upsert({
      where: { slug: type.slug },
      update: {},
      create: type,
    });
  }
  console.log("Transaction types seeded.");

  // 2. Roles
  const roles = [
    { name: "Superadmin", slug: "superadmin", description: "Full system access" },
    { name: "Admin", slug: "admin", description: "Administrator access" },
    { name: "Operator", slug: "operator", description: "Daily operations access" },
  ];

  const dbRoles: any = {};
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
    dbRoles[role.slug] = createdRole;
  }
  console.log("Roles seeded.");

  // 3. User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      roleId: dbRoles["superadmin"].id,
    },
  });
  console.log("Admin user seeded.");

  // 4. Master Data
  const categories = [
    { name: "Habis Pakai", slug: "habis-pakai", userId: adminUser.id },
    { name: "Berulang Pakai", slug: "berulang-pakai", userId: adminUser.id },
  ];

  for (const cat of categories) {
    await prisma.barangCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const jenis = [
    { name: "Elektronik", slug: "elektronik", userId: adminUser.id },
    { name: "Alat Tulis Kantor", slug: "atk", userId: adminUser.id },
    { name: "Furniture", slug: "furniture", userId: adminUser.id },
  ];

  for (const j of jenis) {
    await prisma.jenisBarang.upsert({
      where: { slug: j.slug },
      update: {},
      create: j,
    });
  }

  const satuans = [
    { name: "Pcs", slug: "pcs", userId: adminUser.id },
    { name: "Box", slug: "box", userId: adminUser.id },
    { name: "Unit", slug: "unit", userId: adminUser.id },
  ];

  for (const s of satuans) {
    await prisma.satuan.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  const gudangs = [
    { name: "Gudang Utama", slug: "gudang-utama", description: "Penyimpanan pusat", userId: adminUser.id },
    { name: "Gudang Cabang", slug: "gudang-cabang", description: "Penyimpanan cabang 1", userId: adminUser.id },
  ];

  for (const g of gudangs) {
    await prisma.gudang.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
  }
  console.log("Master data seeded.");

  // 5. Permissions (Sample)
  const permissions = [
    { name: "Barang View", slug: "barang.view", module: "barang" },
    { name: "Barang Create", slug: "barang.create", module: "barang" },
    { name: "Barang Edit", slug: "barang.edit", module: "barang" },
    { name: "Barang Delete", slug: "barang.delete", module: "barang" },
    { name: "Transaksi View", slug: "transaksi.view", module: "transaksi" },
    { name: "Transaksi Create", slug: "transaksi.create", module: "transaksi" },
  ];

  for (const p of permissions) {
    const createdPerm = await prisma.permission.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });

    // Assign to superadmin and admin
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles["superadmin"].id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles["superadmin"].id,
        permissionId: createdPerm.id,
        isAllowed: true,
      },
    });
  }
  console.log("Permissions seeded.");

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

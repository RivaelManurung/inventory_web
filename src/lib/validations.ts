import { z } from "zod";

export const barangSchema = z.object({
  barangKode: z.string().optional(),
  barangNama: z.string().min(3, "Nama minimal 3 karakter"),
  barangHarga: z.number().min(0, "Harga tidak boleh negatif"),
  stokMinimum: z.number().min(0, "Stok tidak boleh negatif"),
  jenisBarangId: z.string().min(1, "Jenis barang wajib dipilih"),
  satuanId: z.string().min(1, "Satuan wajib dipilih"),
  barangCategoryId: z.string().min(1, "Kategori wajib dipilih"),
  barangGambar: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const gudangSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  description: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  roleId: z.string().min(1, "Role wajib dipilih"),
  avatar: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
});

export const transactionSchema = z.object({
  type: z.enum(["Barang Masuk", "Barang Keluar", "Peminjaman", "Pengembalian"]),
  transactionDate: z.string().min(1, "Tanggal wajib diisi"),
  description: z.string().optional(),
  details: z.array(z.object({
    barangId: z.string().min(1, "Barang wajib dipilih"),
    gudangId: z.string().min(1, "Gudang wajib dipilih"),
    quantity: z.number().min(1, "Quantity minimal 1"),
  })).min(1, "Minimal 1 barang harus ditambahkan"),
});

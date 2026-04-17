import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handlePrismaError(error: any, customPrefix: string = "Gagal memproses data") {
  console.error(`[${customPrefix.toUpperCase()}] ERROR:`, error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      const field = target[target.length - 1];
      
      let message = "Data sudah ada dalam sistem.";
      if (field === "name" || field === "nama") message = "Nama sudah digunakan, silakan gunakan nama lain.";
      if (field === "email") message = "Alamat email sudah terdaftar.";
      if (field === "barangKode") message = "Kode barang sudah digunakan.";
      if (field === "username") message = "Username sudah digunakan.";
      if (field === "slug") message = "Slug otomatis bertabrakan, coba ubah nama sedikit.";

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Foreign key constraint failed
    if (error.code === "P2003") {
      return NextResponse.json(
        { success: false, message: "Data tidak bisa dihapus atau diubah karena sedang digunakan oleh data lain." },
        { status: 400 }
      );
    }

    // Record not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan atau sudah dihapus." },
        { status: 404 }
      );
    }
  }

  // Fallback for other errors
  const message = error.message || "Terjadi kesalahan internal pada server.";
  return NextResponse.json({ success: false, message }, { status: 500 });
}

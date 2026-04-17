import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/error-handler";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = await prisma.gudang.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: { barangGudangs: { where: { deletedAt: null } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return handlePrismaError(error, "GET GUDANG");
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;
    
    if (!name) return NextResponse.json({ success: false, message: "Nama gudang harus diisi" }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newData = await prisma.gudang.create({
      data: {
        name,
        slug,
        description: description || null,
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return handlePrismaError(error, "CREATE GUDANG");
  }
}
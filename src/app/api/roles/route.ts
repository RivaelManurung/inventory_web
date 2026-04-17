import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: "Nama dan Slug wajib diisi" }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/ /g, "-"),
        description,
      },
    });

    return NextResponse.json({ success: true, data: role });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

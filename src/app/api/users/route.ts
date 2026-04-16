import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phoneNumber, roleId, avatar } = body;

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email sudah terdaftar!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        roleId,
        avatar,
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

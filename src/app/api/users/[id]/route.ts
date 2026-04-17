import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { handlePrismaError } from "@/lib/error-handler";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true },
    });
    if (!user) return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return handlePrismaError(error, "GET USER BY ID");
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phoneNumber, roleId, avatar, username, password } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (username !== undefined) updateData.username = username;

    if (roleId) {
      updateData.role = { connect: { id: roleId } };
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return handlePrismaError(error, "PATCH USER");
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, message: "User berhasil dihapus" });
  } catch (error: any) {
    return handlePrismaError(error, "DELETE USER");
  }
}

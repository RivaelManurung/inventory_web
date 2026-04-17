import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/error-handler";

export async function GET() {
  try {
    const settings = await prisma.webSetting.findFirst();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return handlePrismaError(error, "GET SETTINGS");
  }
}

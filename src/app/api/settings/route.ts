import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createLog } from "@/lib/activity-log";
import { handlePrismaError } from "@/lib/error-handler";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { webNama, webDeskripsi, webLogo } = body;

    // We assume there's only one setting record for now as per schema findFirst usage
    const settings = await prisma.webSetting.findFirst();

    if (settings) {
      const updated = await prisma.webSetting.update({
        where: { id: settings.id },
        data: {
          webNama,
          webDeskripsi,
          webLogo,
        },
      });
      await createLog(
        session.user.id,
        "UPDATE",
        "SETTINGS",
        `Memperbarui pengaturan sistem: ${webNama}`
      );
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Create if doesn't exist
      const created = await prisma.webSetting.create({
        data: {
          webNama,
          webDeskripsi,
          webLogo,
          userId: session.user.id,
        },
      });
      await createLog(
        session.user.id,
        "UPDATE",
        "SETTINGS",
        `Inisialisasi pengaturan sistem baru: ${webNama}`
      );
      return NextResponse.json({ success: true, data: created });
    }
  } catch (error: any) {
    return handlePrismaError(error, "UPDATE SETTINGS");
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Create if doesn't exist. Need a user ID though. 
      // Falling back to a dummy user if none exists in db for dev purpose.
      const user = await prisma.user.findFirst();
      if (!user) throw new Error("No user found to associate settings with.");

      const created = await prisma.webSetting.create({
        data: {
          webNama,
          webDeskripsi,
          webLogo,
          userId: user.id,
        },
      });
      return NextResponse.json({ success: true, data: created });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

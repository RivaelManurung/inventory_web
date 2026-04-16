import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const ext = file.name.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;
    
    // Path relative to public folder for web access
    const path = join(process.cwd(), "public", "uploads", filename);
    
    // Save to filesystem
    await writeFile(path, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

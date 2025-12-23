import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.resolve(process.cwd(), "data", "knowledge.xlsx");

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    message: "Knowledge file uploaded successfully",
  });
}

import { NextResponse } from "next/server";
import { getTopQuestions } from "@/lib/analytics";

export async function GET() {
  return NextResponse.json(getTopQuestions());
}

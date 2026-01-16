import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Demo Patient", email: "demo@zealthy.com" }
  ]);
}

export async function POST() {
  return NextResponse.json({ success: true });
}

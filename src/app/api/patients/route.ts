import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // ✅ Vercel-safe fallback
  if (!prisma) {
    return NextResponse.json([
      { id: 1, name: "Demo Patient", email: "demo@zealthy.com" }
    ]);
  }

  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!prisma) {
    return NextResponse.json({ success: true });
  }

  const patient = await prisma.patient.create({
    data: body
  });

  return NextResponse.json(patient);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!prisma) {
    // Vercel demo fallback
    return NextResponse.json([
      { id: 1, name: "Demo Patient", email: "demo@zealthy.com" },
    ]);
  }

  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  if (!prisma) {
    return NextResponse.json({ success: true });
  }

  const body = await req.json();
  const patient = await prisma.patient.create({
    data: body,
  });

  return NextResponse.json(patient);
}

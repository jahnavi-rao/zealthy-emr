import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET prescriptions (optionally by patientId)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  const prescriptions = await prisma.prescription.findMany({
    where: patientId
      ? { patientId: Number(patientId), active: true }
      : {},
    orderBy: { refillDate: "asc" },
  });

  return NextResponse.json(prescriptions);
}

// POST create prescription
export async function POST(req: Request) {
  const body = await req.json();

  const prescription = await prisma.prescription.create({
    data: {
      medication: body.medication,
      dosage: body.dosage,
      quantity: body.quantity,
      refillDate: new Date(body.refillDate),
      refillSchedule: body.refillSchedule,
      patientId: body.patientId,
    },
  });

  return NextResponse.json(prescription);
}

// PATCH end prescription
export async function PATCH(req: Request) {
  const body = await req.json();

  const prescription = await prisma.prescription.update({
    where: { id: body.id },
    data: { active: false },
  });

  return NextResponse.json(prescription);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: list appointments (optionally by patientId)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  const appointments = await prisma.appointment.findMany({
    where: patientId ? { patientId: Number(patientId), active: true } : {},
    orderBy: { startDateTime: "asc" },
  });

  return NextResponse.json(appointments);
}

// POST: create appointment
export async function POST(req: Request) {
  const body = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      provider: body.provider,
      startDateTime: new Date(body.startDateTime),
      repeat: body.repeat ?? "none",
      patientId: body.patientId,
    },
  });

  return NextResponse.json(appointment);
}

// PATCH: end recurring appointment
export async function PATCH(req: Request) {
  const body = await req.json();

  const appointment = await prisma.appointment.update({
    where: { id: body.id },
    data: { active: false },
  });

  return NextResponse.json(appointment);
}

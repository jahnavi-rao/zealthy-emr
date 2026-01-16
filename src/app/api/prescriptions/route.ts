import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      medicationName: "Lisinopril",
      dosage: "10mg",
      refillDate: new Date().toISOString()
    }
  ]);
}

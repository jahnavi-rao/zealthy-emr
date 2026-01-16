import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const medications = [
  { name: "Lisinopril", dosage: "10mg" },
  { name: "Metformin", dosage: "500mg" },
  { name: "Atorvastatin", dosage: "20mg" },
  { name: "Amlodipine", dosage: "5mg" }
];

async function main() {
  for (const med of medications) {
    await prisma.medication.create({
      data: med,
    });
  }
  console.log("Medications seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

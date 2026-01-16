/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `repeat` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refillSchedule` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "startDateTime" DATETIME NOT NULL,
    "repeat" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("id", "patientId", "provider") SELECT "id", "patientId", "provider" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE TABLE "new_Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medication" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refillDate" DATETIME NOT NULL,
    "refillSchedule" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prescription" ("dosage", "id", "medication", "patientId", "quantity", "refillDate") SELECT "dosage", "id", "medication", "patientId", "quantity", "refillDate" FROM "Prescription";
DROP TABLE "Prescription";
ALTER TABLE "new_Prescription" RENAME TO "Prescription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,identificationNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identificationNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "identificationNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_organizationId_identificationNumber_key" ON "Patient"("organizationId", "identificationNumber");
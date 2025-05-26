/*
  Warnings:

  - You are about to drop the column `identificationNumber` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,ci]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_organizationId_identificationNumber_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "identificationNumber",
ALTER COLUMN "ci" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_organizationId_ci_key" ON "Patient"("organizationId", "ci");
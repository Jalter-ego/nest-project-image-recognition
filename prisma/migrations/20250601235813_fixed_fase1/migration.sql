/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AttentionHour` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AttentionHour` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OrganizationMember` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrganizationMember` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Treatment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttentionHour" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

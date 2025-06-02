/*
  Warnings:

  - Made the column `ci` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "ci" SET NOT NULL;

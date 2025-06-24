/*
  Warnings:

  - The `estado` column on the `MedicalAppointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MedicalAppointment" DROP COLUMN "estado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'pendiente';

-- DropEnum
DROP TYPE "EstadoCita";

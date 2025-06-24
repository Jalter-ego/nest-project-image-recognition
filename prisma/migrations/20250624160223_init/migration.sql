-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('pendiente', 'confirmada', 'cancelada', 'atendida');

-- AlterTable
ALTER TABLE "MedicalAppointment" ADD COLUMN     "estado" "EstadoCita" NOT NULL DEFAULT 'pendiente';

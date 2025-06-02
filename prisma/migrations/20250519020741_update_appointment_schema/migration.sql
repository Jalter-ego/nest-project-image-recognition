/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `MedicalAppointment` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentTime` on the `MedicalAppointment` table. All the data in the column will be lost.
  - Added the required column `appointmentDateTime` to the `MedicalAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalAppointment" DROP COLUMN "appointmentDate",
DROP COLUMN "appointmentTime",
ADD COLUMN     "appointmentDateTime" TIMESTAMP(3) NOT NULL;
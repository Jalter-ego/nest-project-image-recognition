/*
  Warnings:

  - You are about to drop the column `appointmentDateTime` on the `MedicalAppointment` table. All the data in the column will be lost.
  - Added the required column `date` to the `MedicalAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `MedicalAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `MedicalAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalAppointment" DROP COLUMN "appointmentDateTime",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

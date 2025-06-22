-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "chronicDiseases" TEXT[];

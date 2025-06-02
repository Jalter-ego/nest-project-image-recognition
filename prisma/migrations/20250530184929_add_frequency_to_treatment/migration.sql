-- CreateEnum
CREATE TYPE "FrequencyUnit" AS ENUM ('daily', 'weekly', 'monthly');

-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "frequencyUnit" "FrequencyUnit",
ADD COLUMN     "frequencyValue" INTEGER;

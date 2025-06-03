/*
  Warnings:

  - The values [diario,semanal,mensual] on the enum `FrequencyUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FrequencyUnit_new" AS ENUM ('daily', 'weekly', 'monthly');
ALTER TABLE "Treatment" ALTER COLUMN "frequencyUnit" TYPE "FrequencyUnit_new" USING ("frequencyUnit"::text::"FrequencyUnit_new");
ALTER TYPE "FrequencyUnit" RENAME TO "FrequencyUnit_old";
ALTER TYPE "FrequencyUnit_new" RENAME TO "FrequencyUnit";
DROP TYPE "FrequencyUnit_old";
COMMIT;

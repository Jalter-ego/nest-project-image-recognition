-- DropForeignKey
ALTER TABLE "ConsultationDiagnosis" DROP CONSTRAINT "ConsultationDiagnosis_diagnosisId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationTreatment" DROP CONSTRAINT "ConsultationTreatment_treatmentId_fkey";

-- AddForeignKey
ALTER TABLE "ConsultationDiagnosis" ADD CONSTRAINT "ConsultationDiagnosis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationTreatment" ADD CONSTRAINT "ConsultationTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

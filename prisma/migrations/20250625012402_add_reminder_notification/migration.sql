-- CreateTable
CREATE TABLE "ReminderNotification" (
    "id" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "notifyAt" TIMESTAMP(3) NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReminderNotification_notifyAt_idx" ON "ReminderNotification"("notifyAt");

-- CreateIndex
CREATE INDEX "ReminderNotification_patientId_idx" ON "ReminderNotification"("patientId");

-- CreateIndex
CREATE INDEX "ReminderNotification_notified_idx" ON "ReminderNotification"("notified");

-- AddForeignKey
ALTER TABLE "ReminderNotification" ADD CONSTRAINT "ReminderNotification_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderNotification" ADD CONSTRAINT "ReminderNotification_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

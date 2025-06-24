-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_token_key" ON "DeviceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_patientId_token_key" ON "DeviceToken"("patientId", "token");

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

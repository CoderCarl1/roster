/*
  Warnings:

  - A unique constraint covering the columns `[start]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[end]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_start_key" ON "Appointment"("start");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_end_key" ON "Appointment"("end");

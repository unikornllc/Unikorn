/*
  Warnings:

  - A unique constraint covering the columns `[ip,browser,os,userId,companyId]` on the table `LoginDevices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LoginDevices_ip_browser_os_userId_companyId_key" ON "LoginDevices"("ip", "browser", "os", "userId", "companyId");

/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_ownerId_key" ON "Collection"("name", "ownerId");

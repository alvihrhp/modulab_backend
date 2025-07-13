/*
  Warnings:

  - You are about to drop the column `base64_data` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `image` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "base64_data",
DROP COLUMN "image_url",
ADD COLUMN     "image" TEXT NOT NULL;

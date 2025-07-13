/*
  Warnings:

  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductLink` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductSpec` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductSpec` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductLink" DROP CONSTRAINT "ProductLink_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductLink_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductSpec" DROP CONSTRAINT "ProductSpec_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

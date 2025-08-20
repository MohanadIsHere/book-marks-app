/*
  Warnings:

  - You are about to drop the `BookMark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BookMark" DROP CONSTRAINT "BookMark_userId_fkey";

-- DropTable
DROP TABLE "public"."BookMark";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."UserRole";

/*
  Warnings:

  - You are about to drop the column `contennt` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `content` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromtType" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "contennt",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "type" "PromtType" NOT NULL;

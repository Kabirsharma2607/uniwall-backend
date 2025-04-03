/*
  Warnings:

  - A unique constraint covering the columns `[words_secret]` on the table `user_auth_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_state` to the `user_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_state" AS ENUM ('INIT', 'USER_CREATED', 'COMPLETE');

-- AlterTable
ALTER TABLE "user_details" ADD COLUMN     "user_state" "user_state" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_details_words_secret_key" ON "user_auth_details"("words_secret");

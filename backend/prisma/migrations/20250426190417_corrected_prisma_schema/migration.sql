/*
  Warnings:

  - Made the column `user_state` on table `user_details` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_details" ALTER COLUMN "user_state" SET NOT NULL,
ALTER COLUMN "user_state" SET DEFAULT 'INIT';

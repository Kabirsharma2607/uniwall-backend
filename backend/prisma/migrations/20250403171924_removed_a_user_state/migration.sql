/*
  Warnings:

  - The values [USER_CREATED] on the enum `user_state` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_state_new" AS ENUM ('INIT', 'COMPLETE');
ALTER TABLE "user_details" ALTER COLUMN "user_state" TYPE "user_state_new" USING ("user_state"::text::"user_state_new");
ALTER TYPE "user_state" RENAME TO "user_state_old";
ALTER TYPE "user_state_new" RENAME TO "user_state";
DROP TYPE "user_state_old";
COMMIT;

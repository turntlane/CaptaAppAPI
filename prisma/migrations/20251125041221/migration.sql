/*
  Warnings:

  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "user_id" TEXT NOT NULL;

UPDATE "sessions" SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'john.doe@example.com');

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "sessions"("user_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

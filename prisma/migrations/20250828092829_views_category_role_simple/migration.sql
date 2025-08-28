/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'DEVELOPER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ThreadCategory" AS ENUM ('FEATURES', 'BUGS', 'GENERAL', 'FEEDBACK');

-- DropForeignKey
ALTER TABLE "public"."Reply" DROP CONSTRAINT "Reply_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Thread" DROP CONSTRAINT "Thread_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."Reply" ALTER COLUMN "authorId" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "public"."Thread" ADD COLUMN     "category" "public"."ThreadCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "authorId" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
ALTER COLUMN "clerkId" SET DATA TYPE VARCHAR(128),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("clerkId");

-- CreateIndex
CREATE INDEX "Reply_threadId_createdAt_idx" ON "public"."Reply"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "Thread_authorId_createdAt_idx" ON "public"."Thread"("authorId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Thread" ADD CONSTRAINT "Thread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

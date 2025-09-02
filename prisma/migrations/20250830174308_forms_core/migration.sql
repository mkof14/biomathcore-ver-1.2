-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'SELECT_ONE', 'SELECT_MULTI', 'DATE', 'BOOLEAN', 'SCALE_1_10');

-- CreateEnum
CREATE TYPE "public"."Sensitivity" AS ENUM ('NONE', 'PRIVATE', 'INTIMATE');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PLAN_GATED', 'INVITE_ONLY');

-- CreateTable
CREATE TABLE "public"."BlackBox" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlackBox_pkey" PRIMARY KEY ("id")
);

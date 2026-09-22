-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('MEETING_BOOKED_LIVE', 'MEETING_BOOKED_EMAIL', 'INTERESTED_INFO_SENT', 'NOT_INTERESTED', 'VOICEMAIL', 'NO_ANSWER_FAILED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "firstName" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "painPoint" TEXT,
    "buildIdea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "callStatus" TEXT,
    "outcome" "CallOutcome" NOT NULL DEFAULT 'UNKNOWN',
    "capturedEmail" TEXT,
    "meetingTime" TEXT,
    "summary" TEXT,
    "transcript" JSONB,
    "successEvaluation" BOOLEAN,
    "rawPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "Contact"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CallLog_conversationId_key" ON "CallLog"("conversationId");

-- CreateIndex
CREATE INDEX "CallLog_contactId_idx" ON "CallLog"("contactId");

-- CreateIndex
CREATE INDEX "CallLog_outcome_idx" ON "CallLog"("outcome");

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


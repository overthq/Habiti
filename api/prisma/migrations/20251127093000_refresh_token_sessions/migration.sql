-- AlterTable
ALTER TABLE "public"."RefreshToken"
ADD COLUMN "sessionId" TEXT;

-- Backfill existing tokens so every legacy token belongs to its own session.
UPDATE "public"."RefreshToken"
SET "sessionId" = "id"
WHERE "sessionId" IS NULL;

-- Enforce non-null and add an index for fast lookups per session.
ALTER TABLE "public"."RefreshToken"
ALTER COLUMN "sessionId" SET NOT NULL;

CREATE INDEX "RefreshToken_sessionId_idx"
ON "public"."RefreshToken"("sessionId");


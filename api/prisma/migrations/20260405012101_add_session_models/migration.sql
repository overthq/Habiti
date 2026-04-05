-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_adminId_idx" ON "AdminSession"("adminId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: create Session rows for each unique (sessionId, userId) in RefreshToken
INSERT INTO "Session" ("id", "userId", "createdAt", "lastActiveAt")
SELECT DISTINCT ON ("sessionId") "sessionId", "userId", MIN("createdAt") OVER (PARTITION BY "sessionId"), MAX("updatedAt") OVER (PARTITION BY "sessionId")
FROM "RefreshToken"
WHERE "sessionId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- Backfill: create AdminSession rows for each unique (sessionId, adminId) in AdminRefreshToken
INSERT INTO "AdminSession" ("id", "adminId", "createdAt", "lastActiveAt")
SELECT DISTINCT ON ("sessionId") "sessionId", "adminId", MIN("createdAt") OVER (PARTITION BY "sessionId"), MAX("updatedAt") OVER (PARTITION BY "sessionId")
FROM "AdminRefreshToken"
WHERE "sessionId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminRefreshToken" ADD CONSTRAINT "AdminRefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AdminSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

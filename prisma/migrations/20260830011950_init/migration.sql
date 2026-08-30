-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "erlcApiKey" TEXT,
    "pcrChannelId" TEXT,
    "logChannelId" TEXT,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "robloxId" TEXT,
    "robloxUsername" TEXT,
    "rank" TEXT NOT NULL DEFAULT 'Recruit',
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pcr" (
    "id" TEXT NOT NULL,
    "pcrNumber" INTEGER NOT NULL,
    "serverId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "callType" TEXT NOT NULL,
    "disposition" TEXT NOT NULL,
    "commandTeam" TEXT,
    "narrative" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pcr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warrant" (
    "id" TEXT NOT NULL,
    "warrantNumber" INTEGER NOT NULL,
    "serverId" TEXT NOT NULL,
    "targetRobloxId" TEXT NOT NULL,
    "targetName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "filedById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_discordId_serverId_key" ON "Member"("discordId", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Pcr_serverId_pcrNumber_key" ON "Pcr"("serverId", "pcrNumber");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pcr" ADD CONSTRAINT "Pcr_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pcr" ADD CONSTRAINT "Pcr_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warrant" ADD CONSTRAINT "Warrant_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warrant" ADD CONSTRAINT "Warrant_filedById_fkey" FOREIGN KEY ("filedById") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ServerConfig" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "startChannelId" TEXT NOT NULL,
    "gateChannelId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "minimumBalance" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServerConfig_guildId_key" ON "ServerConfig"("guildId");

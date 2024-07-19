/*
  Warnings:

  - Changed the type of `minimumBalance` on the `ServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ServerConfig" ALTER COLUMN "gateChannelId" SET DEFAULT '',
DROP COLUMN "minimumBalance",
ADD COLUMN     "minimumBalance" DOUBLE PRECISION NOT NULL;

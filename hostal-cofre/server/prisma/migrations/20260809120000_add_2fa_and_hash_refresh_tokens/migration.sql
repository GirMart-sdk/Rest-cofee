-- AlterTable
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT,
ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- Refresh tokens now store a SHA-256 hash instead of the plaintext value.
-- Existing sessions are ephemeral and stored in plaintext, so they are
-- cleared before switching to the hashed column.
DELETE FROM "RefreshToken";
DROP INDEX "RefreshToken_token_key";
ALTER TABLE "RefreshToken" RENAME COLUMN "token" TO "tokenHash";
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

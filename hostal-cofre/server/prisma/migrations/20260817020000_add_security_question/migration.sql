-- AlterTable: Security question fields
ALTER TABLE "User" ADD COLUMN "securityQuestion" TEXT;
ALTER TABLE "User" ADD COLUMN "securityAnswer" TEXT;
CREATE INDEX "User_email_idx" ON "User"("email");

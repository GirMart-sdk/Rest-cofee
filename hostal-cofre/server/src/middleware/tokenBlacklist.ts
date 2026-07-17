import prisma from '../db.js'

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  })
}

export async function revokeAllUserTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  })
}

export async function isRefreshTokenRevoked(token: string): Promise<boolean> {
  const record = await prisma.refreshToken.findUnique({ where: { token } })
  return !record || record.revoked
}

export async function cleanupExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
}

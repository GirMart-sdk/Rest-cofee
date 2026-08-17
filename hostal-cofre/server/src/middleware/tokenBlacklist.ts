import prisma from '../db.js'
import { hashToken } from '../utils/tokens.js'

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(token) },
    data: { revoked: true },
  })
}

export async function revokeAllUserTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  })
}

export async function cleanupExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
}

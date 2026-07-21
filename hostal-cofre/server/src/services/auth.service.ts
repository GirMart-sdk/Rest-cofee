import prisma from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { config } from '../config/index.js'

const SALT_ROUNDS = 12
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY_DAYS = 7

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    return { ...tokens, user: userWithoutPassword }
  }

  static async login(email: string, password: string, ip: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      await this.recordLoginAttempt(email, ip, false)
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      await this.recordLoginAttempt(email, ip, false, user.id)
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    await this.recordLoginAttempt(email, ip, true, user.id)
    const tokens = await this.generateTokens(user.id, user.email, user.role)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    return { ...tokens, user: userWithoutPassword }
  }

  static async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 })
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    })

    return this.generateTokens(stored.user.id, stored.user.email, stored.user.role)
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    })
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 401 })

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } })

    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    })
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  private static async generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign({ id: userId, email, role }, config.jwtSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    })

    const refreshToken = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    })

    return { accessToken, refreshToken }
  }

  private static async recordLoginAttempt(
    email: string,
    ip: string,
    success: boolean,
    userId?: string,
  ) {
    await prisma.loginAttempt.create({
      data: { email, ip, success, userId },
    })
  }
}

import 'express-async-errors'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../src/middleware/errors.js'
import prisma from '../src/db.js'

export function createTestApp() {
  const app = express()
  app.use(express.json())

  return app
}

export function mountRoutes(
  app: express.Express,
  ...routeConfigs: Array<(app: express.Express) => void>
) {
  for (const config of routeConfigs) {
    config(app)
  }
  app.use(errorHandler)
}

export async function createUser(role: 'admin' | 'client' = 'client') {
  const suffix = Date.now() + Math.random().toString(36).slice(2, 6)
  const password = 'TestPass!1'
  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      name: role === 'admin' ? 'Admin Test' : 'Client Test',
      email: `${role}-${suffix}@test.com`,
      password: hashed,
      role,
    },
  })
  return { user, plainPassword: password }
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'test-secret-that-is-at-least-32-characters-long!!',
    { expiresIn: '15m', algorithm: 'HS256' },
  )
}

export async function createMenuItem() {
  const suffix = Date.now()
  return prisma.menuItem.create({
    data: {
      name: `Test Pizza ${suffix}`,
      description: 'A test pizza',
      price: 25000,
      category: 'pizza',
      available: true,
    },
  })
}

export async function createTable() {
  return prisma.table.create({
    data: {
      number: Math.floor(Math.random() * 999) + 1,
      capacity: 4,
      zone: 'interior',
    },
  })
}

export async function createOrder(
  overrides: {
    customerName?: string
    customerPhone?: string
    paymentMethod?: string
    orderType?: string
    status?: string
    menuItemId?: string
    shiftId?: string
  } = {},
) {
  const menuItem = await createMenuItem()
  const total = menuItem.price * 2
  return prisma.order.create({
    data: {
      customerName: overrides.customerName || 'Test Customer',
      customerPhone: overrides.customerPhone || '3001234567',
      total,
      paymentMethod: (overrides.paymentMethod || 'cash') as any,
      status: (overrides.status || 'pending') as any,
      orderType: (overrides.orderType || 'tienda') as any,
      receiptNumber: `HC-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      shiftId: overrides.shiftId || null,
      items: {
        create: {
          menuItemId: overrides.menuItemId || menuItem.id,
          quantity: 2,
          price: menuItem.price,
        },
      },
    },
    include: { items: { include: { menuItem: true } }, table: true, shift: true },
  })
}

export async function createReservation(
  overrides: {
    name?: string
    phone?: string
    guests?: number
    tableId?: string
    status?: string
  } = {},
) {
  const table = overrides.tableId ? null : await createTable()
  return prisma.reservation.create({
    data: {
      name: overrides.name || 'Test Guest',
      phone: overrides.phone || '3001234567',
      date: new Date('2026-12-31'),
      time: '20:00',
      guests: overrides.guests || 4,
      tableId: overrides.tableId || table!.id,
      status: (overrides.status || 'pending') as any,
    },
    include: { table: true },
  })
}

export async function createShift(
  overrides: {
    userId?: string
    status?: string
    openingCash?: number
  } = {},
) {
  const user = overrides.userId
    ? await prisma.user.findUnique({ where: { id: overrides.userId } })
    : (await createUser('admin')).user
  return prisma.shift.create({
    data: {
      userId: user!.id,
      cashierName: 'Test Cashier',
      shiftPeriod: 'manana',
      openingCash: overrides.openingCash || 200000,
      status: (overrides.status || 'open') as any,
    },
    include: { user: { select: { id: true, name: true } } },
  })
}

export async function cleanupData() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.loginAttempt.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()
}

export { prisma }

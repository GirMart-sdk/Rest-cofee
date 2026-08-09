import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../src/db.js', () => ({
  default: {
    user: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    refreshToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    loginAttempt: { create: vi.fn() },
    menuItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}))

import prisma from '../src/db.js'
import bcrypt from 'bcryptjs'
import { AuthService } from '../src/services/auth.service.js'
import { MenuService } from '../src/services/menu.service.js'
import { DeliveryService } from '../src/services/delivery.service.js'

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  }
  refreshToken: {
    findUnique: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    updateMany: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
  loginAttempt: { create: ReturnType<typeof vi.fn> }
  menuItem: {
    findMany: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

const fakeUser = {
  id: 'u1',
  name: 'Test',
  email: 'test@mail.com',
  password: 'hashed-password',
  role: 'client',
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)
  ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-password')
})

describe('AuthService', () => {
  describe('register', () => {
    it('should create a user and return tokens without password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue(fakeUser)
      prismaMock.refreshToken.create.mockResolvedValue({})

      const result = await AuthService.register('Test', 'test@mail.com', 'Secure!Pass1')

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@mail.com' } })
      expect(prismaMock.user.create).toHaveBeenCalled()
      expect(result.accessToken).toBeTruthy()
      expect(result.refreshToken).toBeTruthy()
      expect(result.user.password).toBeUndefined()
    })

    it('should throw 409 when email is already registered', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      await expect(AuthService.register('Test', 'test@mail.com', 'Secure!Pass1')).rejects.toThrow(
        'Email already registered',
      )
    })
  })

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      prismaMock.refreshToken.create.mockResolvedValue({})

      const result = await AuthService.login('test@mail.com', 'Secure!Pass1', '127.0.0.1')

      expect(result.accessToken).toBeTruthy()
      expect(result.user.password).toBeUndefined()
      expect(prismaMock.loginAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ success: true }) }),
      )
    })

    it('should throw 401 when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      await expect(AuthService.login('nobody@mail.com', 'x', '127.0.0.1')).rejects.toThrow(
        'Invalid credentials',
      )
    })

    it('should throw 401 when password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)
      await expect(AuthService.login('test@mail.com', 'WrongPass!1', '127.0.0.1')).rejects.toThrow(
        'Invalid credentials',
      )
    })
  })

  describe('refresh', () => {
    it('should revoke the old token and issue new tokens', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        revoked: false,
        expiresAt: new Date(Date.now() + 60_000),
        tokenHash: 'some-hash',
        userId: 'u1',
        createdAt: new Date(),
        user: fakeUser,
      })
      prismaMock.refreshToken.update.mockResolvedValue({})
      prismaMock.refreshToken.create.mockResolvedValue({})

      const result = await AuthService.refresh('some-uuid')

      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'rt1' },
        data: { revoked: true },
      })
      expect(result.accessToken).toBeTruthy()
      expect(prismaMock.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/) },
        include: { user: true },
      })
    })

    it('should throw 401 for revoked tokens', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        revoked: true,
        expiresAt: new Date(Date.now() + 60_000),
        user: fakeUser,
      })
      await expect(AuthService.refresh('some-uuid')).rejects.toThrow('Invalid refresh token')
    })

    it('should throw 401 for expired tokens', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        revoked: false,
        expiresAt: new Date(Date.now() - 60_000),
        user: fakeUser,
      })
      await expect(AuthService.refresh('some-uuid')).rejects.toThrow('Invalid refresh token')
    })
  })

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 1 })
      await AuthService.logout('some-uuid')
      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/) },
        data: { revoked: true },
      })
    })
  })

  describe('changePassword', () => {
    it('should throw 404 when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      await expect(AuthService.changePassword('u1', 'old', 'New!Pass1')).rejects.toThrow(
        'User not found',
      )
    })

    it('should throw 401 when current password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)
      await expect(AuthService.changePassword('u1', 'wrong', 'New!Pass1')).rejects.toThrow(
        'Current password is incorrect',
      )
    })

    it('should update password and revoke sessions', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      prismaMock.user.update.mockResolvedValue(fakeUser)
      prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 1 })

      await AuthService.changePassword('u1', 'old', 'New!Pass1')

      expect(prismaMock.user.update).toHaveBeenCalled()
      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u1', revoked: false },
        data: { revoked: true },
      })
    })
  })

  describe('getProfile', () => {
    it('should return profile without password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(fakeUser)
      const profile = await AuthService.getProfile('u1')
      expect(profile.password).toBeUndefined()
    })

    it('should throw 404 when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      await expect(AuthService.getProfile('u1')).rejects.toThrow('User not found')
    })
  })
})

describe('MenuService', () => {
  const item = {
    id: 'm1',
    name: 'Pizza',
    description: 'x',
    price: 10,
    category: 'pizza',
    available: true,
    image: null,
  }

  it('should return all menu items', async () => {
    prismaMock.menuItem.findMany.mockResolvedValue([item])
    const items = await MenuService.getAll()
    expect(items).toHaveLength(1)
  })

  it('should get an item by id', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    await expect(MenuService.getById('m1')).resolves.toEqual(item)
  })

  it('should throw 404 when item does not exist', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null)
    await expect(MenuService.getById('m1')).rejects.toThrow('Menu item not found')
  })

  it('should create an item', async () => {
    prismaMock.menuItem.create.mockResolvedValue(item)
    await MenuService.create({ name: 'Pizza', description: 'x', price: 10, category: 'pizza' })
    expect(prismaMock.menuItem.create).toHaveBeenCalled()
  })

  it('should update an item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    prismaMock.menuItem.update.mockResolvedValue({ ...item, price: 15 })
    const updated = await MenuService.update('m1', { price: 15 })
    expect(updated.price).toBe(15)
  })

  it('should throw 404 when updating a missing item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null)
    await expect(MenuService.update('m1', { price: 15 })).rejects.toThrow('Menu item not found')
  })

  it('should delete an item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    prismaMock.menuItem.delete.mockResolvedValue(item)
    await MenuService.delete('m1')
    expect(prismaMock.menuItem.delete).toHaveBeenCalledWith({ where: { id: 'm1' } })
  })
})

describe('DeliveryService', () => {
  it('should return all delivery zones', () => {
    const zones = DeliveryService.getZones()
    expect(zones).toHaveLength(3)
    expect(zones[0]).toHaveProperty('fee')
    expect(zones[0]).toHaveProperty('estimatedMinutes')
  })

  it('should return fee for a known zone', () => {
    expect(DeliveryService.getZoneFee('centro')).toBe(3000)
    expect(DeliveryService.getZoneFee('lejano')).toBe(8000)
  })

  it('should return 0 fee for an unknown zone', () => {
    expect(DeliveryService.getZoneFee('unknown')).toBe(0)
  })

  it('should return config for a known zone and null otherwise', () => {
    expect(DeliveryService.getZoneConfig('periurbano')).not.toBeNull()
    expect(DeliveryService.getZoneConfig('unknown')).toBeNull()
  })

  it('should calculate total with delivery fee', () => {
    const result = DeliveryService.calculateTotal(100, 'centro')
    expect(result).toEqual({ fee: 3000, total: 3100 })
  })

  it('should calculate total without delivery fee', () => {
    const result = DeliveryService.calculateTotal(100)
    expect(result).toEqual({ fee: 0, total: 100 })
  })
})

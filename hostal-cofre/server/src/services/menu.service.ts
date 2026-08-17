import { Category } from '@prisma/client'
import prisma from '../db.js'

export class MenuService {
  static async getAll() {
    return prisma.menuItem.findMany({ orderBy: { createdAt: 'desc' } })
  }

  static async getById(id: string) {
    const item = await prisma.menuItem.findUnique({ where: { id } })
    if (!item) throw Object.assign(new Error('Menu item not found'), { statusCode: 404 })
    return item
  }

  static async create(data: {
    name: string
    description: string
    price: number
    category: Category
    image?: string
  }) {
    return prisma.menuItem.create({ data })
  }

  static async update(
    id: string,
    data: Partial<{
      name: string
      description: string
      price: number
      category: Category
      image: string
      available: boolean
    }>,
  ) {
    await this.getById(id)
    return prisma.menuItem.update({ where: { id }, data })
  }

  static async delete(id: string) {
    await this.getById(id)
    return prisma.menuItem.delete({ where: { id } })
  }
}

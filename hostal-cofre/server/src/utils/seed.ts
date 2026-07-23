import { PrismaClient, Role, Category, Zone } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from '../config/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  if (!config.adminPassword || !config.clientPassword) {
    console.error('❌ ADMIN_PASSWORD and CLIENT_PASSWORD must be set in .env')
    process.exit(1)
  }

  const adminPassword = config.adminPassword
  const clientPassword = config.clientPassword
  const adminEmail = config.adminEmail
  const clientEmail = config.clientEmail

  const adminHash = await bcrypt.hash(adminPassword, 12)
  const clientHash = await bcrypt.hash(clientPassword, 12)

  await prisma.user.createMany({
    data: [
      { name: 'Admin', email: adminEmail, password: adminHash, role: Role.admin },
      { name: 'Cliente Demo', email: clientEmail, password: clientHash, role: Role.client },
    ],
  })

  await prisma.menuItem.createMany({
    data: [
      { name: 'Ensalada Quinoa', description: 'Quinoa, cerezas, tomate cherry, aceitunas, aderezo especial', price: 12, category: Category.ensalada, image: '/images/ensalada.webp' },
      { name: 'Ensalada Mediterránea', description: 'Lechuga, feta, tomate, pepino, oliva griega', price: 14, category: Category.ensalada, image: '/images/ensalada2.webp' },
      { name: 'Ensalada César', description: 'Romana, crutones, parmesano, aderezo Caesar', price: 15, category: Category.ensalada, image: '/images/ensalada3.webp' },
      { name: 'Pasta Carbonara', description: 'Espagueti, pancetta, huevo, pecorino, pimienta', price: 18, category: Category.pasta, image: '/images/pasta1.webp' },
      { name: 'Pasta Boloñesa', description: 'Fettuccine, carne, tomate, zanahoria, hierbas', price: 16, category: Category.pasta, image: '/images/pasta2.webp' },
      { name: 'Pasta Pesto', description: 'Linguine, pesto genovés, piñones, parmesano', price: 17, category: Category.pasta, image: '/images/pasta3.webp' },
      { name: 'Pizza Margherita', description: 'Tomate, mozzarella fresca, albahaca', price: 20, category: Category.pizza, image: '/images/pizza1.webp' },
      { name: 'Pizza Pepperoni', description: 'Pepperoni picante, mozzarella, salsa especial', price: 22, category: Category.pizza, image: '/images/pizza2.webp' },
      { name: 'Pizza Vegetariana', description: 'Verduras grilladas, queso vegano, BBQ', price: 19, category: Category.pizza, image: '/images/pizza3.webp' },
      { name: 'Tiramisú Italiano', description: 'Mascarpone, café, galletas savoiardi', price: 8, category: Category.postre, image: '/images/postres1.webp' },
      { name: 'Cheesecake NY', description: 'Queso crema, galleta, salsa frutos rojos', price: 9, category: Category.postre, image: '/images/postres2.webp' },
      { name: 'Flan Napolitano', description: 'Clásico flan con caramelo artesanal', price: 7, category: Category.postre, image: '/images/postres3.webp' },
    ],
  })

  await prisma.table.createMany({
    data: [
      { number: 1, capacity: 2, zone: Zone.interior },
      { number: 2, capacity: 2, zone: Zone.interior },
      { number: 3, capacity: 4, zone: Zone.interior },
      { number: 4, capacity: 4, zone: Zone.exterior },
      { number: 5, capacity: 6, zone: Zone.exterior },
      { number: 6, capacity: 8, zone: Zone.privado },
      { number: 7, capacity: 10, zone: Zone.privado },
    ],
  })

  console.log('✅ Seed completed!')
  console.log(`📧 Admin: ${adminEmail}`)
  console.log(`📧 Cliente: ${clientEmail}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

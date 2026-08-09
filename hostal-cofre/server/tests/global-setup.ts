import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const TEST_DB = 'hostal_cofee_test'

function withDatabase(url: string, db: string): string {
  const parsed = new URL(url)
  const segments = parsed.pathname.split('/')
  segments[segments.length - 1] = db
  parsed.pathname = segments.join('/')
  return parsed.toString()
}

export default async function globalSetup() {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl)
    throw new Error('DATABASE_URL is not set. Configure server/.env before running tests.')

  const adminUrl = withDatabase(baseUrl, 'postgres')
  const testUrl = withDatabase(baseUrl, TEST_DB)

  const admin = new PrismaClient({ datasources: { db: { url: adminUrl } } })
  const exists = await admin.$queryRawUnsafe<Array<{ ok: number }>>(
    `SELECT 1 AS ok FROM pg_database WHERE datname = '${TEST_DB}'`,
  )
  if (exists.length === 0) {
    await admin.$executeRawUnsafe(`CREATE DATABASE "${TEST_DB}"`)
  }
  await admin.$disconnect()

  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testUrl },
  })

  process.env.DATABASE_URL = testUrl
}

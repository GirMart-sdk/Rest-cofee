import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  whatsappService,
  buildDeepLink,
  isWhatsAppApiEnabled,
} from '../src/services/whatsapp.service.js'

const originalEnv = { ...process.env }

beforeEach(() => {
  vi.resetModules()
  process.env.WHATSAPP_API_TOKEN = ''
  process.env.WHATSAPP_PHONE_NUMBER_ID = ''
  process.env.WHATSAPP_PHONE = '573001234567'
})

afterEach(() => {
  process.env = { ...originalEnv }
  vi.unstubAllGlobals()
})

describe('buildDeepLink', () => {
  it('should build a wa.me link with a URL-encoded message', () => {
    const link = buildDeepLink('573001234567', 'Hola mundo')
    expect(link).toContain('wa.me/573001234567')
    expect(decodeURIComponent(link)).toContain('Hola mundo')
  })

  it('should strip non-numeric characters from the phone', () => {
    const link = buildDeepLink('+57 300 123 4567', 'test')
    expect(link).toContain('wa.me/573001234567')
  })
})

describe('isWhatsAppApiEnabled', () => {
  it('should be false when API credentials are missing', () => {
    expect(isWhatsAppApiEnabled()).toBe(false)
  })

  it('should be true when credentials are present', () => {
    process.env.WHATSAPP_API_TOKEN = 'token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456'
    expect(isWhatsAppApiEnabled()).toBe(true)
  })
})

describe('whatsappService.notify', () => {
  it('should skip API call and return a deep link when not configured', async () => {
    const result = await whatsappService.notify({ to: '573001234567', text: 'Hola' })
    expect(result.sent).toBe(false)
    expect(result.deepLink).toContain('wa.me/')
  })

  it('should send via API when configured and credentials are present', async () => {
    process.env.WHATSAPP_API_TOKEN = 'token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456'
    process.env.NODE_ENV = 'production'

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ messages: [{ id: 'wamid' }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await whatsappService.notify({ to: '573001234567', text: 'Hola' })
    expect(result.sent).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://graph.facebook.com/v19.0/123456/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    )
  })

  it('should fall back to deep link when the API responds with an error', async () => {
    process.env.WHATSAPP_API_TOKEN = 'token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456'
    process.env.NODE_ENV = 'production'

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'invalid token' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await whatsappService.notify({ to: '573001234567', text: 'Hola' })
    expect(result.sent).toBe(false)
    expect(result.deepLink).toContain('wa.me/')
  })

  it('should never throw', async () => {
    process.env.WHATSAPP_API_TOKEN = 'token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456'
    process.env.NODE_ENV = 'production'

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    await expect(
      whatsappService.notify({ to: '573001234567', text: 'Hola' }),
    ).resolves.toMatchObject({
      sent: false,
    })
  })
})

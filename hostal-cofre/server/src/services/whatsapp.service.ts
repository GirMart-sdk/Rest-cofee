import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'
import { metrics } from '../utils/metrics.js'

interface WhatsAppTextMessage {
  to: string
  text: string
}

const GRAPH_API_VERSION = 'v19.0'

function getCredentials(): { apiToken: string; phoneNumberId: string } {
  return {
    apiToken: process.env.WHATSAPP_API_TOKEN || config.whatsapp.apiToken,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || config.whatsapp.phoneNumberId,
  }
}

export function isWhatsAppApiEnabled(): boolean {
  const { apiToken, phoneNumberId } = getCredentials()
  return Boolean(apiToken && phoneNumberId)
}

function formatPhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

async function sendViaApi(message: WhatsAppTextMessage): Promise<{ ok: boolean }> {
  const { apiToken, phoneNumberId } = getCredentials()
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formatPhone(message.to),
      type: 'text',
      text: { preview_url: false, body: message.text },
    }),
  })

  const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }

  if (!response.ok) {
    throw new Error(`WhatsApp API error ${response.status}: ${body.error?.message || 'unknown'}`)
  }
  return { ok: true }
}

export function buildDeepLink(phone: string, text: string): string {
  const message = encodeURIComponent(text)
  return `https://wa.me/${formatPhone(phone)}?text=${message}`
}

export const whatsappService = {
  isEnabled: isWhatsAppApiEnabled,

  buildDeepLink,

  async notify(message: WhatsAppTextMessage): Promise<{ sent: boolean; deepLink: string }> {
    const deepLink = buildDeepLink(config.whatsapp.phone, message.text)

    if (!isWhatsAppApiEnabled()) {
      metrics.inc('whatsappSkipped')
      logger.debug('whatsapp notification skipped (API not configured), using deep link', {
        to: message.to,
      })
      return { sent: false, deepLink }
    }

    if (process.env.NODE_ENV === 'test') {
      metrics.inc('whatsappSkipped')
      return { sent: false, deepLink }
    }

    try {
      await sendViaApi(message)
      metrics.inc('whatsappSent')
      logger.info('whatsapp notification sent', { to: message.to })
      return { sent: true, deepLink }
    } catch (error) {
      metrics.inc('whatsappFailed')
      logger.warn('whatsapp notification failed, falling back to deep link', {
        to: message.to,
        error: error instanceof Error ? error.message : String(error),
      })
      return { sent: false, deepLink }
    }
  },
}

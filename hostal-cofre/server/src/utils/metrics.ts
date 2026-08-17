interface MetricsSnapshot {
  startedAt: string
  uptimeSeconds: number
  totalRequests: number
  requestsByMethod: Record<string, number>
  requestsByRoute: Record<string, number>
  statusCodes: Record<string, number>
  totalErrors: number
  authLogins: number
  authFailedLogins: number
  ordersCreated: number
  ordersCancelled: number
  paymentsInitiated: number
  paymentsFailed: number
  paymentsWebhookRejected: number
  paymentsWebhookProcessed: number
  paymentsAmountMismatch: number
  whatsappSent: number
  whatsappFailed: number
  whatsappSkipped: number
}

class Metrics {
  private startedAt = new Date()
  private totalRequests = 0
  private requestsByMethod: Record<string, number> = {}
  private requestsByRoute: Record<string, number> = {}
  private statusCodes: Record<string, number> = {}
  private counters = new Map<string, number>()

  inc(key: string): void {
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1)
  }

  private getCounter(key: string): number {
    return this.counters.get(key) ?? 0
  }

  trackRequest(method: string, route: string): void {
    this.totalRequests += 1
    this.requestsByMethod[method] = (this.requestsByMethod[method] || 0) + 1
    const normalized = route.replace(/\/[a-f0-9]{24,}/g, '/:id').replace(/\/[a-z0-9]{25,}/g, '/:id')
    this.requestsByRoute[normalized] = (this.requestsByRoute[normalized] || 0) + 1
  }

  trackResponse(statusCode: number): void {
    const key = String(statusCode)
    this.statusCodes[key] = (this.statusCodes[key] || 0) + 1
    if (statusCode >= 500) this.inc('totalErrors')
  }

  snapshot(): MetricsSnapshot {
    return {
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Math.round((Date.now() - this.startedAt.getTime()) / 1000),
      totalRequests: this.totalRequests,
      requestsByMethod: this.requestsByMethod,
      requestsByRoute: this.requestsByRoute,
      statusCodes: this.statusCodes,
      totalErrors: this.getCounter('totalErrors'),
      authLogins: this.getCounter('authLogins'),
      authFailedLogins: this.getCounter('authFailedLogins'),
      ordersCreated: this.getCounter('ordersCreated'),
      ordersCancelled: this.getCounter('ordersCancelled'),
      paymentsInitiated: this.getCounter('paymentsInitiated'),
      paymentsFailed: this.getCounter('paymentsFailed'),
      paymentsWebhookRejected: this.getCounter('paymentsWebhookRejected'),
      paymentsWebhookProcessed: this.getCounter('paymentsWebhookProcessed'),
      paymentsAmountMismatch: this.getCounter('paymentsAmountMismatch'),
      whatsappSent: this.getCounter('whatsappSent'),
      whatsappFailed: this.getCounter('whatsappFailed'),
      whatsappSkipped: this.getCounter('whatsappSkipped'),
    }
  }
}

export const metrics = new Metrics()

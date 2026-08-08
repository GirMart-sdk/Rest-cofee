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
  private totalErrors = 0
  private authLogins = 0
  private authFailedLogins = 0
  private ordersCreated = 0
  private ordersCancelled = 0
  private paymentsInitiated = 0
  private paymentsFailed = 0
  private whatsappSent = 0
  private whatsappFailed = 0
  private whatsappSkipped = 0

  inc(key: keyof Omit<MetricsSnapshot, 'startedAt' | 'uptimeSeconds'>): void {
    if (key === 'totalRequests') this.totalRequests += 1
    else if (key === 'totalErrors') this.totalErrors += 1
    else if (key === 'authLogins') this.authLogins += 1
    else if (key === 'authFailedLogins') this.authFailedLogins += 1
    else if (key === 'ordersCreated') this.ordersCreated += 1
    else if (key === 'ordersCancelled') this.ordersCancelled += 1
    else if (key === 'paymentsInitiated') this.paymentsInitiated += 1
    else if (key === 'paymentsFailed') this.paymentsFailed += 1
    else if (key === 'whatsappSent') this.whatsappSent += 1
    else if (key === 'whatsappFailed') this.whatsappFailed += 1
    else if (key === 'whatsappSkipped') this.whatsappSkipped += 1
  }

  trackRequest(method: string, route: string): void {
    this.totalRequests += 1
    this.requestsByMethod[method] = (this.requestsByMethod[method] || 0) + 1
    const normalized = route.replace(/\/[a-f0-9]{24,}/g, '/:id')
    this.requestsByRoute[normalized] = (this.requestsByRoute[normalized] || 0) + 1
  }

  trackResponse(statusCode: number): void {
    const key = String(statusCode)
    this.statusCodes[key] = (this.statusCodes[key] || 0) + 1
    if (statusCode >= 500) this.totalErrors += 1
  }

  snapshot(): MetricsSnapshot {
    return {
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Math.round((Date.now() - this.startedAt.getTime()) / 1000),
      totalRequests: this.totalRequests,
      requestsByMethod: this.requestsByMethod,
      requestsByRoute: this.requestsByRoute,
      statusCodes: this.statusCodes,
      totalErrors: this.totalErrors,
      authLogins: this.authLogins,
      authFailedLogins: this.authFailedLogins,
      ordersCreated: this.ordersCreated,
      ordersCancelled: this.ordersCancelled,
      paymentsInitiated: this.paymentsInitiated,
      paymentsFailed: this.paymentsFailed,
      whatsappSent: this.whatsappSent,
      whatsappFailed: this.whatsappFailed,
      whatsappSkipped: this.whatsappSkipped,
    }
  }
}

export const metrics = new Metrics()

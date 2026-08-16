interface ApiErrorShape {
  response?: { data?: { error?: unknown; errors?: Array<{ message?: string }> } }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const e = error as ApiErrorShape
    const zodErrors = e.response?.data?.errors
    if (Array.isArray(zodErrors) && zodErrors.length > 0) {
      const messages = zodErrors
        .map((item) => item?.message)
        .filter((m): m is string => typeof m === 'string' && m.trim().length > 0)
      if (messages.length > 0) return messages.join(', ')
    }
    const serverError = e.response?.data?.error
    if (typeof serverError === 'string' && serverError.trim().length > 0) return serverError
  }
  return fallback
}

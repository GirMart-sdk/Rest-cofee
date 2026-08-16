export function formatCOP(amount: number): string {
  const hasDecimals = !Number.isInteger(amount)
  const digits = hasDecimals ? 2 : 0
  return `$${amount.toLocaleString('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

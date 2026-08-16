export function parseDurationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim())
  if (!match) return 7 * 24 * 60 * 60 * 1000
  const amount = parseInt(match[1], 10)
  const unit = match[2]
  const unitMs =
    unit === 's'
      ? 1000
      : unit === 'm'
        ? 60 * 1000
        : unit === 'h'
          ? 60 * 60 * 1000
          : 24 * 60 * 60 * 1000
  return amount * unitMs
}

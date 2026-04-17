import { format } from 'date-fns'

export function generateId(type) {
  const now = new Date()
  const timestamp = format(now, 'yyyy-MMMM-dd-HH-mm-ss-SSS')
  const randomSuffix = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().split('-')[0]
    : Math.random().toString(36).slice(2, 10)

  return `${type}-${timestamp}-${randomSuffix}`
}

export function formatCurrency(amount) {
  const numericAmount = Number(amount)
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0
  return `₹${safeAmount.toLocaleString('en-IN')}`
}

export function toSQLDatetime(date) {
  if (!date) return null
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export function parseItems(allItems) {
  if (!allItems) return []
  return allItems.split(',').filter(Boolean).map((part, i) => {
    const [name, qty, unitPrice] = part.split(':')
    const q = parseInt(qty) || 0
    const p = parseInt(unitPrice) || 0
    return { id: i + 1, name, qty: q, unitPrice: p, total: q * p }
  })
}

export function parseHall(allHall) {
  if (!allHall) return null
  const colonIdx = allHall.lastIndexOf(':')
  return {
    name: allHall.slice(0, colonIdx),
    price: parseInt(allHall.slice(colonIdx + 1)) || 0,
  }
}

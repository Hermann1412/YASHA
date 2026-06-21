export function formatTHB(amount) {
  return `฿${Number(amount || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function statusColor(status) {
  const map = {
    pending: 'text-yellow-400',
    confirmed: 'text-green-400',
    paid: 'text-gold',
    rejected: 'text-red-400',
  }
  return map[status] ?? 'text-gray-400'
}

export function platformColor(platform) {
  const map = {
    shopee: 'bg-orange-500',
    lazada: 'bg-blue-600',
    aliexpress: 'bg-red-600',
  }
  return map[platform?.toLowerCase()] ?? 'bg-gray-600'
}

export function platformLabel(platform) {
  const map = {
    shopee: 'Shopee',
    lazada: 'Lazada',
    aliexpress: 'AliExpress',
  }
  return map[platform?.toLowerCase()] ?? platform
}

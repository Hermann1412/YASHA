const axios = require('axios')
const crypto = require('crypto')

const APP_KEY = process.env.LAZADA_APP_KEY
const SECRET = process.env.LAZADA_SECRET_KEY
const BASE_URL = 'https://api.lazada.co.th/rest'

function sign(params) {
  const sorted = Object.keys(params).sort().map(k => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', SECRET).update(sorted).digest('hex').toUpperCase()
}

async function getFeaturedProducts({ page = 1, limit = 20 } = {}) {
  if (!APP_KEY || !SECRET) return getMockProducts('lazada', limit)
  try {
    const timestamp = Date.now()
    const params = {
      app_key: APP_KEY,
      timestamp,
      sign_method: 'sha256',
      method: '/affiliate/product/query',
      page_index: page,
      page_size: limit,
    }
    params.sign = sign(params)

    const { data } = await axios.get(`${BASE_URL}/affiliate/product/query`, { params })
    return (data?.data?.products ?? []).map(normalizeLazada)
  } catch {
    return getMockProducts('lazada', limit)
  }
}

async function generateLink(productId) {
  if (!APP_KEY || !SECRET) return `https://www.lazada.co.th/products/${productId}`
  return `https://c.lazada.co.th/t/c.${APP_KEY}?url=https://www.lazada.co.th/products/${productId}`
}

function normalizeLazada(item) {
  const commRate = parseFloat(item.commission_rate ?? '6')
  return {
    id: String(item.item_id),
    platform: 'lazada',
    name: item.name,
    price: parseFloat(item.price ?? 0),
    image: item.image,
    url: item.product_url,
    cashbackPercent: (commRate * 0.5).toFixed(1),
    cashbackAmount: parseFloat(item.price ?? 0) * (commRate / 100) * 0.5,
  }
}

function getMockProducts(platform, count) {
  return Array.from({ length: Number(count) }, (_, i) => ({
    id: `${platform}-${i + 1}`,
    platform,
    name: `Sample ${platform} Product ${i + 1}`,
    price: Math.round((Math.random() * 2000 + 100) * 100) / 100,
    image: `https://picsum.photos/seed/${platform}${i + 20}/400/400`,
    url: '#',
    cashbackPercent: (Math.random() * 6 + 2).toFixed(1),
    cashbackAmount: Math.round(Math.random() * 40 + 5),
  }))
}

module.exports = { getFeaturedProducts, generateLink }

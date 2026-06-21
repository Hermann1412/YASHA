const axios = require('axios')
const crypto = require('crypto')

const APP_KEY = process.env.ALIEXPRESS_APP_KEY
const SECRET = process.env.ALIEXPRESS_SECRET_KEY
const BASE_URL = 'https://api-sg.aliexpress.com/sync'

function sign(params) {
  const sorted = Object.keys(params).sort().map(k => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', SECRET).update(SECRET + sorted + SECRET).digest('hex').toUpperCase()
}

async function getFeaturedProducts({ page = 1, limit = 20 } = {}) {
  if (!APP_KEY || !SECRET) return getMockProducts('aliexpress', limit)
  try {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
    const params = {
      method: 'aliexpress.affiliate.featuredpromo.products.get',
      app_key: APP_KEY,
      timestamp,
      sign_method: 'sha256',
      page_no: page,
      page_size: limit,
      target_currency: 'THB',
      target_language: 'EN',
    }
    params.sign = sign(params)

    const { data } = await axios.get(BASE_URL, { params })
    const products = data?.aliexpress_affiliate_featuredpromo_products_get_response?.resp_result?.result?.products?.product ?? []
    return products.map(normalizeAliexpress)
  } catch {
    return getMockProducts('aliexpress', limit)
  }
}

async function generateLink(productId) {
  if (!APP_KEY || !SECRET) return `https://www.aliexpress.com/item/${productId}.html`
  try {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
    const params = {
      method: 'aliexpress.affiliate.link.generate',
      app_key: APP_KEY,
      timestamp,
      sign_method: 'sha256',
      promotion_link_type: '0',
      source_values: `https://www.aliexpress.com/item/${productId}.html`,
    }
    params.sign = sign(params)
    const { data } = await axios.get(BASE_URL, { params })
    return data?.aliexpress_affiliate_link_generate_response?.resp_result?.result?.promotion_links?.promotion_link?.[0]?.promotion_link
      ?? `https://www.aliexpress.com/item/${productId}.html`
  } catch {
    return `https://www.aliexpress.com/item/${productId}.html`
  }
}

function normalizeAliexpress(item) {
  const commRate = parseFloat(item.commission_rate ?? '10')
  return {
    id: String(item.product_id),
    platform: 'aliexpress',
    name: item.product_title,
    price: parseFloat(item.target_sale_price ?? item.target_original_price ?? 0),
    image: item.product_main_image_url,
    url: item.product_detail_url,
    cashbackPercent: (commRate * 0.5).toFixed(1),
    cashbackAmount: parseFloat(item.target_sale_price ?? 0) * (commRate / 100) * 0.5,
  }
}

function getMockProducts(platform, count) {
  return Array.from({ length: Number(count) }, (_, i) => ({
    id: `${platform}-${i + 1}`,
    platform,
    name: `Sample ${platform} Product ${i + 1}`,
    price: Math.round((Math.random() * 1500 + 50) * 100) / 100,
    image: `https://picsum.photos/seed/${platform}${i + 40}/400/400`,
    url: '#',
    cashbackPercent: (Math.random() * 10 + 4).toFixed(1),
    cashbackAmount: Math.round(Math.random() * 60 + 5),
  }))
}

module.exports = { getFeaturedProducts, generateLink }

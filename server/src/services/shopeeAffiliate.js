const axios = require('axios')
const crypto = require('crypto')

const APP_ID = process.env.SHOPEE_APP_ID
const SECRET = process.env.SHOPEE_SECRET_KEY
const BASE_URL = 'https://open-api.affiliate.shopee.co.th/graphql'

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
}

async function getFeaturedProducts({ page = 1, limit = 20 } = {}) {
  if (!APP_ID || !SECRET) return getMockProducts('shopee', limit)
  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const payload = `${APP_ID}${timestamp}`
    const sig = sign(payload)

    const query = `{
      productOfferV2(listType: 2, page: ${page}, limit: ${limit}, sortType: 2) {
        nodes { itemId productName productPrice imageUrl commissionRate shopName }
        pageInfo { hasNextPage }
      }
    }`

    const { data } = await axios.post(BASE_URL, { query }, {
      headers: { Authorization: `SHA256 Credential=${APP_ID},Timestamp=${timestamp},Signature=${sig}` }
    })

    return (data?.data?.productOfferV2?.nodes ?? []).map(normalizeShopee)
  } catch {
    return getMockProducts('shopee', limit)
  }
}

async function generateLink(itemId) {
  if (!APP_ID || !SECRET) return `https://shopee.co.th/product/${itemId}`
  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const sig = sign(`${APP_ID}${timestamp}`)
    const query = `mutation { generateShortLink(input: { originUrl: "https://shopee.co.th/product/${itemId}" }) { shortLink } }`
    const { data } = await axios.post(BASE_URL, { query }, {
      headers: { Authorization: `SHA256 Credential=${APP_ID},Timestamp=${timestamp},Signature=${sig}` }
    })
    return data?.data?.generateShortLink?.shortLink ?? `https://shopee.co.th/product/${itemId}`
  } catch {
    return `https://shopee.co.th/product/${itemId}`
  }
}

function normalizeShopee(item) {
  const pct = parseFloat(item.commissionRate ?? '8')
  return {
    id: String(item.itemId),
    platform: 'shopee',
    name: item.productName,
    price: item.productPrice / 100,
    image: item.imageUrl,
    url: `https://shopee.co.th/product/${item.itemId}`,
    cashbackPercent: (pct * 0.5).toFixed(1),
    cashbackAmount: (item.productPrice / 100) * (pct / 100) * 0.5,
  }
}

function getMockProducts(platform, count) {
  return Array.from({ length: Number(count) }, (_, i) => ({
    id: `${platform}-${i + 1}`,
    platform,
    name: `Sample ${platform} Product ${i + 1}`,
    price: Math.round((Math.random() * 2000 + 100) * 100) / 100,
    image: `https://picsum.photos/seed/${platform}${i}/400/400`,
    url: '#',
    cashbackPercent: (Math.random() * 8 + 3).toFixed(1),
    cashbackAmount: Math.round(Math.random() * 50 + 5),
  }))
}

module.exports = { getFeaturedProducts, generateLink }

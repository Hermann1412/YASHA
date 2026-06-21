import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export async function getTrackedLink(platform, productId, userId) {
  const { data } = await axios.post(`${API}/products/track`, {
    platform,
    productId,
    userId,
  })
  return data.affiliateUrl
}

export async function getProducts({ platform, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (platform) params.set('platform', platform)
  const { data } = await axios.get(`${API}/products?${params}`)
  return data
}

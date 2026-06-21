const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const shopee = require('../services/shopeeAffiliate')
const lazada = require('../services/lazadaAffiliate')
const aliexpress = require('../services/aliexpressAffiliate')
const { getSupabase } = require('../db/supabase')

const router = Router()

router.get('/', async (req, res) => {
  const { platform, page = 1, limit = 20 } = req.query
  try {
    let products = []

    if (!platform || platform === 'shopee') {
      const s = await shopee.getFeaturedProducts({ page, limit })
      products.push(...s)
    }
    if (!platform || platform === 'lazada') {
      const l = await lazada.getFeaturedProducts({ page, limit })
      products.push(...l)
    }
    if (!platform || platform === 'aliexpress') {
      const a = await aliexpress.getFeaturedProducts({ page, limit })
      products.push(...a)
    }

    if (platform) products = products.slice(0, limit)
    res.json({ products, hasMore: products.length === Number(limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/track', authMiddleware, async (req, res) => {
  const db = getSupabase()
  const { platform, productId, userId } = req.body
  if (!platform || !productId) return res.status(400).json({ error: 'platform and productId required' })

  let affiliateUrl
  if (platform === 'shopee') affiliateUrl = await shopee.generateLink(productId)
  else if (platform === 'lazada') affiliateUrl = await lazada.generateLink(productId)
  else if (platform === 'aliexpress') affiliateUrl = await aliexpress.generateLink(productId)
  else return res.status(400).json({ error: 'Unknown platform' })

  await db.from('clicks').insert({
    user_id: userId ?? req.user.id,
    platform,
    product_id: productId,
    affiliate_url: affiliateUrl,
  })

  res.json({ affiliateUrl })
})

module.exports = router

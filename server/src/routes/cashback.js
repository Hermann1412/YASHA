const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const { getSupabase } = require('../db/supabase')

const router = Router()

const CASHBACK_SPLIT = 0.5

router.post('/webhook', async (req, res) => {
  const db = getSupabase()
  const { platform, orderId, orderValue, commissionEarned, userId } = req.body
  const cashbackAmount = commissionEarned * CASHBACK_SPLIT

  const { error } = await db.from('transactions').insert({
    user_id: userId,
    platform,
    order_id: orderId,
    order_value: orderValue,
    commission_earned: commissionEarned,
    cashback_amount: cashbackAmount,
    status: 'pending',
  })

  if (error) return res.status(500).json({ error: error.message })

  await db.rpc('increment_pending', { uid: userId, amount: cashbackAmount })

  res.json({ ok: true, cashbackAmount })
})

router.get('/', authMiddleware, async (req, res) => {
  const db = getSupabase()
  const { data, error } = await db
    .from('transactions')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router

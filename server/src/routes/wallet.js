const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const { getSupabase } = require('../db/supabase')

const router = Router()

const MIN_WITHDRAWAL = 500

router.get('/', authMiddleware, async (req, res) => {
  const db = getSupabase()
  const { data, error } = await db
    .from('wallets')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/withdraw', authMiddleware, async (req, res) => {
  const db = getSupabase()
  const { amount, method } = req.body
  const userId = req.user.id

  if (!amount || amount < MIN_WITHDRAWAL) {
    return res.status(400).json({ error: `Minimum withdrawal is ฿${MIN_WITHDRAWAL}` })
  }
  if (!['payoneer', 'wise'].includes(method)) {
    return res.status(400).json({ error: 'Invalid payout method' })
  }

  const { data: wallet } = await db
    .from('wallets')
    .select('available_balance')
    .eq('user_id', userId)
    .single()

  if (!wallet || wallet.available_balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' })
  }

  await db
    .from('wallets')
    .update({ available_balance: wallet.available_balance - amount })
    .eq('user_id', userId)

  const { data: withdrawal, error: wErr } = await db
    .from('withdrawals')
    .insert({ user_id: userId, amount, method, status: 'pending' })
    .select()
    .single()

  if (wErr) return res.status(500).json({ error: wErr.message })
  res.json({ ok: true, withdrawal })
})

module.exports = router

const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')
const { getSupabase } = require('../db/supabase')

const router = Router()

router.use(authMiddleware, adminOnly)

router.get('/stats', async (_req, res) => {
  const db = getSupabase()
  const [usersRes, txRes] = await Promise.all([
    db.from('users').select('id', { count: 'exact', head: true }),
    db.from('transactions').select('cashback_amount, commission_earned, status'),
  ])

  const txs = txRes.data ?? []
  const grossRevenue = txs.reduce((s, t) => s + (t.commission_earned ?? 0), 0)
  const cashbackPaid = txs.filter(t => t.status === 'paid').reduce((s, t) => s + (t.cashback_amount ?? 0), 0)

  res.json({
    totalUsers: usersRes.count ?? 0,
    grossRevenue,
    cashbackPaid,
    netProfit: grossRevenue - cashbackPaid,
  })
})

router.get('/users', async (req, res) => {
  const db = getSupabase()
  const { search, page = 1, limit = 20 } = req.query
  let query = db.from('users').select('*', { count: 'exact' })
  if (search) query = query.ilike('email', `%${search}%`)
  const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ users: data, total: count })
})

router.get('/transactions', async (req, res) => {
  const db = getSupabase()
  const { status, page = 1, limit = 50 } = req.query
  let query = db.from('transactions').select('*, users(email)', { count: 'exact' }).order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query.range((page - 1) * limit, page * limit - 1)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.patch('/transactions/:id', async (req, res) => {
  const db = getSupabase()
  const { status } = req.body
  const { id } = req.params
  if (!['pending', 'confirmed', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const { data: tx } = await db.from('transactions').select('*').eq('id', id).single()
  if (!tx) return res.status(404).json({ error: 'Transaction not found' })

  await db.from('transactions').update({ status, confirmed_at: status === 'confirmed' ? new Date() : null }).eq('id', id)

  if (status === 'confirmed') {
    const { data: wallet } = await db.from('wallets').select('*').eq('user_id', tx.user_id).single()
    if (wallet) {
      await db.from('wallets').update({
        pending_balance: Math.max(0, wallet.pending_balance - tx.cashback_amount),
        available_balance: wallet.available_balance + tx.cashback_amount,
        total_earned: wallet.total_earned + tx.cashback_amount,
      }).eq('user_id', tx.user_id)
    }
  }

  res.json({ ok: true })
})

router.get('/payouts', async (_req, res) => {
  const db = getSupabase()
  const { data, error } = await db
    .from('withdrawals')
    .select('*, users(email, payoneer_email, wise_email)')
    .eq('status', 'pending')
    .order('requested_at')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.patch('/payouts/:id/approve', async (req, res) => {
  const db = getSupabase()
  await db.from('withdrawals').update({ status: 'completed', completed_at: new Date() }).eq('id', req.params.id)
  res.json({ ok: true })
})

module.exports = router

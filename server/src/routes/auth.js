const { Router } = require('express')
const { getSupabase } = require('../db/supabase')

const router = Router()

// Called after Supabase auth — ensures user row + wallet exist
router.post('/sync', async (req, res) => {
  const db = getSupabase()
  const { userId, email, name, referralCode } = req.body
  if (!userId || !email) return res.status(400).json({ error: 'userId and email required' })

  const { error: uErr } = await db.from('users').upsert({
    id: userId,
    email,
    name: name ?? email.split('@')[0],
    referral_code: userId.slice(0, 8).toUpperCase(),
  }, { onConflict: 'id', ignoreDuplicates: true })
  if (uErr) return res.status(500).json({ error: uErr.message })

  if (referralCode) {
    const { data: referrer } = await db
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single()
    if (referrer) {
      await db.from('users').update({ referred_by: referrer.id }).eq('id', userId)
    }
  }

  await db.from('wallets').upsert(
    { user_id: userId },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )

  res.json({ ok: true })
})

module.exports = router

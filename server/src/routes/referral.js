const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const { getSupabase } = require('../db/supabase')

const router = Router()

const REFERRAL_REWARD_PCT = 0.1
const REFERRAL_DAYS = 90

router.get('/stats', authMiddleware, async (req, res) => {
  const db = getSupabase()
  const { data: referrals } = await db
    .from('users')
    .select('id, name, created_at')
    .eq('referred_by', req.user.id)

  res.json({ referrals: referrals ?? [], count: (referrals ?? []).length })
})

async function payReferralReward(referredUserId, cashbackAmount) {
  const db = getSupabase()
  const { data: user } = await db
    .from('users')
    .select('referred_by, created_at')
    .eq('id', referredUserId)
    .single()

  if (!user?.referred_by) return

  const daysSinceSignup = (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
  if (daysSinceSignup > REFERRAL_DAYS) return

  const reward = cashbackAmount * REFERRAL_REWARD_PCT

  const { data: w } = await db
    .from('wallets')
    .select('available_balance, total_earned')
    .eq('user_id', user.referred_by)
    .single()

  if (w) {
    await db.from('wallets')
      .update({ available_balance: w.available_balance + reward, total_earned: w.total_earned + reward })
      .eq('user_id', user.referred_by)
  }
}

module.exports = router
module.exports.payReferralReward = payReferralReward

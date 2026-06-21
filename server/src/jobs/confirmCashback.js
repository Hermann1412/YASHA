const cron = require('node-cron')
const { getSupabase } = require('../db/supabase')

// Run daily at 2am — confirm cashback older than 14 days
cron.schedule('0 2 * * *', async () => {
  console.log('[Job] Running confirmCashback...')
  const db = getSupabase()
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const { data: pending } = await db
    .from('transactions')
    .select('*')
    .eq('status', 'pending')
    .lt('created_at', cutoff)

  if (!pending?.length) return

  for (const tx of pending) {
    await db.from('transactions')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', tx.id)

    const { data: wallet } = await db.from('wallets').select('*').eq('user_id', tx.user_id).single()

    if (wallet) {
      await db.from('wallets').update({
        pending_balance: Math.max(0, wallet.pending_balance - tx.cashback_amount),
        available_balance: wallet.available_balance + tx.cashback_amount,
        total_earned: wallet.total_earned + tx.cashback_amount,
      }).eq('user_id', tx.user_id)
    }
  }

  console.log(`[Job] Confirmed ${pending.length} transactions`)
})

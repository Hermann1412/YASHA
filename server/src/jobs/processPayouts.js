const cron = require('node-cron')
const { getSupabase } = require('../db/supabase')
const payoneer = require('../services/payoneer')
const wise = require('../services/wise')

// Run every Monday at 9am — process pending withdrawals
cron.schedule('0 9 * * 1', async () => {
  console.log('[Job] Running processPayouts...')
  const db = getSupabase()

  const { data: pending } = await db
    .from('withdrawals')
    .select('*, users(email, payoneer_email, wise_email)')
    .eq('status', 'pending')

  if (!pending?.length) return

  for (const w of pending) {
    try {
      const recipientEmail = w.method === 'payoneer'
        ? w.users?.payoneer_email ?? w.users?.email
        : w.users?.wise_email ?? w.users?.email

      const ref = w.method === 'payoneer'
        ? await payoneer.sendPayout({ recipientEmail, amount: w.amount })
        : await wise.sendPayout({ recipientEmail, amount: w.amount })

      await db.from('withdrawals').update({
        status: 'completed',
        payout_reference: ref.paymentId ?? ref.transferId,
        completed_at: new Date().toISOString(),
      }).eq('id', w.id)
    } catch (err) {
      console.error(`[Job] Payout ${w.id} failed:`, err.message)
    }
  }

  console.log(`[Job] Processed ${pending.length} payouts`)
})

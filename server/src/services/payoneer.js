const axios = require('axios')

const API_KEY = process.env.PAYONEER_API_KEY
const PROGRAM_ID = process.env.PAYONEER_PROGRAM_ID
const BASE = 'https://api.payoneer.com/v2'

async function sendPayout({ recipientEmail, amount, currency = 'THB', description = 'YASHA Cashback' }) {
  if (!API_KEY || !PROGRAM_ID) {
    console.log(`[Payoneer MOCK] Would send ${amount} ${currency} to ${recipientEmail}`)
    return { success: true, paymentId: `mock_${Date.now()}` }
  }

  const { data } = await axios.post(
    `${BASE}/programs/${PROGRAM_ID}/payments`,
    {
      payee_id: recipientEmail,
      amount,
      currency,
      description,
      client_reference_id: `yasha_${Date.now()}`,
    },
    { headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
  )

  return { success: true, paymentId: data.payment_id }
}

async function massPayout(payments) {
  return Promise.all(payments.map(sendPayout))
}

module.exports = { sendPayout, massPayout }

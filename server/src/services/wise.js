const axios = require('axios')

const API_KEY = process.env.WISE_API_KEY
const BASE = 'https://api.wise.com/v1'

async function sendPayout({ recipientEmail, amount, currency = 'THB', reference = 'YASHA Cashback' }) {
  if (!API_KEY) {
    console.log(`[Wise MOCK] Would send ${amount} ${currency} to ${recipientEmail}`)
    return { success: true, transferId: `mock_${Date.now()}` }
  }

  const headers = { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }

  // 1. Get profile
  const { data: profiles } = await axios.get(`${BASE}/profiles`, { headers })
  const profile = profiles.find((p) => p.type === 'business')

  // 2. Create quote
  const { data: quote } = await axios.post(`${BASE}/quotes`, {
    profile: profile.id, sourceCurrency: currency, targetCurrency: currency,
    targetAmount: amount, payOut: 'BANK_TRANSFER',
  }, { headers })

  // 3. Create recipient
  const { data: recipient } = await axios.post(`${BASE}/accounts`, {
    profile: profile.id, email: recipientEmail, type: 'EMAIL',
  }, { headers })

  // 4. Create transfer
  const { data: transfer } = await axios.post(`${BASE}/transfers`, {
    targetAccount: recipient.id, quote: quote.id,
    customerTransactionId: `yasha_${Date.now()}`,
    details: { reference },
  }, { headers })

  // 5. Fund
  await axios.post(`${BASE}/transfers/${transfer.id}/payments`, { type: 'BALANCE' }, { headers })

  return { success: true, transferId: transfer.id }
}

module.exports = { sendPayout }

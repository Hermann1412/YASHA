import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../store/userStore'
import { formatTHB } from '../../lib/formatters'
import Button from '../ui/Button'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function WithdrawModal({ open, onClose }) {
  const [method, setMethod] = useState('payoneer')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const wallet = useUserStore((s) => s.wallet)
  const user = useUserStore((s) => s.user)
  const refreshWallet = useUserStore((s) => s.refreshWallet)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API}/wallet/withdraw`, {
        userId: user.id,
        amount: parseFloat(amount),
        method,
      }, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      })
      setSuccess(true)
      refreshWallet()
    } catch (err) {
      alert(err.response?.data?.error ?? 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setSuccess(false)
    setAmount('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-yasha-dark rounded-t-3xl p-6 z-50 border-t border-yasha-border"
          >
            {success ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-xl font-bold text-gold">Withdrawal Requested!</p>
                <p className="text-gray-400 text-sm mt-2">We'll process your payment within 3–5 business days.</p>
                <Button onClick={handleClose} className="w-full mt-6">Done</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-1">Withdraw Cashback</h2>
                <p className="text-gray-400 text-sm mb-6">Available: {formatTHB(wallet?.available_balance)}</p>

                <label className="block text-sm font-medium mb-2">Payout Method</label>
                <div className="flex gap-2 mb-4">
                  {['payoneer', 'wise'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex-1 py-2 rounded-xl font-semibold text-sm capitalize border transition-colors ${
                        method === m ? 'border-gold text-gold bg-gold/10' : 'border-yasha-border text-gray-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium mb-2">Amount (THB)</label>
                <input
                  type="number"
                  min="500"
                  max={wallet?.available_balance ?? 0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="฿0.00"
                  required
                  className="w-full bg-yasha-card border border-yasha-border rounded-xl px-4 py-3 text-white text-lg font-bold mb-6 focus:border-gold outline-none"
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

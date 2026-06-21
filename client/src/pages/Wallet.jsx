import { useState } from 'react'
import { motion } from 'framer-motion'
import BalanceWidget from '../components/wallet/BalanceWidget'
import WithdrawModal from '../components/wallet/WithdrawModal'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'
import { formatTHB, formatDate } from '../lib/formatters'
import { useEffect } from 'react'

export default function Wallet() {
  const [modalOpen, setModalOpen] = useState(false)
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore((s) => s.user)

  useEffect(() => {
    if (!user) return
    supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
      .then(({ data }) => {
        setWithdrawals(data ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="page">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      <div className="mb-6">
        <BalanceWidget onWithdraw={() => setModalOpen(true)} />
      </div>

      {/* Payout methods */}
      <div className="mb-6">
        <h2 className="section-title">Payout Methods</h2>
        <div className="space-y-2">
          {[
            { name: 'Payoneer', desc: '3–5 business days', icon: '💳' },
            { name: 'Wise', desc: '1–2 business days', icon: '🏦' },
          ].map((m) => (
            <div key={m.name} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
              <span className="text-gray-500 text-sm">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal history */}
      <div>
        <h2 className="section-title">Withdrawal History</h2>
        <div className="card px-4">
          {loading ? (
            <div className="py-6 text-center text-gray-500 text-sm">Loading...</div>
          ) : withdrawals.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">No withdrawals yet</div>
          ) : (
            withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3 border-b border-yasha-border last:border-0">
                <div>
                  <p className="text-sm font-medium capitalize">{w.method}</p>
                  <p className="text-xs text-gray-500">{formatDate(w.requested_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">{formatTHB(w.amount)}</p>
                  <p className={`text-xs capitalize ${w.status === 'completed' ? 'text-green-400' : w.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {w.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <WithdrawModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCashback } from '../hooks/useCashback'
import TransactionItem from '../components/cashback/TransactionItem'
import { formatTHB } from '../lib/formatters'

const tabs = ['All', 'Pending', 'Confirmed', 'Paid']

export default function MyCashback() {
  const [activeTab, setActiveTab] = useState('All')
  const { transactions, pending, confirmed, paid, loading } = useCashback()

  const lists = { All: transactions, Pending: pending, Confirmed: confirmed, Paid: paid }
  const shown = lists[activeTab] ?? []

  return (
    <div className="page">
      <h1 className="text-2xl font-bold mb-2">My Cashback</h1>

      {/* Summary row */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 card p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="font-bold text-yellow-400 text-sm">{formatTHB(pending.reduce((s, t) => s + t.cashback_amount, 0))}</p>
        </div>
        <div className="flex-1 card p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Confirmed</p>
          <p className="font-bold text-green-400 text-sm">{formatTHB(confirmed.reduce((s, t) => s + t.cashback_amount, 0))}</p>
        </div>
        <div className="flex-1 card p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Paid</p>
          <p className="font-bold text-gold text-sm">{formatTHB(paid.reduce((s, t) => s + t.cashback_amount, 0))}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeTab === tab
                ? 'bg-gold text-black border-gold'
                : 'bg-yasha-card text-gray-400 border-yasha-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card px-4">
        {loading ? (
          <div className="py-8 text-center text-gray-500 text-sm">Loading...</div>
        ) : shown.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">No {activeTab.toLowerCase()} transactions</p>
          </div>
        ) : (
          shown.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TransactionItem tx={tx} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

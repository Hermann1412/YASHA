import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CashbackCard from '../components/cashback/CashbackCard'
import TransactionItem from '../components/cashback/TransactionItem'
import { useCashback } from '../hooks/useCashback'
import { useUserStore } from '../store/userStore'
import { useEffect } from 'react'

const deals = [
  { id: 1, platform: 'shopee', name: 'Flash Sale Today', cashback: '10%', emoji: '🔥' },
  { id: 2, platform: 'lazada', name: 'Electronics', cashback: '8%', emoji: '📱' },
  { id: 3, platform: 'aliexpress', name: 'Fashion', cashback: '12%', emoji: '👗' },
]

export default function Home() {
  const user = useUserStore((s) => s.user)
  const refreshWallet = useUserStore((s) => s.refreshWallet)
  const { transactions, pendingTotal, loading } = useCashback()

  useEffect(() => {
    refreshWallet()
  }, [])

  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'there'
  const recent = transactions.slice(0, 3)

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <h1 className="text-xl font-bold capitalize">{name} 👋</h1>
        </div>
        <Link to="/referral">
          <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-center text-gold font-bold text-sm">
            +10%
          </div>
        </Link>
      </div>

      {/* Cashback Card */}
      <div className="mb-6">
        <CashbackCard />
      </div>

      {/* Pending Alert */}
      {pendingTotal > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-sm font-semibold text-yellow-400">Pending Cashback</p>
            <p className="text-xs text-gray-400">฿{pendingTotal.toFixed(2)} waiting for confirmation</p>
          </div>
        </motion.div>
      )}

      {/* Featured Deals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Featured Deals</h2>
          <Link to="/shop" className="text-gold text-sm font-medium">See all →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {deals.map((deal) => (
            <Link key={deal.id} to={`/shop?platform=${deal.platform}`}>
              <div className="shrink-0 card p-4 w-36 text-center hover:border-gold/40 transition-colors">
                <p className="text-3xl mb-2">{deal.emoji}</p>
                <p className="text-xs font-medium truncate">{deal.name}</p>
                <p className="text-gold font-bold text-sm mt-1">{deal.cashback} CB</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Recent Cashback</h2>
          <Link to="/cashback" className="text-gold text-sm font-medium">View all →</Link>
        </div>
        <div className="card px-4">
          {loading ? (
            <div className="py-6 text-center text-gray-500 text-sm">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">🛍️</p>
              <p className="text-gray-400 text-sm">No transactions yet.</p>
              <Link to="/shop" className="text-gold text-sm font-medium">Start shopping →</Link>
            </div>
          ) : (
            recent.map((tx) => <TransactionItem key={tx.id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  )
}

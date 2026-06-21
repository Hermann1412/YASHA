import { motion } from 'framer-motion'
import { formatTHB } from '../../lib/formatters'
import { useUserStore } from '../../store/userStore'

export default function CashbackCard() {
  const wallet = useUserStore((s) => s.wallet)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden p-6"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2206 50%, #1a1a1a 100%)',
        border: '1px solid rgba(239,159,39,0.3)',
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gold/5 rounded-3xl" />

      <div className="relative">
        <p className="text-gray-400 text-sm mb-1">Available Cashback</p>
        <p className="text-4xl font-bold text-gold mb-4">
          {formatTHB(wallet?.available_balance ?? 0)}
        </p>

        <div className="flex gap-6">
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-lg font-semibold text-yellow-400">
              {formatTHB(wallet?.pending_balance ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-lg font-semibold text-green-400">
              {formatTHB(wallet?.total_earned ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

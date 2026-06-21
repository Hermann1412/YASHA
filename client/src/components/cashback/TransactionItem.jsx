import { formatTHB, formatDate, statusColor, platformColor, platformLabel } from '../../lib/formatters'
import PendingBadge from './PendingBadge'

export default function TransactionItem({ tx }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-yasha-border last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ${platformColor(tx.platform)}`}>
        {platformLabel(tx.platform).slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{platformLabel(tx.platform)} Order</p>
        <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-gold">+{formatTHB(tx.cashback_amount)}</p>
        <PendingBadge status={tx.status} />
      </div>
    </div>
  )
}

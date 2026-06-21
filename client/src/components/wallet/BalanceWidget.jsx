import { formatTHB } from '../../lib/formatters'
import { useUserStore } from '../../store/userStore'
import Button from '../ui/Button'

export default function BalanceWidget({ onWithdraw }) {
  const wallet = useUserStore((s) => s.wallet)

  return (
    <div
      className="rounded-3xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #1c1500 0%, #2d2206 100%)',
        border: '1px solid rgba(239,159,39,0.4)',
      }}
    >
      <p className="text-gray-400 text-sm mb-2">Available to Withdraw</p>
      <p className="text-5xl font-bold text-gold mb-1">
        {formatTHB(wallet?.available_balance ?? 0)}
      </p>
      <p className="text-xs text-gray-500 mb-6">Min. withdrawal: ฿500</p>

      <Button
        onClick={onWithdraw}
        disabled={(wallet?.available_balance ?? 0) < 500}
        className="w-full"
      >
        Withdraw
      </Button>

      <div className="flex justify-around mt-6 pt-4 border-t border-yasha-border">
        <div>
          <p className="text-xs text-gray-500">Pending</p>
          <p className="font-bold text-yellow-400">{formatTHB(wallet?.pending_balance ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Earned</p>
          <p className="font-bold text-green-400">{formatTHB(wallet?.total_earned ?? 0)}</p>
        </div>
      </div>
    </div>
  )
}

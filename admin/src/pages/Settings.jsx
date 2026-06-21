import { useState } from 'react'

export default function Settings() {
  const [cashbackSplit, setCashbackSplit] = useState(50)
  const [minWithdrawal, setMinWithdrawal] = useState(500)
  const [referralPct, setReferralPct] = useState(10)
  const [saved, setSaved] = useState(false)

  function save(e) {
    e.preventDefault()
    // TODO: persist to Supabase settings table
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <form onSubmit={save} className="max-w-lg space-y-6">
        <div className="card p-5">
          <label className="block font-semibold mb-1">Cashback Split to Users (%)</label>
          <p className="text-gray-400 text-sm mb-3">% of affiliate commission paid to users. YASHA keeps the rest.</p>
          <input
            type="number" min={1} max={90} value={cashbackSplit}
            onChange={(e) => setCashbackSplit(e.target.value)}
            className="w-full bg-yasha-black border border-yasha-border rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
          />
        </div>

        <div className="card p-5">
          <label className="block font-semibold mb-1">Minimum Withdrawal (฿)</label>
          <p className="text-gray-400 text-sm mb-3">Users can only withdraw above this amount.</p>
          <input
            type="number" min={1} value={minWithdrawal}
            onChange={(e) => setMinWithdrawal(e.target.value)}
            className="w-full bg-yasha-black border border-yasha-border rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
          />
        </div>

        <div className="card p-5">
          <label className="block font-semibold mb-1">Referral Reward (%)</label>
          <p className="text-gray-400 text-sm mb-3">% of referred user's cashback paid to referrer for 90 days.</p>
          <input
            type="number" min={0} max={50} value={referralPct}
            onChange={(e) => setReferralPct(e.target.value)}
            className="w-full bg-yasha-black border border-yasha-border rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-gold text-black font-bold px-6 py-3 rounded-xl w-full transition-colors hover:bg-yellow-400"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

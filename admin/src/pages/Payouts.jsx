import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function Payouts() {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(null)

  useEffect(() => { fetchPayouts() }, [])

  async function fetchPayouts() {
    setLoading(true)
    const { data } = await axios.get(`${API}/admin/payouts`).catch(() => ({ data: [] }))
    setPayouts(data)
    setLoading(false)
  }

  async function approve(id) {
    setApproving(id)
    await axios.patch(`${API}/admin/payouts/${id}/approve`).catch(() => {})
    setApproving(null)
    fetchPayouts()
  }

  const total = payouts.reduce((s, p) => s + (p.amount ?? 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-gray-400 text-sm">{payouts.length} pending · Total ฿{total.toFixed(2)}</p>
        </div>
        {payouts.length > 0 && (
          <button
            onClick={() => payouts.forEach((p) => approve(p.id))}
            className="bg-gold text-black font-bold px-4 py-2 rounded-lg text-sm"
          >
            Approve All
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-yasha-border">
            <tr className="text-gray-400 text-left">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Payout Email</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : payouts.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No pending payouts 🎉</td></tr>
            ) : payouts.map((p) => (
              <tr key={p.id} className="border-b border-yasha-border last:border-0">
                <td className="px-4 py-3 text-xs text-gray-400">{p.users?.email}</td>
                <td className="px-4 py-3 font-bold text-gold">฿{p.amount?.toFixed(2)}</td>
                <td className="px-4 py-3 capitalize">{p.method}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {p.method === 'payoneer' ? p.users?.payoneer_email : p.users?.wise_email ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(p.requested_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => approve(p.id)}
                    disabled={approving === p.id}
                    className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full hover:bg-green-500/20 transition-colors disabled:opacity-50"
                  >
                    {approving === p.id ? '...' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-green-500/10 text-green-400',
  paid: 'bg-gold/10 text-gold',
  rejected: 'bg-red-500/10 text-red-400',
}

export default function Transactions() {
  const [txs, setTxs] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTxs() }, [filter])

  async function fetchTxs() {
    setLoading(true)
    const { data } = await axios.get(`${API}/admin/transactions`, { params: { status: filter || undefined } })
      .catch(() => ({ data: [] }))
    setTxs(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await axios.patch(`${API}/admin/transactions/${id}`, { status })
    fetchTxs()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="flex gap-2 mb-6">
        {['', 'pending', 'confirmed', 'paid', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-colors ${
              filter === s ? 'bg-gold text-black border-gold' : 'border-yasha-border text-gray-400'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-yasha-border">
            <tr className="text-gray-400 text-left">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Order Value</th>
              <th className="px-4 py-3">Cashback</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : txs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No transactions</td></tr>
            ) : txs.map((tx) => (
              <tr key={tx.id} className="border-b border-yasha-border last:border-0">
                <td className="px-4 py-3 text-xs text-gray-400">{tx.users?.email ?? tx.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3 capitalize">{tx.platform}</td>
                <td className="px-4 py-3">฿{tx.order_value?.toFixed(2)}</td>
                <td className="px-4 py-3 text-gold font-bold">฿{tx.cashback_amount?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[tx.status]}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {tx.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(tx.id, 'confirmed')} className="text-xs text-green-400 hover:underline">Confirm</button>
                      <button onClick={() => updateStatus(tx.id, 'rejected')} className="text-xs text-red-400 hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

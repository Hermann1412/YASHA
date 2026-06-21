import { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function Overview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/admin/stats`).then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const fmt = (n) => `฿${(n ?? 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers?.toLocaleString() ?? '—'} icon="👥" />
        <StatCard label="Gross Revenue" value={fmt(stats?.grossRevenue)} color="text-gold" icon="💰" />
        <StatCard label="Cashback Paid" value={fmt(stats?.cashbackPaid)} color="text-blue-400" icon="💸" />
        <StatCard label="Net Profit" value={fmt(stats?.netProfit)} color="text-green-400" icon="📈" />
      </div>

      <RevenueChart data={[]} />
    </div>
  )
}

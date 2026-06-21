import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function RevenueChart({ data = [] }) {
  const labels = data.map((d) => d.date)
  const gross = data.map((d) => d.gross)
  const cashback = data.map((d) => d.cashback)
  const profit = data.map((d) => d.profit)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Gross Revenue',
        data: gross,
        borderColor: '#EF9F27',
        backgroundColor: 'rgba(239,159,39,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Cashback Paid',
        data: cashback,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.05)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Net Profit',
        data: profit,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74,222,128,0.05)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#9ca3af' } },
    },
    scales: {
      x: { ticks: { color: '#6b7280' }, grid: { color: '#2a2a2a' } },
      y: { ticks: { color: '#6b7280' }, grid: { color: '#2a2a2a' } },
    },
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold mb-4">Revenue Overview</h3>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-500">No data yet</div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  )
}

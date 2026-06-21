import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Overview', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/transactions', label: 'Transactions', icon: '💸' },
  { to: '/affiliates', label: 'Affiliates', icon: '🔗' },
  { to: '/payouts', label: 'Payouts', icon: '💳' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-yasha-dark border-r border-yasha-border flex flex-col">
      <div className="px-6 py-5 border-b border-yasha-border">
        <p className="text-gold font-bold text-xl">YASHA</p>
        <p className="text-gray-500 text-xs">Admin Dashboard</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

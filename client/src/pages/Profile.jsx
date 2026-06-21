import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

const menuItems = [
  { icon: '📨', label: 'Notifications', to: null },
  { icon: '💳', label: 'Payout Accounts', to: null },
  { icon: '🔒', label: 'Security', to: null },
  { icon: '📋', label: 'Terms of Service', to: null },
  { icon: '🛟', label: 'Support', to: null },
]

export default function Profile() {
  const user = useUserStore((s) => s.user)
  const signOut = useUserStore((s) => s.signOut)
  const navigate = useNavigate()

  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User'
  const email = user?.email ?? ''
  const initials = name.slice(0, 2).toUpperCase()

  async function handleSignOut() {
    await signOut()
    navigate('/onboarding')
  }

  return (
    <div className="page">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold text-2xl font-bold">
          {initials}
        </div>
        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="text-gray-400 text-sm">{email}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="card divide-y divide-yasha-border mb-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1 font-medium">{item.label}</span>
            <span className="text-gray-500">›</span>
          </button>
        ))}
      </div>

      {/* App info */}
      <div className="text-center text-gray-600 text-xs mb-6">
        <p>YASHA v1.0.0</p>
        <p>Deliver freedom, one cashback at a time.</p>
      </div>

      <Button variant="danger" onClick={handleSignOut} className="w-full">
        Sign Out
      </Button>
    </div>
  )
}

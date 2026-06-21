const platforms = [
  {
    id: 'shopee',
    name: 'Shopee TH',
    color: 'bg-orange-500',
    commission: '3–12%',
    docs: 'https://affiliate.shopee.co.th',
    status: 'Active',
  },
  {
    id: 'lazada',
    name: 'Lazada TH',
    color: 'bg-blue-600',
    commission: '3–8%',
    docs: 'https://affiliate.lazada.co.th',
    status: 'Active',
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    color: 'bg-red-600',
    commission: '4–12%',
    docs: 'https://portals.aliexpress.com/affiPortal',
    status: 'Active',
  },
]

export default function Affiliates() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Affiliate Programs</h1>
      <p className="text-gray-400 text-sm mb-8">Manage your affiliate platform integrations and commission rates.</p>

      <div className="space-y-4">
        {platforms.map((p) => (
          <div key={p.id} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center text-white font-bold text-sm`}>
              {p.name.slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-bold">{p.name}</p>
              <p className="text-gray-400 text-sm">Commission: {p.commission} · Cashback to user: 50%</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400 font-semibold">{p.status}</span>
          </div>
        ))}
      </div>

      <div className="card p-5 mt-8">
        <h2 className="font-bold mb-3">Commission Split</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gold rounded-full h-4 relative">
            <span className="absolute inset-0 flex items-center justify-center text-black text-xs font-bold">YASHA 50%</span>
          </div>
          <div className="flex-1 bg-blue-600 rounded-full h-4 relative">
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">User 50%</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-3">Configurable in Settings → Cashback Split</p>
      </div>
    </div>
  )
}

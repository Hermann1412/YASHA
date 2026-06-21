const platforms = [
  { value: '', label: 'All', emoji: '🌐' },
  { value: 'shopee', label: 'Shopee', emoji: '🟠' },
  { value: 'lazada', label: 'Lazada', emoji: '🔵' },
  { value: 'aliexpress', label: 'AliExpress', emoji: '🔴' },
]

export default function PlatformFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {platforms.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
            selected === p.value
              ? 'bg-gold text-black border-gold'
              : 'bg-yasha-card text-gray-400 border-yasha-border'
          }`}
        >
          <span>{p.emoji}</span>
          {p.label}
        </button>
      ))}
    </div>
  )
}

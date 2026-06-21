import { motion } from 'framer-motion'
import { formatTHB, platformColor, platformLabel } from '../../lib/formatters'
import { getTrackedLink } from '../../lib/affiliate'
import { useUserStore } from '../../store/userStore'

export default function ProductCard({ product }) {
  const user = useUserStore((s) => s.user)

  async function handleClick() {
    try {
      const url = await getTrackedLink(product.platform, product.id, user.id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(product.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="card overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
    >
      <div className="relative aspect-square bg-yasha-dark">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${platformColor(product.platform)}`}>
          {platformLabel(product.platform)}
        </div>
        <div className="absolute top-2 right-2 bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.cashbackPercent}% CB
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-gold">{formatTHB(product.price)}</p>
          <p className="text-xs text-green-400">+{formatTHB(product.cashbackAmount)}</p>
        </div>
      </div>
    </motion.div>
  )
}

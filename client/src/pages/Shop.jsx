import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PlatformFilter from '../components/shop/PlatformFilter'
import ProductGrid from '../components/shop/ProductGrid'
import { useProducts } from '../hooks/useProducts'

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [platform, setPlatform] = useState(searchParams.get('platform') ?? '')
  const { products, loading, hasMore, loadMore } = useProducts(platform)

  return (
    <div className="page">
      <h1 className="text-2xl font-bold mb-4">Shop & Earn</h1>

      <div className="mb-4">
        <PlatformFilter selected={platform} onChange={setPlatform} />
      </div>

      <ProductGrid products={products} loading={loading} />

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="w-full mt-4 py-3 rounded-xl border border-yasha-border text-gray-400 text-sm hover:border-gold hover:text-gold transition-colors"
        >
          Load More
        </button>
      )}

      {loading && products.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-4">Loading more...</p>
      )}
    </div>
  )
}

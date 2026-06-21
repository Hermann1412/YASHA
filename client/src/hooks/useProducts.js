import { useState, useEffect } from 'react'
import { getProducts } from '../lib/affiliate'

export function useProducts(platform = '') {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
    load(1, platform)
  }, [platform])

  async function load(p, plat) {
    setLoading(true)
    try {
      const data = await getProducts({ platform: plat, page: p })
      setProducts((prev) => (p === 1 ? data.products : [...prev, ...data.products]))
      setHasMore(data.hasMore)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function loadMore() {
    if (!hasMore || loading) return
    const next = page + 1
    setPage(next)
    load(next, platform)
  }

  return { products, loading, error, hasMore, loadMore }
}

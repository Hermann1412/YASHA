import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'

export function useCashback() {
  const user = useUserStore((s) => s.user)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchTransactions()
  }, [user])

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setTransactions(data ?? [])
    setLoading(false)
  }

  const pending = transactions.filter((t) => t.status === 'pending')
  const confirmed = transactions.filter((t) => t.status === 'confirmed')
  const paid = transactions.filter((t) => t.status === 'paid')

  const pendingTotal = pending.reduce((sum, t) => sum + (t.cashback_amount || 0), 0)

  return { transactions, pending, confirmed, paid, pendingTotal, loading, refetch: fetchTransactions }
}

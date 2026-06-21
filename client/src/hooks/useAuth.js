import { useEffect } from 'react'
import axios from 'axios'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'

const API = import.meta.env.VITE_API_URL

async function syncUser(user) {
  if (!user) return
  try {
    await axios.post(`${API}/auth/sync`, {
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? user.email?.split('@')[0],
    })
  } catch (e) {
    console.warn('[YASHA] auth sync failed:', e.message)
  }
}

export function useAuth() {
  const { user, session, setUser, setSession, refreshWallet } = useUserStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        syncUser(session.user)
        refreshWallet()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        syncUser(session.user)
        refreshWallet()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google' })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password })

  return { user, session, signInWithGoogle, signInWithEmail, signUpWithEmail }
}

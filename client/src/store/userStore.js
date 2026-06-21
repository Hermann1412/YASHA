import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      wallet: null,
      session: null,

      setUser: (user) => set({ user }),
      setWallet: (wallet) => set({ wallet }),
      setSession: (session) => set({ session }),

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, wallet: null, session: null })
      },

      refreshWallet: async () => {
        const user = get().user
        if (!user) return
        const { data } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (data) set({ wallet: data })
      },
    }),
    {
      name: 'yasha-user',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
)

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/userStore'

export default function Referral() {
  const user = useUserStore((s) => s.user)
  const [copied, setCopied] = useState(false)

  const code = user?.user_metadata?.referral_code ?? user?.id?.slice(0, 8).toUpperCase() ?? 'YASHA'
  const shareLink = `https://yasha.app/join?ref=${code}`

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: 'Join YASHA', text: 'Earn cashback every time you shop!', url: shareLink })
    } else {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="page">
      <h1 className="text-2xl font-bold mb-2">Refer & Earn</h1>
      <p className="text-gray-400 text-sm mb-8">
        Earn 10% of every cashback your friend earns — for 90 days.
      </p>

      {/* Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 text-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #1c1500 0%, #2d2206 100%)',
          border: '1px solid rgba(239,159,39,0.4)',
        }}
      >
        <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
        <p className="text-4xl font-bold text-gold tracking-widest mb-4">{code}</p>
        <button
          onClick={copy}
          className="text-sm text-gold border border-gold/40 px-4 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </motion.div>

      {/* How it works */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-4">How It Works</h2>
        <div className="space-y-4">
          {[
            { step: '1', text: 'Share your code with friends in Thailand' },
            { step: '2', text: 'They sign up and start shopping' },
            { step: '3', text: 'You earn 10% of their cashback for 90 days' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gold text-black text-sm font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <p className="text-gray-300 text-sm pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={share}
        className="btn-gold w-full text-center py-4 rounded-2xl text-lg font-bold"
      >
        🔗 Share My Link
      </button>
    </div>
  )
}

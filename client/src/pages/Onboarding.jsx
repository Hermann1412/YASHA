import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

const steps = [
  {
    emoji: '🛍️',
    title: 'Shop on Shopee, Lazada & AliExpress',
    desc: 'Browse products directly inside YASHA and buy from your favourite platforms.',
  },
  {
    emoji: '💰',
    title: 'Earn Real Cashback',
    desc: 'Every purchase earns you 50% of the affiliate commission — real money, not points.',
  },
  {
    emoji: '👛',
    title: 'Withdraw Anytime',
    desc: 'Transfer your cashback straight to your Payoneer or Wise account.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('tour') // 'tour' | 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

  async function handleGoogle() {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleEmailAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fn = mode === 'signup' ? signUpWithEmail : signInWithEmail
    const { error } = await fn(email, password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  if (mode !== 'tour') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-yasha-black">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <button onClick={() => setMode('tour')} className="text-gray-400 mb-8 flex items-center gap-1 text-sm">
            ← Back
          </button>

          <h2 className="text-2xl font-bold mb-2">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {mode === 'signup' ? 'Start earning cashback today.' : 'Sign in to your YASHA account.'}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-yasha-card border border-yasha-border rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            />
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={6}
                className="w-full bg-yasha-card border border-yasha-border rounded-xl px-4 py-3 pr-12 text-white focus:border-gold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="my-4 text-center text-gray-500 text-sm">or</div>
          <Button variant="ghost" onClick={handleGoogle} disabled={loading} className="w-full">
            Continue with Google
          </Button>

          <p className="text-center text-gray-500 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-gold font-semibold">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-yasha-black">
      {/* Logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-7xl mb-6"
        >
          💎
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gold mb-2"
        >
          YASHA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm mb-12"
        >
          Shop & Earn Real Cashback
        </motion.p>

        {/* Tour Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="card p-6 w-full text-center mb-6"
          >
            <p className="text-5xl mb-4">{steps[step].emoji}</p>
            <h3 className="text-lg font-bold mb-2">{steps[step].title}</h3>
            <p className="text-gray-400 text-sm">{steps[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${i === step ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-yasha-border'}`}
            />
          ))}
        </div>

        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} className="w-full mb-3">
            Next
          </Button>
        ) : (
          <>
            <Button onClick={() => setMode('signup')} className="w-full mb-3">
              Get Started — It's Free
            </Button>
            <Button variant="ghost" onClick={() => setMode('login')} className="w-full">
              I Already Have an Account
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

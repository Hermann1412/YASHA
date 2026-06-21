export default function Button({ children, variant = 'gold', className = '', ...props }) {
  const base = 'font-bold rounded-xl px-6 py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    gold: 'bg-gold text-black hover:bg-gold-dark',
    ghost: 'bg-yasha-card text-white border border-yasha-border hover:border-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gold text-gold hover:bg-gold hover:text-black',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

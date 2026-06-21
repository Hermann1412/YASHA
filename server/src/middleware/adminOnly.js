const { getSupabase } = require('../db/supabase')

async function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })

  const { data, error } = await getSupabase()
    .from('users')
    .select('role')
    .eq('id', req.user.id)
    .single()

  if (error || data?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }

  next()
}

module.exports = adminOnly

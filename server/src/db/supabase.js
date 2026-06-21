const { createClient } = require('@supabase/supabase-js')
const WebSocket = require('ws')

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || url.includes('xxxx')) {
  console.warn('[YASHA] Warning: SUPABASE_URL not set — DB calls will fail. Copy .env.example to .env and fill in your keys.')
}

const supabase = url && key && !url.includes('xxxx')
  ? createClient(url, key, {
      realtime: { transport: WebSocket },
    })
  : null

function getSupabase() {
  if (!supabase) throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in server/.env')
  return supabase
}

module.exports = { supabase, getSupabase }

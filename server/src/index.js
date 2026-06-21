const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const cashbackRoutes = require('./routes/cashback')
const walletRoutes = require('./routes/wallet')
const referralRoutes = require('./routes/referral')
const adminRoutes = require('./routes/admin')

require('./jobs/confirmCashback')
require('./jobs/processPayouts')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL ?? '*' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'YASHA API' }))

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cashback', cashbackRoutes)
app.use('/wallet', walletRoutes)
app.use('/referral', referralRoutes)
app.use('/admin', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' })
})

const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => console.log(`YASHA server running on port ${PORT}`))

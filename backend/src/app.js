const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')    // ← ye hai?

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)                   // ← ye hai?

app.get('/', (req, res) => {
    res.json({ message: 'ShopEase API is running!' })
})

module.exports = app
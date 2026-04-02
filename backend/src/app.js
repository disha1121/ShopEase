const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')  // ← ADD THIS

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'ShopEase API is running!' })
})

module.exports = app
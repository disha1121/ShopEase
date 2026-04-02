const express = require('express')
const router = express.Router()
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

// Customer routes
router.post('/', protect, placeOrder)
router.get('/my-orders', protect, getMyOrders)

// Admin routes
router.get('/all', protect, adminOnly, getAllOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

module.exports = router
const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProduct,
    addProduct,
    approveProduct,
    deleteProduct
} = require('../controllers/productController')
const { protect, adminOnly, sellerOnly } = require('../middleware/auth')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProduct)

// Seller routes
router.post('/', protect, sellerOnly, addProduct)

// Admin routes
router.put('/:id/approve', protect, adminOnly, approveProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router
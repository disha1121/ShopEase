const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProduct,
    addProduct,
    approveProduct,
    deleteProduct,
    getAllProductsAdmin
} = require('../controllers/productController')
const { protect, adminOnly, sellerOnly } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProduct)

// Seller routes
router.post('/', protect, sellerOnly, upload.single('image'), addProduct)

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin)
router.put('/:id/approve', protect, adminOnly, approveProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router
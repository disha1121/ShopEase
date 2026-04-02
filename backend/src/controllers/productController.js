const Product = require('../models/Product')

// Get all approved products (customer)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isApproved: true })
            .populate('seller', 'name email')
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email')
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Add product (seller only)
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            seller: req.user.id
        })
        res.status(201).json({ message: 'Product added, pending approval', product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Approve product (admin only)
const approveProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        )
        res.json({ message: 'Product approved', product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete product (admin only)
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: 'Product deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getProducts, getProduct, addProduct, approveProduct, deleteProduct }
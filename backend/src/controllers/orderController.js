const Order = require('../models/Order')
const Product = require('../models/Product')

// Place order (customer)
const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body

        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            const product = await Product.findById(item.productId)
            if (!product) {
                return res.status(404).json({ message: `Product not found` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
            }
            totalAmount += product.price * item.quantity
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
            // Reduce stock
            await Product.findByIdAndUpdate(product._id, {
                stock: product.stock - item.quantity
            })
        }

        const order = await Order.create({
            customer: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        })

        res.status(201).json({ message: 'Order placed successfully', order })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get my orders (customer)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('items.product', 'name price')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('items.product', 'name price')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        res.json({ message: 'Order status updated', order })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus }
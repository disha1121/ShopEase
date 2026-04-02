const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: user._id, name: user.name, role: user.role }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, role: user.role }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login }
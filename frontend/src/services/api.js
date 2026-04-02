import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
})

// Har request mein token automatically add hoga
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)

// Products
export const getProducts = () => API.get('/products')
export const addProduct = (data) => API.post('/products', data)
export const approveProduct = (id) => API.put(`/products/${id}/approve`)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Orders
export const placeOrder = (data) => API.post('/orders', data)
export const getMyOrders = () => API.get('/orders/my-orders')
export const getAllOrders = () => API.get('/orders/all')
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })
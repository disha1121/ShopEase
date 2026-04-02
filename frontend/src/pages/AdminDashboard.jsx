import { useState, useEffect } from 'react'
import { getProducts, approveProduct, deleteProduct, getAllOrders, updateOrderStatus } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('products')
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
        fetchOrders()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts()
            setProducts(data)
        } catch (err) { console.log(err) }
    }

    const fetchOrders = async () => {
        try {
            const { data } = await getAllOrders()
            setOrders(data)
        } catch (err) { console.log(err) }
    }

    const handleApprove = async (id) => {
        try {
            await approveProduct(id)
            fetchProducts()
        } catch (err) { console.log(err) }
    }

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id)
            fetchProducts()
        } catch (err) { console.log(err) }
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateOrderStatus(id, status)
            fetchOrders()
        } catch (err) { console.log(err) }
    }

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>👑 Admin Dashboard</h1>
                <div>
                    <span style={styles.welcome}>Hi, {user?.name}!</span>
                    <button onClick={() => { logoutUser(); navigate('/login') }} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.main}>
                <div style={styles.tabs}>
                    <button style={activeTab === 'products' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('products')}>Products</button>
                    <button style={activeTab === 'orders' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('orders')}>Orders</button>
                </div>

                {activeTab === 'products' && (
                    <div>
                        <h2>All Products</h2>
                        {products.map(p => (
                            <div key={p._id} style={styles.card}>
                                <div>
                                    <h3>{p.name}</h3>
                                    <p>₹{p.price} | {p.category} | Stock: {p.stock}</p>
                                    <p>Seller: {p.seller?.name}</p>
                                    <p style={{color: p.isApproved ? 'green' : 'orange'}}>
                                        {p.isApproved ? '✅ Approved' : '⏳ Pending'}
                                    </p>
                                </div>
                                <div>
                                    {!p.isApproved && (
                                        <button style={styles.approveBtn} onClick={() => handleApprove(p._id)}>Approve</button>
                                    )}
                                    <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2>All Orders</h2>
                        {orders.map(o => (
                            <div key={o._id} style={styles.card}>
                                <div>
                                    <p><strong>Customer:</strong> {o.customer?.name}</p>
                                    <p><strong>Total:</strong> ₹{o.totalAmount}</p>
                                    <p><strong>Items:</strong> {o.items.length}</p>
                                    <p><strong>Status:</strong> {o.status}</p>
                                </div>
                                <select
                                    style={styles.select}
                                    value={o.status}
                                    onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight:'100vh', background:'#f0f2f5' },
    nav: { background:'#7c3aed', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    logo: { color:'white', margin:0 },
    welcome: { color:'white', marginRight:'1rem' },
    logoutBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    main: { padding:'2rem' },
    tabs: { marginBottom:'1.5rem' },
    tab: { padding:'0.75rem 1.5rem', marginRight:'0.5rem', background:'white', border:'1px solid #ddd', borderRadius:'5px', cursor:'pointer' },
    activeTab: { padding:'0.75rem 1.5rem', marginRight:'0.5rem', background:'#7c3aed', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    card: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    approveBtn: { padding:'0.5rem 1rem', background:'#059669', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', marginRight:'0.5rem' },
    deleteBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    select: { padding:'0.5rem', borderRadius:'5px', border:'1px solid #ddd' }
}

export default AdminDashboard
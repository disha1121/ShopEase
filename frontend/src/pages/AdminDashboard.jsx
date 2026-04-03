import { useState, useEffect } from 'react'
import { getAdminProducts, approveProduct, deleteProduct, getAllOrders, updateOrderStatus } from '../services/api'
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
            const { data } = await getAdminProducts()
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
                    <button style={activeTab === 'products' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('products')}>
                        Products ({products.length})
                    </button>
                    <button style={activeTab === 'orders' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('orders')}>
                        Orders ({orders.length})
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div>
                        <h2>All Products</h2>
                        {products.map(p => (
                            <div key={p._id} style={styles.card}>
                                <div style={styles.cardLeft}>
                                    {p.images?.[0] && (
                                        <img src={p.images[0]} alt={p.name} style={styles.productImg} />
                                    )}
                                    <div>
                                        <h3 style={{margin:'0 0 0.5rem'}}>{p.name}</h3>
                                        <p style={{margin:'0', color:'#666'}}>₹{p.price} | {p.category} | Stock: {p.stock}</p>
                                        <p style={{margin:'0.25rem 0', color:'#888'}}>Seller: {p.seller?.name}</p>
                                        <p style={{margin:'0', color: p.isApproved ? 'green' : 'orange'}}>
                                            {p.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                                        </p>
                                    </div>
                                </div>
                                <div style={styles.cardRight}>
                                    {!p.isApproved && (
                                        <button style={styles.approveBtn} onClick={() => handleApprove(p._id)}>
                                            Approve
                                        </button>
                                    )}
                                    <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2>All Orders</h2>
                        {orders.length === 0 ? <p>No orders yet!</p> : orders.map(o => (
                            <div key={o._id} style={styles.card}>
                                <div>
                                    <p style={{margin:'0 0 0.25rem'}}><strong>Customer:</strong> {o.customer?.name}</p>
                                    <p style={{margin:'0 0 0.25rem'}}><strong>Total:</strong> ₹{o.totalAmount}</p>
                                    <p style={{margin:'0 0 0.25rem'}}><strong>Items:</strong> {o.items.length}</p>
                                    <p style={{margin:'0'}}><strong>Address:</strong> {o.shippingAddress?.city}, {o.shippingAddress?.state}</p>
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
    tabs: { marginBottom:'1.5rem', display:'flex', gap:'0.5rem' },
    tab: { padding:'0.75rem 1.5rem', background:'white', border:'1px solid #ddd', borderRadius:'5px', cursor:'pointer', fontSize:'1rem' },
    activeTab: { padding:'0.75rem 1.5rem', background:'#7c3aed', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'1rem' },
    card: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    cardLeft: { display:'flex', gap:'1rem', alignItems:'center' },
    cardRight: { display:'flex', gap:'0.5rem' },
    productImg: { width:'80px', height:'80px', objectFit:'cover', borderRadius:'8px' },
    approveBtn: { padding:'0.5rem 1rem', background:'#059669', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    deleteBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    select: { padding:'0.5rem', borderRadius:'5px', border:'1px solid #ddd', fontSize:'0.9rem' }
}

export default AdminDashboard
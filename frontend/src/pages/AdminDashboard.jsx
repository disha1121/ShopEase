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
        const { data } = await getAdminProducts()
        setProducts(data)
    }

    const fetchOrders = async () => {
        const { data } = await getAllOrders()
        setOrders(data)
    }

    const handleApprove = async (id) => {
        await approveProduct(id)
        fetchProducts()
    }

    const handleDelete = async (id) => {
        await deleteProduct(id)
        fetchProducts()
    }

    const handleStatusUpdate = async (id, status) => {
        await updateOrderStatus(id, status)
        fetchOrders()
    }

    return (
        <div style={styles.container}>

            {/* NAV */}
            <div style={styles.nav}>
                <h1 style={styles.logo}>Admin Panel</h1>

                <div style={styles.navRight}>
                    <span style={styles.user}>Hi, {user?.name}</span>
                    <button onClick={() => { logoutUser(); navigate('/login') }} style={styles.logout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div style={styles.tabs}>
                <button
                    style={activeTab === 'products' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('products')}
                >
                    Products ({products.length})
                </button>

                <button
                    style={activeTab === 'orders' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders ({orders.length})
                </button>
            </div>

            {/* PRODUCTS */}
            {activeTab === 'products' && (
                <div style={styles.grid}>
                    {products.map(p => (
                        <div
                            key={p._id}
                            style={styles.card}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)'
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <img src={p.images?.[0]} style={styles.img} />

                            <h3 style={styles.title}>{p.name}</h3>

                            <p style={styles.price}>₹{p.price}</p>

                            <p style={styles.meta}>
                                {p.category} • Stock: {p.stock}
                            </p>

                            <p style={styles.seller}>{p.seller?.name}</p>

                            <div style={styles.bottom}>
                                <span style={{
                                    color: p.isApproved ? '#22c55e' : '#f59e0b',
                                    fontWeight: 600
                                }}>
                                    {p.isApproved ? 'Approved' : 'Pending'}
                                </span>

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

            {/* ORDERS */}
            {activeTab === 'orders' && (
                <div style={styles.orderWrap}>
                    {orders.map(o => (
                        <div
                            key={o._id}
                            style={styles.orderCard}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)'
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <div>
                                <p style={styles.orderName}>{o.customer?.name}</p>
                                <p style={styles.orderAmount}>₹{o.totalAmount}</p>
                                <p style={styles.orderMeta}>{o.items.length} items</p>
                                <p style={styles.orderMeta}>{o.shippingAddress?.city}</p>
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
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ---------- STYLES ---------- */

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #020617)',
        color: 'white',
        padding: '20px'
    },

    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
    },

    logo: {
        fontSize: '1.5rem',
        fontWeight: '700'
    },

    navRight: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },

    user: { opacity: 0.7 },

    logout: {
        background: '#ef4444',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer'
    },

    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },

    tab: {
        padding: '8px 16px',
        background: '#1e293b',
        borderRadius: '20px',
        border: '1px solid #334155',
        cursor: 'pointer',
        color: '#cbd5f5'
    },

    activeTab: {
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        color: 'white'
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
    },

    card: {
        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
        padding: '15px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: '0.3s'
    },

    img: {
        width: '100%',
        height: '180px',
        objectFit: 'contain',   // ✅ FIXED IMAGE CUTTING
        borderRadius: '12px',
        background: '#020617'
    },

    title: { margin: '10px 0 5px' },

    price: { fontWeight: '700' },

    meta: {
        fontSize: '0.85rem',
        color: '#94a3b8'
    },

    seller: {
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: '10px'
    },

    bottom: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },

    approveBtn: {
        background: '#22c55e',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer'
    },

    deleteBtn: {
        background: '#ef4444',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer'
    },

    orderWrap: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },

    orderCard: {
        background: 'linear-gradient(145deg, #020617, #1e293b)',
        padding: '16px',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: '0.3s',
        position: 'relative',
        zIndex: 1   // ✅ FIX overlap issue
    },

    orderName: {
        fontWeight: '600',
        marginBottom: '4px'
    },

    orderAmount: {
        fontWeight: '700',
        marginBottom: '4px'
    },

    orderMeta: {
        fontSize: '0.85rem',
        color: '#94a3b8'
    },

    select: {
        background: '#020617',
        color: 'white',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '6px 10px',
        cursor: 'pointer'
    }
}

export default AdminDashboard
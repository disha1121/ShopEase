import { useState, useEffect } from 'react'
import { getMyOrders } from '../services/api'
import { useNavigate } from 'react-router-dom'

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
)

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await getMyOrders()
                setOrders(data)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const getStatusColor = (status) => {
        const colors = {
            pending:    { bg:'rgba(234,179,8,0.15)',   border:'rgba(234,179,8,0.3)',   color:'#fde047' },
            processing: { bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  color:'#93c5fd' },
            shipped:    { bg:'rgba(168,85,247,0.15)',  border:'rgba(168,85,247,0.3)',  color:'#d8b4fe' },
            delivered:  { bg:'rgba(34,197,94,0.15)',   border:'rgba(34,197,94,0.3)',   color:'#86efac' },
            cancelled:  { bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   color:'#fca5a5' },
        }
        return colors[status] || colors.pending
    }

    const getStatusEmoji = (status) => {
        const emojis = {
            pending:'⏳', processing:'⚙️', shipped:'🚚', delivered:'✅', cancelled:'❌'
        }
        return emojis[status] || '⏳'
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
                * { margin:0; padding:0; box-sizing:border-box; }
                body, #root { width:100vw; min-height:100vh; overflow-x:hidden; }
                .mo-wrap {
                    min-height:100vh; background:#0f0c1a;
                    font-family:'Inter',sans-serif; color:white;
                }
                .mo-nav {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:1rem 2rem;
                    background:rgba(15,12,26,0.95);
                    border-bottom:1px solid rgba(255,255,255,0.06);
                    backdrop-filter:blur(20px);
                    position:sticky; top:0; z-index:100;
                }
                .mo-logo {
                    font-family:'Playfair Display',serif;
                    font-size:1.4rem; font-weight:800;
                    background:linear-gradient(135deg,#ff9de2,#ffffff,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                }
                .back-btn {
                    display:flex; align-items:center; gap:0.4rem;
                    padding:0.5rem 1rem;
                    background:rgba(255,255,255,0.06);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:8px; color:rgba(255,255,255,0.7);
                    font-size:0.85rem; font-weight:600;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .back-btn:hover { background:rgba(255,255,255,0.12); color:white; }
                .mo-main { padding:2rem; max-width:900px; margin:0 auto; }
                .mo-header { margin-bottom:1.5rem; }
                .mo-title {
                    font-family:'Playfair Display',serif;
                    font-size:2rem; font-weight:800; color:white;
                    margin-bottom:0.3rem;
                }
                .mo-sub { color:rgba(255,255,255,0.4); font-size:0.9rem; }
                .order-card {
                    background:#1a1625;
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:16px; padding:1.5rem;
                    margin-bottom:1rem; transition:all 0.3s;
                }
                .order-card:hover {
                    border-color:rgba(255,78,205,0.3);
                    box-shadow:0 8px 30px rgba(0,0,0,0.3);
                }
                .order-top {
                    display:flex; justify-content:space-between;
                    align-items:center; margin-bottom:1rem;
                }
                .order-id {
                    font-size:0.78rem; color:rgba(255,255,255,0.3);
                    font-family:'monospace';
                }
                .status-badge {
                    display:flex; align-items:center; gap:0.4rem;
                    padding:0.3rem 0.9rem; border-radius:50px;
                    font-size:0.78rem; font-weight:700;
                    text-transform:capitalize;
                }
                .order-items {
                    display:flex; flex-wrap:wrap; gap:0.5rem;
                    margin-bottom:1rem;
                }
                .order-item {
                    display:flex; align-items:center; gap:0.5rem;
                    background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    padding:0.4rem 0.8rem; border-radius:8px;
                    font-size:0.82rem; color:rgba(255,255,255,0.7);
                }
                .order-bottom {
                    display:flex; justify-content:space-between;
                    align-items:center;
                    padding-top:1rem;
                    border-top:1px solid rgba(255,255,255,0.06);
                }
                .order-addr {
                    font-size:0.8rem; color:rgba(255,255,255,0.35);
                    display:flex; align-items:center; gap:0.4rem;
                }
                .order-total {
                    font-size:1.2rem; font-weight:800;
                    background:linear-gradient(135deg,#ff9de2,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                }
                .order-date {
                    font-size:0.75rem; color:rgba(255,255,255,0.25);
                    margin-top:0.25rem;
                }
                .empty-state {
                    text-align:center; padding:5rem 2rem;
                    color:rgba(255,255,255,0.3);
                }
                .empty-icon { font-size:4rem; margin-bottom:1rem; }
                .empty-text { font-size:1rem; margin-bottom:1.5rem; }
                .shop-btn {
                    padding:0.75rem 2rem;
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border:none; border-radius:10px;
                    font-size:0.9rem; font-weight:700; cursor:pointer;
                    font-family:'Inter',sans-serif;
                }
            `}</style>

            <div className="mo-wrap">
                <nav className="mo-nav">
                    <div className="mo-logo">🛍️ ShopEase</div>
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <BackIcon/> Back to Shop
                    </button>
                </nav>

                <div className="mo-main">
                    <div className="mo-header">
                        <h1 className="mo-title">My Orders 📦</h1>
                        <p className="mo-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="empty-icon">⏳</div>
                            <p className="empty-text">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🛒</div>
                            <p className="empty-text">No orders yet! Start shopping.</p>
                            <button className="shop-btn" onClick={() => navigate('/')}>
                                Shop Now →
                            </button>
                        </div>
                    ) : (
                        orders.map(order => {
                            const sc = getStatusColor(order.status)
                            return (
                                <div key={order._id} className="order-card">
                                    <div className="order-top">
                                        <div>
                                            <div className="order-id">#{order._id.slice(-8).toUpperCase()}</div>
                                            <div className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day:'numeric', month:'long', year:'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="status-badge" style={{
                                            background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color
                                        }}>
                                            {getStatusEmoji(order.status)} {order.status}
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-item">
                                                🛍️ {item.product?.name || 'Product'} × {item.quantity}
                                                <span style={{color:'rgba(255,255,255,0.4)'}}>
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-bottom">
                                        <div className="order-addr">
                                            📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                                        </div>
                                        <div className="order-total">₹{order.totalAmount}</div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    )
}

export default MyOrders
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts, placeOrder } from '../services/api'

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
)
const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
)
const CityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
)
const MapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
)
const PinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
)

const Checkout = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [address, setAddress] = useState({ street:'', city:'', state:'', pincode:'' })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await getProducts()
                const found = data.find(p => p._id === id)
                setProduct(found)
            } catch (err) { console.log(err) }
        }
        fetchProduct()
    }, [id])

    const handleOrder = async () => {
        if (!address.street || !address.city || !address.state || !address.pincode) {
            setMessage('error:Please fill all address fields!')
            return
        }
        setLoading(true)
        try {
            await placeOrder({
                items: [{ productId: id, quantity }],
                shippingAddress: address
            })
            setMessage('success:Order placed successfully! Redirecting...')
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setMessage('error:' + (err.response?.data?.message || 'Order failed'))
        } finally {
            setLoading(false)
        }
    }

    if (!product) return (
        <div style={{
            minHeight:'100vh', background:'#0f0c1a',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'rgba(255,255,255,0.5)', fontFamily:'Inter,sans-serif'
        }}>⏳ Loading...</div>
    )

    const isSuccess = message.startsWith('success:')
    const isError = message.startsWith('error:')
    const msgText = message.replace(/^(success|error):/, '')

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
                * { margin:0; padding:0; box-sizing:border-box; }
                body, #root { width:100vw; min-height:100vh; overflow-x:hidden; }

                .co-wrap {
                    min-height:100vh;
                    background:#0f0c1a;
                    font-family:'Inter',sans-serif;
                    color:white;
                }
                .co-nav {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:1rem 2rem;
                    background:rgba(15,12,26,0.95);
                    border-bottom:1px solid rgba(255,255,255,0.06);
                    backdrop-filter:blur(20px);
                    position:sticky; top:0; z-index:100;
                }
                .co-logo {
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

                .co-main {
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:1.5rem;
                    padding:2rem;
                    max-width:1000px; margin:0 auto;
                }

                .co-card {
                    background:#1a1625;
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:20px; overflow:hidden;
                }

                /* Product card */
                .prod-img-wrap {
                    width:100%; height:260px;
                    background:white;
                    display:flex; align-items:center; justify-content:center;
                }
                .prod-img {
                    width:100%; height:100%;
                    object-fit:contain; padding:12px;
                }
                .prod-body { padding:1.5rem; text-align:center; }
                .prod-cat {
                    display:inline-block;
                    background:rgba(255,78,205,0.15);
                    border:1px solid rgba(255,78,205,0.25);
                    color:#ff9de2; padding:0.2rem 0.8rem;
                    border-radius:50px; font-size:0.72rem;
                    font-weight:600; margin-bottom:0.6rem;
                    text-transform:capitalize;
                }
                .prod-name {
                    font-size:1.2rem; font-weight:700;
                    color:white; margin-bottom:0.4rem;
                }
                .prod-desc {
                    font-size:0.82rem; color:rgba(255,255,255,0.4);
                    margin-bottom:1rem; line-height:1.5;
                }
                .prod-price {
                    font-size:2rem; font-weight:800;
                    background:linear-gradient(135deg,#ff9de2,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                    margin-bottom:1.2rem;
                }
                .qty-row {
                    display:flex; align-items:center;
                    justify-content:center; gap:1rem;
                    margin-bottom:1rem;
                }
                .qty-label { font-size:0.85rem; color:rgba(255,255,255,0.5); }
                .qty-btn {
                    width:36px; height:36px;
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border:none; border-radius:8px;
                    font-size:1.2rem; cursor:pointer;
                    display:flex; align-items:center; justify-content:center;
                    transition:all 0.2s;
                }
                .qty-btn:hover { transform:scale(1.1); }
                .qty-num {
                    font-size:1.3rem; font-weight:800;
                    color:white; min-width:35px; text-align:center;
                }
                .prod-total {
                    font-size:1rem; color:rgba(255,255,255,0.5);
                }
                .prod-total span {
                    background:linear-gradient(135deg,#ff9de2,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                    font-weight:800;
                }

                /* Address card */
                .addr-body { padding:1.5rem; }
                .addr-title {
                    font-size:1.1rem; font-weight:700;
                    color:white; margin-bottom:1.2rem;
                    display:flex; align-items:center; gap:0.5rem;
                }
                .msg-box {
                    padding:0.75rem 1rem; border-radius:10px;
                    margin-bottom:1rem; font-size:0.88rem;
                    display:flex; align-items:center; gap:0.5rem;
                }
                .msg-success {
                    background:rgba(34,197,94,0.15);
                    border:1px solid rgba(34,197,94,0.3);
                    color:#86efac;
                }
                .msg-error {
                    background:rgba(239,68,68,0.15);
                    border:1px solid rgba(239,68,68,0.3);
                    color:#fca5a5;
                }
                .input-wrap { position:relative; margin-bottom:1rem; }
                .input-icon {
                    position:absolute; left:0.85rem; top:50%;
                    transform:translateY(-50%);
                }
                .addr-input {
                    width:100%;
                    padding:0.85rem 1rem 0.85rem 2.6rem;
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:12px; color:white;
                    font-size:0.9rem; outline:none;
                    font-family:'Inter',sans-serif;
                    transition:all 0.2s;
                }
                .addr-input::placeholder { color:rgba(255,255,255,0.25); }
                .addr-input:focus {
                    border-color:rgba(255,78,205,0.5);
                    background:rgba(255,255,255,0.08);
                    box-shadow:0 0 0 3px rgba(255,78,205,0.1);
                }
                .order-btn {
                    width:100%; padding:1rem;
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border:none; border-radius:12px;
                    font-size:1rem; font-weight:700; cursor:pointer;
                    transition:all 0.3s; font-family:'Inter',sans-serif;
                    box-shadow:0 4px 20px rgba(255,78,205,0.3);
                    margin-top:0.5rem;
                }
                .order-btn:hover:not(:disabled) {
                    transform:translateY(-2px);
                    box-shadow:0 8px 25px rgba(255,78,205,0.5);
                }
                .order-btn:disabled {
                    background:rgba(255,255,255,0.1);
                    color:rgba(255,255,255,0.3);
                    cursor:not-allowed; box-shadow:none;
                }

                /* Summary strip */
                .summary-strip {
                    display:flex; justify-content:space-between;
                    align-items:center;
                    padding:0.75rem 1rem;
                    background:rgba(255,78,205,0.08);
                    border:1px solid rgba(255,78,205,0.15);
                    border-radius:10px; margin-bottom:1rem;
                }
                .summary-label { font-size:0.82rem; color:rgba(255,255,255,0.5); }
                .summary-val {
                    font-size:0.9rem; font-weight:700; color:white;
                }

                @media (max-width:768px) {
                    .co-main { grid-template-columns:1fr; padding:1rem; }
                    .co-nav { padding:0.75rem 1rem; }
                }
            `}</style>

            <div className="co-wrap">
                {/* NAV */}
                <nav className="co-nav">
                    <div className="co-logo">🛍️ ShopEase — Checkout</div>
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <BackIcon/> Back to Shop
                    </button>
                </nav>

                <div className="co-main">
                    {/* PRODUCT CARD */}
                    <div className="co-card">
                        <div className="prod-img-wrap">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="prod-img"/>
                            ) : (
                                <div style={{fontSize:'3rem'}}>📦</div>
                            )}
                        </div>
                        <div className="prod-body">
                            <span className="prod-cat">{product.category}</span>
                            <h2 className="prod-name">{product.name}</h2>
                            <p className="prod-desc">{product.description}</p>
                            <div className="prod-price">₹{product.price}</div>

                            <div className="qty-row">
                                <span className="qty-label">Quantity:</span>
                                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                                <span className="qty-num">{quantity}</span>
                                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q+1))}>+</button>
                            </div>

                            <p className="prod-total">
                                Total: <span>₹{product.price * quantity}</span>
                            </p>
                        </div>
                    </div>

                    {/* ADDRESS CARD */}
                    <div className="co-card">
                        <div className="addr-body">
                            <div className="addr-title">
                                📦 Shipping Address
                            </div>

                            {/* Summary */}
                            <div className="summary-strip">
                                <span className="summary-label">🛒 {product.name} × {quantity}</span>
                                <span className="summary-val">₹{product.price * quantity}</span>
                            </div>

                            {message && (
                                <div className={`msg-box ${isSuccess ? 'msg-success' : 'msg-error'}`}>
                                    {isSuccess ? '✅' : '⚠️'} {msgText}
                                </div>
                            )}

                            <div className="input-wrap">
                                <span className="input-icon"><LocationIcon/></span>
                                <input className="addr-input" placeholder="Street Address"
                                    value={address.street}
                                    onChange={e => setAddress({...address, street:e.target.value})}/>
                            </div>
                            <div className="input-wrap">
                                <span className="input-icon"><CityIcon/></span>
                                <input className="addr-input" placeholder="City"
                                    value={address.city}
                                    onChange={e => setAddress({...address, city:e.target.value})}/>
                            </div>
                            <div className="input-wrap">
                                <span className="input-icon"><MapIcon/></span>
                                <input className="addr-input" placeholder="State"
                                    value={address.state}
                                    onChange={e => setAddress({...address, state:e.target.value})}/>
                            </div>
                            <div className="input-wrap">
                                <span className="input-icon"><PinIcon/></span>
                                <input className="addr-input" placeholder="Pincode"
                                    value={address.pincode}
                                    onChange={e => setAddress({...address, pincode:e.target.value})}/>
                            </div>

                            <button className="order-btn" onClick={handleOrder} disabled={loading}>
                                {loading ? '⏳ Placing Order...' : `🚀 Place Order — ₹${product.price * quantity}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout
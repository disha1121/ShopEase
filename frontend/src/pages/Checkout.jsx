import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts, placeOrder } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [address, setAddress] = useState({ street:'', city:'', state:'', pincode:'' })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
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
            setMessage('❌ Please fill all address fields!')
            return
        }
        setLoading(true)
        try {
            await placeOrder({
                items: [{ productId: id, quantity }],
                shippingAddress: address
            })
            setMessage('✅ Order placed successfully!')
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Order failed'))
        } finally {
            setLoading(false)
        }
    }

    if (!product) return <p style={{textAlign:'center', marginTop:'2rem'}}>Loading...</p>

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>🛒 ShopEase — Checkout</h1>
                <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
            </nav>

            <div style={styles.main}>
                <div style={styles.productCard}>
                    {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} style={styles.image} />
                    )}
                    <h2>{product.name}</h2>
                    <p style={styles.desc}>{product.description}</p>
                    <p style={styles.price}>₹{product.price}</p>
                    <div style={styles.quantityRow}>
                        <label>Quantity:</label>
                        <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                        <span style={styles.qty}>{quantity}</span>
                        <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(product.stock, q+1))}>+</button>
                    </div>
                    <p style={styles.total}>Total: ₹{product.price * quantity}</p>
                </div>

                <div style={styles.addressCard}>
                    <h2>Shipping Address</h2>
                    {message && <p style={message.includes('✅') ? styles.success : styles.error}>{message}</p>}
                    <input style={styles.input} placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                    <input style={styles.input} placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                    <input style={styles.input} placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                    <input style={styles.input} placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                    <button style={styles.orderBtn} onClick={handleOrder} disabled={loading}>
                        {loading ? 'Placing Order...' : `Place Order — ₹${product.price * quantity}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight:'100vh', background:'#f0f2f5' },
    nav: { background:'#4f46e5', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    logo: { color:'white', margin:0, fontSize:'1.2rem' },
    backBtn: { padding:'0.5rem 1rem', background:'white', color:'#4f46e5', border:'none', borderRadius:'5px', cursor:'pointer' },
    main: { padding:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', maxWidth:'900px', margin:'0 auto' },
    productCard: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', textAlign:'center' },
    image: { width:'100%', height:'250px', objectFit:'contain', borderRadius:'8px', marginBottom:'1rem' },
    desc: { color:'#666', fontSize:'0.9rem' },
    price: { fontSize:'1.8rem', fontWeight:'bold', color:'#4f46e5' },
    quantityRow: { display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', margin:'1rem 0' },
    qtyBtn: { width:'35px', height:'35px', background:'#4f46e5', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'1.2rem' },
    qty: { fontSize:'1.2rem', fontWeight:'bold', minWidth:'30px', textAlign:'center' },
    total: { fontSize:'1.3rem', fontWeight:'bold', color:'#059669' },
    addressCard: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
    input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', border:'1px solid #ddd', borderRadius:'5px', fontSize:'1rem', boxSizing:'border-box' },
    orderBtn: { width:'100%', padding:'1rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'1.1rem', cursor:'pointer', fontWeight:'bold' },
    success: { color:'green', background:'#f0fdf4', padding:'0.75rem', borderRadius:'5px', marginBottom:'1rem' },
    error: { color:'red', background:'#fef2f2', padding:'0.75rem', borderRadius:'5px', marginBottom:'1rem' }
}

export default Checkout
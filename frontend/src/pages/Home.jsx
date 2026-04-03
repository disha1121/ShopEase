import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getProducts()
                setProducts(data)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>🛒 ShopEase</h1>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>Hi, {user?.name}!</span>
                    <button onClick={() => navigate('/my-orders')} style={styles.navBtn}>My Orders</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.main}>
                <h2 style={styles.heading}>Featured Products</h2>
                {loading ? (
                    <p style={styles.center}>Loading products...</p>
                ) : products.length === 0 ? (
                    <p style={styles.center}>No products available!</p>
                ) : (
                    <div style={styles.grid}>
                        {products.map(product => (
                            <div key={product._id} style={styles.card}>
                                <div style={styles.imageContainer}>
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <div style={styles.noImage}>📦 No Image</div>
                                    )}
                                </div>
                                <div style={styles.cardBody}>
                                    <span style={styles.category}>{product.category}</span>
                                    <h3 style={styles.productName}>{product.name}</h3>
                                    <p style={styles.desc}>{product.description}</p>
                                    <div style={styles.cardFooter}>
                                        <span style={styles.price}>₹{product.price}</span>
                                        <span style={styles.stock}>Stock: {product.stock}</span>
                                    </div>
                                    <p style={styles.seller}>🏪 {product.seller?.name}</p>
                                    <button
                                        style={styles.buyBtn}
                                        onClick={() => navigate(`/checkout/${product._id}`)}
                                    >
                                        Buy Now
                                    </button>
                                </div>
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
    nav: { background:'#4f46e5', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.2)' },
    logo: { color:'white', margin:0, fontSize:'1.5rem' },
    navRight: { display:'flex', alignItems:'center', gap:'0.75rem' },
    welcome: { color:'white' },
    navBtn: { padding:'0.5rem 1rem', background:'white', color:'#4f46e5', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' },
    logoutBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    main: { padding:'2rem' },
    heading: { fontSize:'1.8rem', marginBottom:'1.5rem', color:'#333' },
    center: { textAlign:'center', fontSize:'1.2rem', color:'#666' },
    grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.5rem' },
    card: { background:'white', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', overflow:'hidden' },
    imageContainer: {
        width:'100%',
        height:'220px',
        overflow:'hidden',
        background:'#f5f5f5',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        width:'100%',
        height:'100%',
        objectFit:'contain',
        padding:'10px',
        boxSizing:'border-box'
    },
    noImage: { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:'#999' },
    cardBody: { padding:'1rem' },
    category: { background:'#ede9fe', color:'#4f46e5', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'bold' },
    productName: { margin:'0.5rem 0', fontSize:'1.1rem', color:'#222' },
    desc: { color:'#666', fontSize:'0.85rem', marginBottom:'0.75rem', lineHeight:'1.4' },
    cardFooter: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' },
    price: { fontSize:'1.4rem', fontWeight:'bold', color:'#4f46e5' },
    stock: { color:'#888', fontSize:'0.8rem' },
    seller: { color:'#888', fontSize:'0.8rem', marginBottom:'0.75rem' },
    buyBtn: { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem' }
}

export default Home
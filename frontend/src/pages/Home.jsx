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
                <div>
                    <span style={styles.welcome}>Hi, {user?.name}!</span>
                    <button onClick={() => navigate('/my-orders')} style={styles.navBtn}>My Orders</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.main}>
                <h2>All Products</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No products available!</p>
                ) : (
                    <div style={styles.grid}>
                        {products.map(product => (
                            <div key={product._id} style={styles.card}>
                                <h3>{product.name}</h3>
                                <p style={styles.desc}>{product.description}</p>
                                <p style={styles.price}>₹{product.price}</p>
                                <p style={styles.stock}>Stock: {product.stock}</p>
                                <p style={styles.seller}>Seller: {product.seller?.name}</p>
                                <button
                                    style={styles.buyBtn}
                                    onClick={() => navigate(`/checkout/${product._id}`)}
                                >
                                    Buy Now
                                </button>
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
    nav: { background:'#4f46e5', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    logo: { color:'white', margin:0 },
    welcome: { color:'white', marginRight:'1rem' },
    navBtn: { padding:'0.5rem 1rem', marginRight:'0.5rem', background:'white', color:'#4f46e5', border:'none', borderRadius:'5px', cursor:'pointer' },
    logoutBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    main: { padding:'2rem' },
    grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'1.5rem', marginTop:'1rem' },
    card: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
    desc: { color:'#666', fontSize:'0.9rem' },
    price: { fontSize:'1.5rem', fontWeight:'bold', color:'#4f46e5' },
    stock: { color:'#888', fontSize:'0.85rem' },
    seller: { color:'#888', fontSize:'0.85rem' },
    buyBtn: { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', marginTop:'0.5rem' }
}

export default Home
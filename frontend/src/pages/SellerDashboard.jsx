import { useState, useEffect } from 'react'
import { addProduct, getProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SellerDashboard = () => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({ name:'', description:'', price:'', category:'', stock:'' })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts()
            const myProducts = data.filter(p => p.seller?._id === user?.id || p.seller === user?.id)
            setProducts(myProducts)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await addProduct(formData)
            setMessage('✅ Product added! Waiting for admin approval.')
            setFormData({ name:'', description:'', price:'', category:'', stock:'' })
            fetchProducts()
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Failed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>🏪 Seller Dashboard</h1>
                <div>
                    <span style={styles.welcome}>Hi, {user?.name}!</span>
                    <button onClick={() => { logoutUser(); navigate('/login') }} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.main}>
                <div style={styles.formSection}>
                    <h2>Add New Product</h2>
                    {message && <p style={styles.message}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input style={styles.input} name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                        <textarea style={styles.input} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                        <input style={styles.input} name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
                        <input style={styles.input} name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                        <input style={styles.input} name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </form>
                </div>

                <div style={styles.productsSection}>
                    <h2>My Products</h2>
                    {products.length === 0 ? <p>No approved products yet!</p> : (
                        products.map(p => (
                            <div key={p._id} style={styles.productCard}>
                                <h3>{p.name}</h3>
                                <p>₹{p.price} | Stock: {p.stock}</p>
                                <p style={{color: p.isApproved ? 'green' : 'orange'}}>
                                    {p.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight:'100vh', background:'#f0f2f5' },
    nav: { background:'#059669', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
    logo: { color:'white', margin:0 },
    welcome: { color:'white', marginRight:'1rem' },
    logoutBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
    main: { padding:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' },
    formSection: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
    productsSection: { background:'white', padding:'1.5rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
    input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', border:'1px solid #ddd', borderRadius:'5px', fontSize:'1rem', boxSizing:'border-box' },
    button: { width:'100%', padding:'0.75rem', background:'#059669', color:'white', border:'none', borderRadius:'5px', fontSize:'1rem', cursor:'pointer' },
    message: { padding:'0.75rem', background:'#f0fdf4', borderRadius:'5px', marginBottom:'1rem' },
    productCard: { padding:'1rem', border:'1px solid #ddd', borderRadius:'5px', marginBottom:'1rem' }
}

export default SellerDashboard
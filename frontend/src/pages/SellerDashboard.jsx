import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SellerDashboard = () => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({ name:'', description:'', price:'', category:'', stock:'' })
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { fetchProducts() }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts()
            setProducts(data)
        } catch (err) { console.log(err) }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const form = new FormData()
            form.append('name', formData.name)
            form.append('description', formData.description)
            form.append('price', formData.price)
            form.append('category', formData.category)
            form.append('stock', formData.stock)
            if (image) form.append('image', image)

            await axios.post('http://localhost:5000/api/products', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            setMessage('✅ Product added! Waiting for admin approval.')
            setFormData({ name:'', description:'', price:'', category:'', stock:'' })
            setImage(null)
            setPreview('')
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

                        <label style={styles.imageLabel}>Product Image:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{marginBottom:'1rem'}} />
                        {preview && <img src={preview} alt="preview" style={styles.preview} />}

                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </form>
                </div>

                <div style={styles.productsSection}>
                    <h2>All Products</h2>
                    {products.map(p => (
                        <div key={p._id} style={styles.productCard}>
                            {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={styles.productImg} />}
                            <div>
                                <h3>{p.name}</h3>
                                <p>₹{p.price} | Stock: {p.stock}</p>
                                <p style={{color: p.isApproved ? 'green' : 'orange'}}>
                                    {p.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                                </p>
                            </div>
                        </div>
                    ))}
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
    productCard: { display:'flex', gap:'1rem', padding:'1rem', border:'1px solid #ddd', borderRadius:'5px', marginBottom:'1rem', alignItems:'center' },
    productImg: { width:'80px', height:'80px', objectFit:'cover', borderRadius:'5px' },
    preview: { width:'100%', height:'200px', objectFit:'cover', borderRadius:'5px', marginBottom:'1rem' },
    imageLabel: { display:'block', marginBottom:'0.5rem', fontWeight:'bold' }
}

export default SellerDashboard
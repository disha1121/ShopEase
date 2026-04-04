import { useState, useEffect, useRef } from 'react'
import { getProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SellerDashboard = () => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({ name:'', description:'', price:'', category:'', stock:'' })
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('')
    const [dragging, setDragging] = useState(false)
    const fileRef = useRef()

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { fetchProducts() }, [])

    const fetchProducts = async () => {
        const { data } = await getProducts()
        setProducts(data)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFile = (file) => {
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setImage(null)
        setPreview('')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const form = new FormData()
            Object.keys(formData).forEach(key => form.append(key, formData[key]))
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

    // ✅ DELETE FUNCTION
    const handleDeleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchProducts()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div style={styles.container}>

            {/* NAV */}
            <div style={styles.nav}>
                <h1 style={styles.logo}>Seller Panel</h1>
                <div style={styles.navRight}>
                    <span style={styles.user}>Hi, {user?.name}</span>
                    <button onClick={() => { logoutUser(); navigate('/login') }} style={styles.logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.main}>

                {/* FORM */}
                <div style={styles.formSection}>
                    <h2 style={styles.heading}>Add Product</h2>

                    {message && <p style={styles.message}>{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <input style={styles.input} name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                        <textarea style={styles.input} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                        <input style={styles.input} name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
                        <input style={styles.input} name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                        <input style={styles.input} name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />

                        {/* UPLOAD */}
                        <div
                            style={{
                                ...styles.uploadBox,
                                border: dragging ? '2px dashed #ec4899' : '2px dashed #334155'
                            }}
                            onClick={() => fileRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            {!preview ? (
                                <div style={{textAlign:'center'}}>
                                    <p style={{marginBottom:'6px'}}>📂 Drag & Drop Image</p>
                                    <p style={{fontSize:'0.8rem', opacity:0.6}}>or click to upload</p>
                                </div>
                            ) : (
                                <div style={{textAlign:'center', position:'relative'}}>
                                    <img src={preview} style={styles.preview}/>
                                    
                                    {/* ✅ REMOVE IMAGE BUTTON */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveImage()
                                        }}
                                        style={styles.removeImg}
                                    >
                                        ✕
                                    </button>

                                    <p style={{fontSize:'0.75rem', marginTop:'6px'}}>Click to change</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileRef}
                            style={{display:'none'}}
                            accept="image/*"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />

                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </form>
                </div>

                {/* PRODUCTS */}
                <div style={styles.productsSection}>
                    <h2 style={styles.heading}>Your Products</h2>

                    <div style={styles.grid}>
                        {products.map(p => (
                            <div
                                key={p._id}
                                style={styles.card}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0px)'}
                            >
                                <img src={p.images?.[0]} style={styles.img} />
                                <h3>{p.name}</h3>
                                <p>₹{p.price}</p>
                                <p style={{fontSize:'0.8rem', color:'#94a3b8'}}>Stock: {p.stock}</p>

                                <span style={{
                                    color: p.isApproved ? '#22c55e' : '#f59e0b',
                                    fontSize:'0.8rem'
                                }}>
                                    {p.isApproved ? 'Approved' : 'Pending'}
                                </span>

                                {/* ✅ DELETE BUTTON */}
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDeleteProduct(p._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ONLY SMALL ADDITIONS */
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #020617)',
        color: 'white',
        padding: '20px'
    },

    nav: { display:'flex', justifyContent:'space-between', marginBottom:'20px' },
    logo: { fontSize:'1.5rem', fontWeight:'700' },
    navRight: { display:'flex', gap:'10px', alignItems:'center' },
    user: { opacity:0.7 },
    logout: {
        background:'#ef4444',
        border:'none',
        padding:'6px 12px',
        borderRadius:'8px',
        color:'white',
        cursor:'pointer'
    },

    main: {
        display:'grid',
        gridTemplateColumns:'1fr 1.2fr',
        gap:'20px'
    },

    formSection: {
        background:'linear-gradient(145deg, #020617, #1e293b)',
        padding:'20px',
        borderRadius:'16px'
    },

    productsSection: {
        background:'linear-gradient(145deg, #020617, #1e293b)',
        padding:'20px',
        borderRadius:'16px'
    },

    heading: { marginBottom:'15px' },

    input: {
        width:'100%',
        padding:'10px',
        marginBottom:'10px',
        borderRadius:'10px',
        border:'1px solid #334155',
        background:'#020617',
        color:'white'
    },

    uploadBox: {
        height:'160px',
        borderRadius:'12px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:'10px',
        cursor:'pointer',
        background:'#020617'
    },

    preview: {
        height:'120px',
        objectFit:'contain'
    },

    button: {
        width:'100%',
        padding:'10px',
        borderRadius:'10px',
        border:'none',
        background:'linear-gradient(135deg,#ec4899,#8b5cf6)',
        color:'white',
        cursor:'pointer'
    },

    message: { marginBottom:'10px' },

    grid: {
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
        gap:'15px'
    },

    card: {
        background:'#020617',
        padding:'12px',
        borderRadius:'14px',
        transition:'0.25s',
        position:'relative'
    },

    img: {
        width:'100%',
        height:'140px',
        objectFit:'contain',
        borderRadius:'10px'
    },

    deleteBtn: {
        marginTop:'8px',
        width:'100%',
        padding:'6px',
        borderRadius:'8px',
        border:'none',
        background:'#ef4444',
        color:'white',
        cursor:'pointer',
        fontSize:'0.8rem'
    },

    removeImg: {
        position:'absolute',
        top:'0px',
        right:'0px',
        background:'#ef4444',
        border:'none',
        color:'white',
        borderRadius:'50%',
        width:'22px',
        height:'22px',
        cursor:'pointer'
    }
}

export default SellerDashboard
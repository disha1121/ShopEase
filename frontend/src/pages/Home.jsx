import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
)
const CartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
)
const OrderIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
)
const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
)

const Home = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
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

    const categories = ['All', ...new Set(products.map(p => p.category))]
    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || p.category === category
        return matchSearch && matchCat
    })

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
                * { margin:0; padding:0; box-sizing:border-box; }
                body, #root { width:100vw; min-height:100vh; overflow-x:hidden; }

                .home-wrap {
                    min-height:100vh;
                    background:#0f0c1a;
                    font-family:'Inter',sans-serif;
                    color:white;
                }

                /* NAVBAR */
                .home-nav {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:1rem 2rem;
                    background:rgba(15,12,26,0.95);
                    border-bottom:1px solid rgba(255,255,255,0.06);
                    position:sticky; top:0; z-index:100;
                    backdrop-filter:blur(20px);
                }
                .nav-logo {
                    font-family:'Playfair Display',serif;
                    font-size:1.6rem; font-weight:800;
                    background:linear-gradient(135deg,#ff9de2,#ffffff,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                    display:flex; align-items:center; gap:0.5rem;
                }
                .nav-right { display:flex; align-items:center; gap:0.6rem; }
                .nav-welcome {
                    color:rgba(255,255,255,0.5);
                    font-size:0.85rem; margin-right:0.5rem;
                }
                .nav-btn {
                    display:flex; align-items:center; gap:0.4rem;
                    padding:0.5rem 1rem;
                    background:rgba(255,255,255,0.06);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:8px; color:rgba(255,255,255,0.8);
                    font-size:0.82rem; font-weight:600;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .nav-btn:hover {
                    background:rgba(255,255,255,0.12);
                    color:white;
                }
                .logout-btn {
                    display:flex; align-items:center; gap:0.4rem;
                    padding:0.5rem 1rem;
                    background:rgba(239,68,68,0.15);
                    border:1px solid rgba(239,68,68,0.3);
                    border-radius:8px; color:#fca5a5;
                    font-size:0.82rem; font-weight:600;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .logout-btn:hover {
                    background:rgba(239,68,68,0.3);
                    color:white;
                }

                /* HERO */
                .hero {
                    text-align:center;
                    padding:2.5rem 2rem 1.5rem;
                    border-bottom:1px solid rgba(255,255,255,0.05);
                }
                .hero-title {
                    font-family:'Playfair Display',serif;
                    font-size:2.5rem; font-weight:800;
                    color:white; margin-bottom:0.4rem;
                }
                .hero-sub {
                    color:rgba(255,255,255,0.4);
                    font-size:0.95rem; margin-bottom:1.5rem;
                }

                /* SEARCH */
                .search-wrap {
                    max-width:450px; margin:0 auto 1.2rem;
                    position:relative;
                }
                .search-icon-pos {
                    position:absolute; left:1rem; top:50%;
                    transform:translateY(-50%);
                }
                .search-input {
                    width:100%;
                    padding:0.8rem 1rem 0.8rem 2.8rem;
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:10px; color:white;
                    font-size:0.9rem; outline:none;
                    font-family:'Inter',sans-serif;
                    transition:all 0.2s;
                }
                .search-input::placeholder { color:rgba(255,255,255,0.3); }
                .search-input:focus {
                    background:rgba(255,255,255,0.08);
                    border-color:rgba(255,78,205,0.5);
                }

                /* CATEGORIES */
                .cat-wrap {
                    display:flex; gap:0.5rem;
                    justify-content:center; flex-wrap:wrap;
                }
                .cat-btn {
                    padding:0.35rem 1rem;
                    border-radius:50px;
                    border:1px solid rgba(255,255,255,0.1);
                    background:rgba(255,255,255,0.04);
                    color:rgba(255,255,255,0.5);
                    font-size:0.82rem; font-weight:500;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                    text-transform:capitalize;
                }
                .cat-btn:hover {
                    background:rgba(255,255,255,0.1);
                    color:white;
                }
                .cat-btn.active {
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border-color:transparent;
                    box-shadow:0 3px 12px rgba(255,78,205,0.3);
                }

                /* PRODUCT SECTION */
                .product-section {
                    padding:2rem;
                    max-width:1400px; margin:0 auto;
                }
                .section-header {
                    display:flex; align-items:center;
                    justify-content:space-between;
                    margin-bottom:1.5rem;
                }
                .section-title {
                    font-size:1.1rem; font-weight:700;
                    color:rgba(255,255,255,0.8);
                }
                .product-count {
                    font-size:0.82rem;
                    color:rgba(255,255,255,0.3);
                }

                /* GRID */
                .product-grid {
                    display:grid;
                    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
                    gap:1.2rem;
                }

                /* CARD */
                .product-card {
                    background:#1a1625;
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:16px; overflow:hidden;
                    transition:all 0.3s; cursor:pointer;
                }
                .product-card:hover {
                    transform:translateY(-6px);
                    border-color:rgba(255,78,205,0.3);
                    box-shadow:0 16px 40px rgba(0,0,0,0.4);
                }
                .product-img-wrap {
                    width:100%; height:190px;
                    background:white;
                    display:flex; align-items:center;
                    justify-content:center; overflow:hidden;
                }
                .product-img {
                    width:100%; height:100%;
                    object-fit:contain; padding:8px;
                    transition:transform 0.3s;
                }
                .product-card:hover .product-img {
                    transform:scale(1.06);
                }
                .no-img {
                    font-size:2.5rem;
                    color:rgba(255,255,255,0.2);
                    background:#1a1625;
                    width:100%; height:100%;
                    display:flex; align-items:center;
                    justify-content:center;
                }
                .product-body { padding:1rem; }
                .product-cat {
                    display:inline-block;
                    background:rgba(255,78,205,0.15);
                    border:1px solid rgba(255,78,205,0.25);
                    color:#ff9de2;
                    padding:0.18rem 0.65rem;
                    border-radius:50px;
                    font-size:0.7rem; font-weight:600;
                    margin-bottom:0.5rem;
                    text-transform:capitalize;
                }
                .product-name {
                    font-size:0.95rem; font-weight:700;
                    color:white; margin-bottom:0.3rem;
                    line-height:1.3;
                }
                .product-desc {
                    font-size:0.78rem;
                    color:rgba(255,255,255,0.35);
                    margin-bottom:0.75rem; line-height:1.5;
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                    overflow:hidden;
                }
                .product-footer {
                    display:flex; justify-content:space-between;
                    align-items:center; margin-bottom:0.4rem;
                }
                .product-price {
                    font-size:1.2rem; font-weight:800;
                    background:linear-gradient(135deg,#ff9de2,#c8b6ff);
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                    background-clip:text;
                }
                .product-stock {
                    font-size:0.72rem;
                    color:rgba(255,255,255,0.3);
                }
                .product-seller {
                    font-size:0.75rem;
                    color:rgba(255,255,255,0.3);
                    margin-bottom:0.75rem;
                }
                .buy-btn {
                    width:100%; padding:0.7rem;
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border:none; border-radius:8px;
                    font-size:0.85rem; font-weight:700;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                    display:flex; align-items:center;
                    justify-content:center; gap:0.4rem;
                }
                .buy-btn:hover {
                    transform:translateY(-1px);
                    box-shadow:0 5px 18px rgba(255,78,205,0.4);
                }

                .empty-state {
                    text-align:center; padding:5rem 2rem;
                    color:rgba(255,255,255,0.3); font-size:1rem;
                }

                @media (max-width:768px) {
                    .home-nav { padding:0.75rem 1rem; }
                    .hero-title { font-size:1.8rem; }
                    .product-section { padding:1.5rem 1rem; }
                    .nav-welcome { display:none; }
                }
            `}</style>

            <div className="home-wrap">
                {/* NAVBAR */}
                <nav className="home-nav">
                    <div className="nav-logo">🛍️ ShopEase</div>
                    <div className="nav-right">
                        <span className="nav-welcome">Hi, {user?.name}!</span>
                        <button className="nav-btn" onClick={() => navigate('/my-orders')}>
                            <OrderIcon/> My Orders
                        </button>
                        <button className="logout-btn" onClick={() => { logoutUser(); navigate('/login') }}>
                            <LogoutIcon/> Logout
                        </button>
                    </div>
                </nav>

                {/* HERO */}
                <div className="hero">
                    <h1 className="hero-title">Discover Your Style ✨</h1>
                    <p className="hero-sub">Explore thousands of premium products</p>

                    <div className="search-wrap">
                        <div className="search-icon-pos"><SearchIcon/></div>
                        <input
                            className="search-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="cat-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-btn ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >{cat}</button>
                        ))}
                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="product-section">
                    <div className="section-header">
                        <span className="section-title">All Products</span>
                        <span className="product-count">{filtered.length} items</span>
                    </div>

                    {loading ? (
                        <div className="empty-state">⏳ Loading products...</div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">😕 No products found!</div>
                    ) : (
                        <div className="product-grid">
                            {filtered.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-img-wrap">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="product-img"/>
                                        ) : (
                                            <div className="no-img">📦</div>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        <span className="product-cat">{product.category}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">₹{product.price}</span>
                                            <span className="product-stock">Stock: {product.stock}</span>
                                        </div>
                                        <p className="product-seller">🏪 {product.seller?.name}</p>
                                        <button className="buy-btn" onClick={() => navigate(`/checkout/${product._id}`)}>
                                            <CartIcon/> Buy Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
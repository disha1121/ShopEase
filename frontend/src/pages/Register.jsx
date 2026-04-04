import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

const FloatingIcon = ({ emoji, initialX, initialY, speedX, speedY }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY })

    useEffect(() => {
        let animId
        let x = initialX
        let y = initialY
        let vx = speedX
        let vy = speedY
        const animate = () => {
            x += vx; y += vy
            if (x < 2) { x = 2; vx = Math.abs(vx) }
            if (x > 85) { x = 85; vx = -Math.abs(vx) }
            if (y < 2) { y = 2; vy = Math.abs(vy) }
            if (y > 88) { y = 88; vy = -Math.abs(vy) }
            setPos({ x, y })
            animId = requestAnimationFrame(animate)
        }
        animId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animId)
    }, [])

    return (
        <span style={{
            position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`,
            fontSize:'2.2rem', opacity:0.15, pointerEvents:'none',
            userSelect:'none', zIndex:0
        }}>{emoji}</span>
    )
}

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
)
const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
)
const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
)
const RoleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
)

const Register = () => {
    const [formData, setFormData] = useState({ name:'', email:'', password:'', role:'customer' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const floatingItems = [
        { emoji:'👜', x:5,  y:5,  sx:0.15,  sy:0.12  },
        { emoji:'👟', x:70, y:10, sx:-0.18, sy:0.14  },
        { emoji:'💄', x:3,  y:40, sx:0.12,  sy:-0.16 },
        { emoji:'🛍️', x:75, y:25, sx:-0.14, sy:0.18  },
        { emoji:'👗', x:10, y:60, sx:0.16,  sy:-0.13 },
        { emoji:'⌚', x:65, y:65, sx:-0.13, sy:-0.15 },
        { emoji:'👒', x:5,  y:78, sx:0.18,  sy:-0.12 },
        { emoji:'💍', x:78, y:80, sx:-0.15, sy:0.16  },
    ]

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { data } = await register(formData)
            if (data?.token) {
                localStorage.setItem('token', data.token)
                loginUser(data.user, data.token)
            }
            if (data.user.role === 'admin') navigate('/admin')
            else if (data.user.role === 'seller') navigate('/seller')
            else navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
                * { margin:0; padding:0; box-sizing:border-box; }
                body, #root { width:100vw; min-height:100vh; overflow-x:hidden; }

               .reg-wrap {
    width:100vw; min-height:100vh;
    background:linear-gradient(145deg,#1a0533 0%,#3d0b6b 40%,#6d1b7b 70%,#c2185b 100%);
    display:flex; align-items:center; justify-content:center;
    font-family:'Inter',sans-serif; position:relative; overflow:hidden;
    padding: 3rem 1rem;   /* ← increased padding */
}
                .glow-blob {
                    position:absolute; border-radius:50%;
                    filter:blur(70px); opacity:0.35; pointer-events:none;
                }
                .reg-card {
                    position:relative; z-index:1;
                    background:rgba(255,255,255,0.07);
                    backdropFilter:blur(20px);
                    -webkit-backdrop-filter:blur(20px);
                    border:1px solid rgba(255,255,255,0.15);
                    border-radius:24px;
                    padding:2.5rem;
                    width:100%; max-width:480px;
                    box-shadow:0 25px 50px rgba(0,0,0,0.3);
                    transition:transform 0.3s, box-shadow 0.3s;
                }
                .reg-card:hover {
                    transform:translateY(-4px);
                    box-shadow:0 35px 60px rgba(0,0,0,0.4);
                }
                .reg-input-wrap {
                    position:relative; margin-bottom:1.1rem;
                }
                .reg-icon {
                    position:absolute; left:0.9rem;
                    top:50%; transform:translateY(-50%);
                    pointer-events:none;
                }
                .reg-input {
                    width:100%;
                    padding:0.9rem 1rem 0.9rem 2.8rem;
                    border:1px solid rgba(255,255,255,0.2);
                    border-radius:12px;
                    background:rgba(255,255,255,0.05);
                    color:white; font-size:0.95rem;
                    outline:none; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .reg-input::placeholder { color:rgba(255,255,255,0.35); }
                .reg-input:focus {
                    border-color:#ff4ecd;
                    background:rgba(255,255,255,0.1);
                    box-shadow:0 0 0 3px rgba(255,78,205,0.15);
                }
                .reg-select {
                    width:100%;
                    padding:0.9rem 1rem 0.9rem 2.8rem;
                    border:1px solid rgba(255,255,255,0.2);
                    border-radius:12px;
                    background:rgba(255,255,255,0.05);
                    color:white; font-size:0.95rem;
                    outline:none; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                    cursor:pointer; appearance:none;
                }
                .reg-select option { background:#3d0b6b; color:white; }
                .reg-select:focus {
                    border-color:#ff4ecd;
                    box-shadow:0 0 0 3px rgba(255,78,205,0.15);
                }
                .role-toggle {
                    display:flex; gap:0.75rem; margin-bottom:1.1rem;
                }
                .role-btn {
                    flex:1; padding:0.8rem;
                    border-radius:12px; border:1px solid rgba(255,255,255,0.2);
                    background:rgba(255,255,255,0.05);
                    color:rgba(255,255,255,0.6);
                    font-size:0.9rem; font-weight:600;
                    cursor:pointer; transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .role-btn.active {
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border-color:transparent;
                    box-shadow:0 4px 15px rgba(255,78,205,0.3);
                }
                .role-btn:hover:not(.active) {
                    background:rgba(255,255,255,0.1);
                    color:white;
                }
                .reg-btn {
                    width:100%; padding:1rem;
                    background:linear-gradient(135deg,#ff4ecd,#7b1fa2);
                    color:white; border:none; border-radius:12px;
                    font-size:1rem; font-weight:700; cursor:pointer;
                    transition:all 0.3s; font-family:'Inter',sans-serif;
                    box-shadow:0 4px 20px rgba(255,78,205,0.35);
                    margin-top:0.5rem;
                }
                .reg-btn:hover:not(:disabled) {
                    transform:translateY(-2px);
                    box-shadow:0 8px 25px rgba(255,78,205,0.5);
                }
                .reg-btn:disabled {
                    background:rgba(255,255,255,0.1);
                    color:rgba(255,255,255,0.4);
                    cursor:not-allowed; box-shadow:none;
                }
                .login-link {
                    display:block; text-align:center;
                    padding:0.9rem; margin-top:1rem;
                    border:1px solid rgba(255,255,255,0.2);
                    border-radius:12px;
                    color:rgba(255,255,255,0.8);
                    text-decoration:none; font-weight:600;
                    transition:all 0.2s;
                    font-family:'Inter',sans-serif;
                }
                .login-link:hover {
                    background:rgba(255,255,255,0.1);
                    color:white; border-color:rgba(255,255,255,0.4);
                }
            `}</style>

            <div className="reg-wrap">
                {/* Glow blobs */}
                <div className="glow-blob" style={{width:'350px',height:'350px',background:'#e91e8c',top:'-120px',left:'-120px'}}/>
                <div className="glow-blob" style={{width:'300px',height:'300px',background:'#7b1fa2',bottom:'-100px',right:'-100px'}}/>
                <div className="glow-blob" style={{width:'200px',height:'200px',background:'#ff4081',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>

                {/* Floating icons */}
                {floatingItems.map((item,i) => (
                    <FloatingIcon key={i} emoji={item.emoji} initialX={item.x} initialY={item.y} speedX={item.sx} speedY={item.sy}/>
                ))}

                {/* Card */}
                <div className="reg-card">
                    {/* Header */}
                    <div style={{textAlign:'center',marginBottom:'1.8rem'}}>
                        <div style={{
                            width:'65px',height:'65px',
                            background:'linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))',
                            borderRadius:'18px',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            margin:'0 auto 1rem',
                            border:'1px solid rgba(255,255,255,0.2)',
                            fontSize:'1.8rem',
                            backdropFilter:'blur(10px)'
                        }}>🛍️</div>

                        <h2 style={{
                            fontFamily:"'Playfair Display',serif",
                            fontSize:'2rem',fontWeight:'800',
                            color:'white',marginBottom:'0.3rem'
                        }}>Create Account</h2>
                        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.88rem'}}>
                            Join ShopEase today
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background:'rgba(255,0,0,0.15)',
                            border:'1px solid rgba(255,100,100,0.3)',
                            color:'#ffb3b3',padding:'0.75rem 1rem',
                            borderRadius:'10px',marginBottom:'1.2rem',
                            fontSize:'0.9rem'
                        }}>⚠️ {error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="reg-input-wrap">
                            <span className="reg-icon"><UserIcon/></span>
                            <input className="reg-input" type="text" name="name"
                                placeholder="Full Name"
                                value={formData.name} onChange={handleChange} required/>
                        </div>

                        {/* Email */}
                        <div className="reg-input-wrap">
                            <span className="reg-icon"><EmailIcon/></span>
                            <input className="reg-input" type="email" name="email"
                                placeholder="Email Address"
                                value={formData.email} onChange={handleChange} required/>
                        </div>

                        {/* Password */}
                        <div className="reg-input-wrap">
                            <span className="reg-icon"><LockIcon/></span>
                            <input className="reg-input" type="password" name="password"
                                placeholder="Create Password"
                                value={formData.password} onChange={handleChange} required/>
                        </div>

                        {/* Role Toggle */}
                        <label style={{display:'block',fontSize:'0.83rem',fontWeight:'600',color:'rgba(255,255,255,0.6)',marginBottom:'0.5rem'}}>
                            I want to join as:
                        </label>
                        <div className="role-toggle">
                            <button type="button"
                                className={`role-btn ${formData.role === 'customer' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role:'customer'})}>
                                🛒 Customer
                            </button>
                            <button type="button"
                                className={`role-btn ${formData.role === 'seller' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role:'seller'})}>
                                🏪 Seller
                            </button>
                        </div>

                        <button className="reg-btn" type="submit" disabled={loading}>
                            {loading ? '⏳ Creating Account...' : '→ Create My Account'}
                        </button>
                    </form>

                    <Link to="/login" className="login-link">
                        Already have an account? Sign In →
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Register
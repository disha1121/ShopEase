import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
)
const ReturnIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
)
const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
)
const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
)
const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
)
const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
)

const FloatingIcon = ({ emoji, initialX, initialY, speedX, speedY }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY })

    useEffect(() => {
        let animId
        let x = initialX
        let y = initialY
        let vx = speedX
        let vy = speedY

        const animate = () => {
            x += vx
            y += vy

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
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            fontSize: '2.2rem',
            opacity: 0.2,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0
        }}>{emoji}</span>
    )
}

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const floatingItems = [
        { emoji: '👜', x: 5,  y: 5,  sx: 0.15,  sy: 0.12  },
        { emoji: '👟', x: 70, y: 10, sx: -0.18, sy: 0.14  },
        { emoji: '💄', x: 3,  y: 40, sx: 0.12,  sy: -0.16 },
        { emoji: '🛍️', x: 75, y: 25, sx: -0.14, sy: 0.18  },
        { emoji: '👗', x: 10, y: 60, sx: 0.16,  sy: -0.13 },
        { emoji: '⌚', x: 65, y: 65, sx: -0.13, sy: -0.15 },
        { emoji: '👒', x: 5,  y: 78, sx: 0.18,  sy: -0.12 },
        { emoji: '💍', x: 78, y: 80, sx: -0.15, sy: 0.16  },
    ]

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { data } = await login(formData)
            loginUser(data.user, data.token)
            if (data.user.role === 'admin') navigate('/admin')
            else if (data.user.role === 'seller') navigate('/seller')
            else navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
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
                .login-wrap {
                    display:flex; width:100vw; min-height:100vh;
                    font-family:'Inter',sans-serif;
                }
                .l-left {
                    width:52%; min-height:100vh; position:relative;
                    background:linear-gradient(145deg,#1a0533 0%,#3d0b6b 40%,#6d1b7b 70%,#c2185b 100%);
                    display:flex; align-items:center; justify-content:center;
                    overflow:hidden; padding:3rem 2.5rem;
                }
                .l-right {
                    width:48%; min-height:100vh; background:#fff;
                    display:flex; align-items:center; justify-content:center;
                    padding:2rem;
                }
                .glow {
                    position:absolute; border-radius:50%;
                    filter:blur(70px); opacity:0.35; pointer-events:none;
                }
                .stat-card {
                    background:rgba(255,255,255,0.08);
                    border:1px solid rgba(255,255,255,0.15);
                    padding:0.9rem 1.1rem; border-radius:16px;
                    text-align:center; backdrop-filter:blur(10px);
                    min-width:85px; transition:transform 0.2s;
                }
                .stat-card:hover { transform:translateY(-3px); }
                .feature-pill {
                    display:flex; align-items:center; gap:0.75rem;
                    background:rgba(255,255,255,0.08);
                    border:1px solid rgba(255,255,255,0.15);
                    padding:0.7rem 1.2rem; border-radius:50px;
                    color:white; font-size:0.88rem;
                    backdrop-filter:blur(8px); transition:all 0.2s;
                }
                .feature-pill:hover {
                    background:rgba(255,255,255,0.15);
                    transform:translateX(5px);
                }
                .form-input {
                    width:100%; padding:0.9rem 1rem 0.9rem 2.8rem;
                    border:2px solid #f0f0f0; border-radius:12px;
                    font-size:0.95rem; outline:none; background:#fafafa;
                    transition:all 0.2s; font-family:'Inter',sans-serif;
                }
                .form-input:focus {
                    border-color:#c2185b; background:white;
                    box-shadow:0 0 0 4px rgba(194,24,91,0.08);
                }
                .login-btn {
                    width:100%; padding:1rem;
                    background:linear-gradient(135deg,#c2185b,#7b1fa2);
                    color:white; border:none; border-radius:12px;
                    font-size:1rem; font-weight:700; cursor:pointer;
                    transition:all 0.3s; font-family:'Inter',sans-serif;
                    letter-spacing:0.3px;
                    box-shadow:0 4px 20px rgba(194,24,91,0.35);
                }
                .login-btn:hover:not(:disabled) {
                    transform:translateY(-2px);
                    box-shadow:0 8px 25px rgba(194,24,91,0.5);
                }
                .login-btn:disabled {
                    background:#e0e0e0; color:#999;
                    cursor:not-allowed; box-shadow:none;
                }
                .register-btn {
                    width:100%; padding:0.9rem; background:transparent;
                    border:2px solid #c2185b; border-radius:12px;
                    color:#c2185b; font-size:0.95rem; font-weight:700;
                    cursor:pointer; transition:all 0.2s; text-decoration:none;
                    display:block; text-align:center; font-family:'Inter',sans-serif;
                }
                .register-btn:hover { background:#c2185b; color:white; }
                @media (max-width:768px) {
                    .login-wrap { flex-direction:column; }
                    .l-left, .l-right { width:100%; }
                    .l-left { min-height:auto; padding:2.5rem 1.5rem; }
                }
            `}</style>

            <div className="login-wrap">
                {/* LEFT PANEL */}
                <div className="l-left">
                    <div className="glow" style={{width:'300px',height:'300px',background:'#e91e8c',top:'-100px',left:'-100px'}}/>
                    <div className="glow" style={{width:'250px',height:'250px',background:'#7b1fa2',bottom:'-80px',right:'-80px'}}/>
                    <div className="glow" style={{width:'200px',height:'200px',background:'#ff4081',top:'40%',left:'35%'}}/>

                    {floatingItems.map((item, i) => (
                        <FloatingIcon
                            key={i}
                            emoji={item.emoji}
                            initialX={item.x}
                            initialY={item.y}
                            speedX={item.sx}
                            speedY={item.sy}
                        />
                    ))}

                    <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:'460px',textAlign:'center'}}>
                        <div style={{
                            width:'80px',height:'80px',
                            background:'linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))',
                            borderRadius:'24px',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            margin:'0 auto 1.2rem',
                            border:'1px solid rgba(255,255,255,0.3)',
                            fontSize:'2.2rem',
                            backdropFilter:'blur(20px)',
                            boxShadow:'0 8px 32px rgba(0,0,0,0.2)'
                        }}>🛍️</div>

                        <div style={{
                            fontFamily:"'Playfair Display',serif",
                            fontSize:'3.2rem',fontWeight:'800',
                            background:'linear-gradient(135deg,#ff9de2,#ffffff,#c8b6ff)',
                            WebkitBackgroundClip:'text',
                            WebkitTextFillColor:'transparent',
                            backgroundClip:'text',
                            letterSpacing:'-1px',lineHeight:1,marginBottom:'0.3rem'
                        }}>ShopEase</div>

                        <p style={{
                            color:'rgba(255,255,255,0.65)',fontSize:'0.85rem',
                            marginBottom:'2rem',letterSpacing:'3px',
                            textTransform:'uppercase',fontWeight:'500'
                        }}>Fashion • Style • Luxury</p>

                        <div style={{display:'flex',gap:'0.75rem',justifyContent:'center',marginBottom:'2rem',flexWrap:'wrap'}}>
                            {[['10K+','Products'],['500+','Brands'],['50K+','Customers']].map(([num,label])=>(
                                <div key={label} className="stat-card">
                                    <div style={{fontSize:'1.4rem',fontWeight:'800',color:'white'}}>{num}</div>
                                    <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.7)',marginTop:'2px'}}>{label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                            {[
                                [<TruckIcon/>,  'Free Delivery on orders above ₹499'],
                                [<ReturnIcon/>, 'Easy 30-day Returns'],
                                [<ShieldIcon/>, '100% Secure Payments'],
                                [<CheckIcon/>,  'Genuine Products Only'],
                            ].map(([icon,text],i)=>(
                                <div key={i} className="feature-pill">{icon}{text}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="l-right">
                    <div style={{width:'100%',maxWidth:'420px'}}>
                        <div style={{marginBottom:'2rem'}}>
                            <div style={{
                                display:'inline-flex',alignItems:'center',gap:'0.5rem',
                                background:'linear-gradient(135deg,#fce4ec,#f3e5f5)',
                                padding:'0.4rem 1rem',borderRadius:'50px',
                                fontSize:'0.8rem',fontWeight:'600',
                                color:'#c2185b',marginBottom:'1rem'
                            }}>✨ Welcome to ShopEase</div>

                            <h2 style={{
                                fontFamily:"'Playfair Display',serif",
                                fontSize:'2.2rem',fontWeight:'800',
                                color:'#1a0533',marginBottom:'0.4rem',lineHeight:'1.2'
                            }}>Sign In</h2>
                            <p style={{color:'#888',fontSize:'0.9rem'}}>
                                Continue your shopping journey
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                background:'#fff1f2',border:'1px solid #fecdd3',
                                color:'#e11d48',padding:'0.75rem 1rem',
                                borderRadius:'10px',marginBottom:'1.25rem',fontSize:'0.9rem'
                            }}>⚠️ {error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{marginBottom:'1.2rem'}}>
                                <label style={{display:'block',fontSize:'0.83rem',fontWeight:'600',color:'#333',marginBottom:'0.5rem'}}>
                                    Email Address
                                </label>
                                <div style={{position:'relative'}}>
                                    <span style={{position:'absolute',left:'0.9rem',top:'50%',transform:'translateY(-50%)'}}>
                                        <EmailIcon/>
                                    </span>
                                    <input className="form-input" type="email" name="email"
                                        placeholder="you@example.com"
                                        value={formData.email} onChange={handleChange} required/>
                                </div>
                            </div>

                            <div style={{marginBottom:'1.5rem'}}>
                                <label style={{display:'block',fontSize:'0.83rem',fontWeight:'600',color:'#333',marginBottom:'0.5rem'}}>
                                    Password
                                </label>
                                <div style={{position:'relative'}}>
                                    <span style={{position:'absolute',left:'0.9rem',top:'50%',transform:'translateY(-50%)'}}>
                                        <LockIcon/>
                                    </span>
                                    <input className="form-input" type="password" name="password"
                                        placeholder="Enter your password"
                                        value={formData.password} onChange={handleChange} required/>
                                </div>
                            </div>

                            <button className="login-btn" type="submit" disabled={loading}>
                                {loading ? '⏳ Signing in...' : '→ Sign in to ShopEase'}
                            </button>
                        </form>

                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',margin:'1.5rem 0'}}>
                            <div style={{flex:1,height:'1px',background:'#f0f0f0'}}/>
                            <span style={{color:'#bbb',fontSize:'0.8rem',whiteSpace:'nowrap'}}>Don't have an account?</span>
                            <div style={{flex:1,height:'1px',background:'#f0f0f0'}}/>
                        </div>

                        <Link to="/register" className="register-btn">
                            Create Free Account ✨
                        </Link>

                        <p style={{textAlign:'center',color:'#aaa',fontSize:'0.82rem',marginTop:'1rem'}}>
                            Seller?{' '}
                            <Link to="/register" style={{color:'#7b1fa2',fontWeight:'600',textDecoration:'none'}}>
                                Register as Seller →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
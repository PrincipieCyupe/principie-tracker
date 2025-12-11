import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user data
import '../styles/style.css';
import '../styles/responsive.css';

export default function Header() {
    const { currentUser } = useAuth(); // Get current user
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // If user has a displayName, use it. Otherwise use "User"
    const displayName = currentUser?.displayName || "User";

    return (
        <header className="main-header">
            <div className="container header-container">
                <div className="logo">
                    <Link to="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'12px'}}>
                        <img src="/assets/Union.png" alt="Logo" style={{height:'35px'}} />
                        <div style={{display:'flex', flexDirection:'column', lineHeight:'1.1'}}>
                            <span style={{color:'white', fontWeight:'800', fontSize:'1.4rem', letterSpacing:'1px'}}>PRINCIPIE</span>
                            <span style={{color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', fontWeight:'500', letterSpacing:'2.5px', textTransform:'uppercase'}}>Business Group</span>
                        </div>
                    </Link>
                </div>

                <button 
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{display: 'none', background:'none', border:'none', color:'white', fontSize:'1.5rem'}}
                >
                    ☰
                </button>

                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-menu">
                        <li><Link to="/" className={`nav-link ${isActive('/')}`} onClick={()=>setIsMenuOpen(false)}>Dashboard</Link></li>
                        <li><Link to="/settings" className={`nav-link ${isActive('/settings')}`} onClick={()=>setIsMenuOpen(false)}>Settings</Link></li>
                        <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={()=>setIsMenuOpen(false)}>About</Link></li>
                    </ul>
                </nav>

                <div className="header-actions" style={{display:'flex', alignItems:'center'}}>
                    
                    {/* NEW: Welcome Message */}
                    <span className="welcome-text" style={{display: isMenuOpen ? 'none' : 'block'}}>
                        Welcome, <strong>{displayName}</strong>
                    </span>

                    <button onClick={handleLogout} className="btn btn-secondary" style={{padding:'5px 10px', fontSize:'0.8rem', marginRight:'10px'}}>
                        Sign Out
                    </button>
                    
                    {/* Button is now styled white via CSS */}
                    {location.hash !== '#add-transaction-heading' && (
                        <Link to="/#add-transaction-heading" className="btn header-btn-apply">New Expense</Link>
                    )}
                </div>
            </div>
        </header>
    );
}
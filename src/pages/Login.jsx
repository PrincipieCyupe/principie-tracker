import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/style.css"; 

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (username) {
            await updateProfile(userCredential.user, { displayName: username });
        }
      }
      navigate("/");
    } catch (err) {
      console.error("Auth Error:", err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') msg = "That email is already registered.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="stat-card" style={{ maxWidth: '400px', width: '100%', padding: '40px', textAlign: 'center' }}>
        
        <div style={{ marginBottom: '10px' }}>
             <h2 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', margin: '0', lineHeight: '1' }}>
                PRINCIPIE
             </h2>
             <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '5px', marginBottom: '20px' }}>
                Business Group
             </p>

             <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--color-primary)', 
                borderRadius: '50%', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
             }}>
                 <img 
                    src="/assets/Union.png" 
                    alt="Company Logo" 
                    style={{ height: '40px', width: 'auto', display: 'block' }} 
                 />
             </div>
        </div>

        {/* 3. Login Heading */}
        <h3 style={{ marginBottom: '25px', color: 'var(--color-dark)', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
          {isLogin ? "Finance Tracker Login" : "Create Finance Tracker Account"}
        </h3>

        {error && (
            <div className="status-message error" style={{marginBottom: '20px', color: 'var(--color-accent)', fontWeight:'bold', background: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>
                {error}
            </div>
        )}

        <form onSubmit={handleAuth} style={{textAlign: 'left'}}>
          {!isLogin && (
            <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="How should we call you?"
                  disabled={loading}
                />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading}
              placeholder="Enter password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (
                <>
                    <span className="spinner"></span> Processing...
                </>
            ) : (
                isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem' }}>
          {isLogin ? "New here?" : "Have an account?"} 
          <span 
            onClick={() => {
                setError("");
                setIsLogin(!isLogin);
            }} 
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline' }}>
            {isLogin ? "Create Account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
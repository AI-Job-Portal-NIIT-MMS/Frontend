import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bot, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/auth.css';
export const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const { login } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Toast shown in login
        } finally {
            setLoading(false);
        }
    };
    return (<div className="auth-page">
      <div className="auth-card-single">
        <div className="auth-header-icon">
          <Bot size={28}/>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to AI Power.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon"/>
              <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Password</label>
              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon"/>
              <input type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              <button type="button" className="input-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="remember-row">
            <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: '#4648d4' }}/>
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            Sign In
          </button>
        </form>

        <div className="divider-row">
          <span>Or continue with</span>
        </div>

        <div className="social-btns-row">
          <button className="social-btn" onClick={() => handleSubmit({ preventDefault: () => { } })}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google"/>
            <span>Google</span>
          </button>
          <button className="social-btn" onClick={() => handleSubmit({ preventDefault: () => { } })}>
            <img src="https://www.svgrepo.com/show/448234/linkedin.svg" width="18" height="18" alt="LinkedIn"/>
            <span>LinkedIn</span>
          </button>
        </div>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>);
};

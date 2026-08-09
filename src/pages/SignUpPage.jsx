import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bot, User, Mail, Lock, Sparkles, TrendingUp } from 'lucide-react';
import '../styles/auth.css';
export const SignUpPage = () => {
    const [fullName, setFullName] = useState('John Doe');
    const [email, setEmail] = useState('john@example.com');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(true);
    const { login } = useApp();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        login(email);
        navigate('/dashboard');
    };
    return (<div className="auth-page">
      <div className="auth-split-card">
        {/* Left Side Purple Banner */}
        <div className="auth-split-left">
          <div>
            <div className="auth-split-brand" style={{ marginBottom: '40px' }}>
              <div className="sidebar-logo-icon" style={{ width: 32, height: 32 }}>
                <Bot size={20}/>
              </div>
              <span>AI Power</span>
            </div>

            <h2 className="auth-split-hero-title">
              Supercharge your career journey.
            </h2>
            <p className="auth-split-hero-desc">
              Join thousands of professionals finding their next big opportunity with intelligent matching.
            </p>
          </div>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Sparkles size={18}/>
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700 }}>Get personalized matches</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>Our AI analyzes your skills to find the perfect fit.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <TrendingUp size={18}/>
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700 }}>Track applications</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>Monitor your progress in real-time from one dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-split-right">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Start your AI-powered job search today.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon"/>
                <input type="text" className="auth-input" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon"/>
                <input type="email" className="auth-input" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon"/>
                <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: 4 }}>
                Must be at least 8 characters long.
              </span>
            </div>

            <div className="remember-row">
              <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required style={{ accentColor: '#4648d4' }}/>
              <label htmlFor="terms" style={{ fontSize: '0.825rem' }}>
                I agree to the <a href="#terms" style={{ color: '#4648d4', fontWeight: 600 }}>Terms of Service</a> and <a href="#privacy" style={{ color: '#4648d4', fontWeight: 600 }}>Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Create Account
            </button>
          </form>

          <p className="auth-footer-text" style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/signin">Log in</Link>
          </p>
        </div>
      </div>
    </div>);
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bot, User, Mail, Lock, Sparkles, TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react';
import '../styles/auth.css';

export const SignUpPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Job Seeker');
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setErrorMessage('');
        if (!email || !password || !fullName) return;
        setLoading(true);
        try {
            await register({ fullName, email, password, role });
            navigate('/onboarding');
        } catch (err) {
            setErrorMessage(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="auth-page">
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

            {errorMessage && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <strong>{errorMessage}</strong>
                </div>
                {errorMessage.toLowerCase().includes('already registered') && (
                  <Link to="/signin" style={{ color: '#4648d4', fontWeight: 700, textDecoration: 'underline', marginTop: '2px' }}>
                    Already have this account? Click here to Log In &rarr;
                  </Link>
                )}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">I want to</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: role === 'Job Seeker' ? '2px solid #4648d4' : '1px solid #cbd5e1',
                      background: role === 'Job Seeker' ? '#eef2ff' : '#ffffff',
                      color: role === 'Job Seeker' ? '#4648d4' : '#64748b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setRole('Job Seeker')}
                  >
                    Find a Job
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: role === 'Employer' ? '2px solid #4648d4' : '1px solid #cbd5e1',
                      background: role === 'Employer' ? '#eef2ff' : '#ffffff',
                      color: role === 'Employer' ? '#4648d4' : '#64748b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setRole('Employer')}
                  >
                    Hire Talent
                  </button>
                </div>
              </div>

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
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={18} className="input-icon"/>
                  <input type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: 4 }}>
                  Must be at least 6 characters long.
                </span>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required style={{ accentColor: '#4648d4' }}/>
                <label htmlFor="terms" style={{ fontSize: '0.825rem' }}>
                  I agree to the <a href="#terms" style={{ color: '#4648d4', fontWeight: 600 }}>Terms of Service</a> and <a href="#privacy" style={{ color: '#4648d4', fontWeight: 600 }}>Privacy Policy</a>.
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer-text" style={{ textAlign: 'center' }}>
              Already have an account? <Link to="/signin">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    );
};

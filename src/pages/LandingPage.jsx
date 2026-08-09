import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Search, MapPin, Sparkles, TrendingUp, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import '../styles/landing.css';
export const LandingPage = () => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?query=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
    };
    return (<div className="landing-page">
      {/* Navigation Header */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Bot size={20}/>
          </div>
          <span>AI Power</span>
        </div>

        <div className="landing-links">
          <Link to="/jobs">Job Search</Link>
          <Link to="/ai-match">AI Match</Link>
          <Link to="/resume-builder">Resume Builder</Link>
          <Link to="/career-tools">Career Tools</Link>
        </div>

        <div className="landing-auth-btns">
          <Link to="/signin" className="btn-outline">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary">
            Create Free Account
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="landing-hero">
        <motion.h1 className="landing-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          Find Your Dream Job with{' '}
          <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ display: 'inline-block' }}>
            AI–Powered
          </motion.span>{' '}
          Precision
        </motion.h1>

        <motion.p className="landing-hero-subtitle" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          Join thousands of professionals using AI Power to match with top companies, build ATS-optimized resumes, and land their next big opportunity faster than ever.
        </motion.p>

        {/* Big Search Bar */}
        <motion.form className="landing-search-card" onSubmit={handleSearch} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="landing-search-field">
            <Search size={18} color="#64748b"/>
            <input type="text" placeholder="Job title, keywords, or company" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
          </div>
          <div className="landing-search-field">
            <MapPin size={18} color="#64748b"/>
            <input type="text" placeholder="City, state, or remote" value={location} onChange={(e) => setLocation(e.target.value)}/>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '12px 28px', whiteSpace: 'nowrap' }}>
            Search Jobs
          </button>
        </motion.form>

        <motion.div className="popular-searches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.5 }}>
          <span>Popular:</span>
          <span className="popular-tag" onClick={() => navigate('/jobs?query=Software Engineer')}>Software Engineer</span>
          <span className="popular-tag" onClick={() => navigate('/jobs?query=Product Manager')}>Product Manager</span>
          <span className="popular-tag" onClick={() => navigate('/jobs?query=Data Scientist')}>Data Scientist</span>
        </motion.div>
      </section>

      {/* Hero Visuals Grid */}
      <section className="hero-visuals-grid">
        <motion.div className="hero-banner-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&fit=crop" alt="Team collaboration"/>
          <div className="hero-banner-overlay">
            <motion.h3 initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
              Accelerate Your Career
            </motion.h3>
            <p>Connect with forward-thinking companies worldwide.</p>
          </div>
        </motion.div>

        <div className="hero-side-cards">
          <motion.div className="feature-match-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Bot size={24}/>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>AI Job Match</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>95% match accuracy</p>
          </motion.div>

          <motion.div className="feature-resume-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Smart Resume</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>ATS-optimized templates</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={20}/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-section">
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          Why Choose AI Power
        </motion.h2>
        <p className="section-desc">
          Our intelligent platform goes beyond keyword matching to understand your unique skills and career aspirations.
        </p>

        <div className="features-grid">
          <motion.div className="feature-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div className="feature-icon-wrapper">
              <Sparkles size={22}/>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>AI Job Matching</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Our deep learning algorithms analyze your profile against millions of job descriptions to find perfect cultural and skill fits.
            </p>
          </motion.div>

          <motion.div className="feature-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }}>
            <div className="feature-icon-wrapper">
              <TrendingUp size={22}/>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Career Insights</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Get real-time salary data, skill gap analysis, and tailored learning recommendations to boost your hiring potential.
            </p>
          </motion.div>

          <motion.div className="feature-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }}>
            <div className="feature-icon-wrapper">
              <FileCheck size={22}/>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Resume Building</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Craft an ATS-beating resume in minutes with AI-suggested bullet points tailored to specific job postings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ready CTA Banner */}
      <section className="ready-banner">
        <motion.h2 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          Ready to get started?
        </motion.h2>
        <p>Join AI Power today and let our intelligent platform guide you to your next career breakthrough.</p>
        <div className="ready-actions">
          <Link to="/signup" className="btn-primary" style={{ padding: '12px 28px' }}>
            Create Free Account
          </Link>
          <Link to="/jobs" className="btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
            Explore Jobs
          </Link>
        </div>
      </section>

      <Footer />
    </div>);
};

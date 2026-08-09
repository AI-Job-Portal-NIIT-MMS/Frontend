import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Globe, Share2 } from 'lucide-react';
import '../styles/landing.css';
export const Footer = () => {
    return (<footer className="landing-footer">
      <div className="footer-inner">
        <div>
          <div className="landing-logo" style={{ marginBottom: '12px' }}>
            <div className="landing-logo-icon">
              <Bot size={20}/>
            </div>
            <span>AI Power</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            Empowering careers through intelligent job matching, ATS-optimized resumes, and precision recruiter insights.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <li><Link to="/jobs">Job Search</Link></li>
            <li><Link to="/ai-match">AI Match</Link></li>
            <li><Link to="/resume-builder">Resume Builder</Link></li>
            <li><Link to="/career-tools">Career Tools</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px' }}>Company</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '16px' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 AI Power. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Globe size={16}/>
          <Share2 size={16}/>
        </div>
      </div>
    </footer>);
};

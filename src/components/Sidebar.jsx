import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bot, LayoutDashboard, Search, Sparkles, ClipboardList, Bookmark, FileText, Briefcase, Building2, MessageSquare, Bell, User, Settings, PlusCircle, Zap, Sun, Moon, X, } from 'lucide-react';
import '../styles/sidebar.css';
export const Sidebar = ({ isOpen, onClose }) => {
    const { theme, toggleTheme, role } = useApp();
    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Find Jobs', path: '/jobs', icon: Search },
        { label: 'AI Job Match', path: '/ai-match', icon: Sparkles },
        { label: 'Applications', path: '/applications', icon: ClipboardList, badge: '24' },
        { label: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark, badge: '16' },
        { label: 'Resume Builder', path: '/resume-builder', icon: FileText },
        { label: 'Career Tools', path: '/career-tools', icon: Briefcase },
        { label: 'Companies', path: '/companies', icon: Building2 },
        { label: 'Messages', path: '/messages', icon: MessageSquare, badge: '3' },
        { label: 'Notifications', path: '/notifications', icon: Bell, badge: '8', badgeClass: 'notification' },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];
    if (role === 'HR Manager') {
        navItems.splice(3, 0, { label: 'Post a Job', path: '/post-job', icon: PlusCircle });
    }
    return (<>
      <div className={`mobile-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}/>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <Bot size={22}/>
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">AI Power</span>
            <span className="sidebar-brand-subtitle">Job Portal</span>
          </div>
          <button className="topbar-mobile-toggle" onClick={onClose} style={{ marginLeft: 'auto', color: '#94a3b8' }}>
            <X size={20}/>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (<NavLink key={item.path} to={item.path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon size={18}/>
                <span>{item.label}</span>
                {item.badge && (<span className={`sidebar-badge ${item.badgeClass || ''}`}>
                    {item.badge}
                  </span>)}
              </NavLink>);
        })}
        </nav>

        {/* Upgrade Box */}
        <div className="sidebar-upgrade-card">
          <Zap className="sidebar-upgrade-bolt"/>
          <div className="sidebar-upgrade-title">Upgrade to Premium</div>
          <div className="sidebar-upgrade-desc">
            Unlock all AI features and boost your career matching potential.
          </div>
          <button className="btn-primary sidebar-upgrade-btn">
            Upgrade Now
          </button>
        </div>

        {/* Theme Switcher */}
        <button className="sidebar-theme-toggle" onClick={toggleTheme}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'light' ? <Sun size={16}/> : <Moon size={16}/>}
            <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div style={{
            width: '32px',
            height: '18px',
            backgroundColor: theme === 'dark' ? '#4648d4' : 'rgba(255,255,255,0.2)',
            borderRadius: '999px',
            position: 'relative',
            transition: 'background-color 0.2s',
        }}>
            <div style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: theme === 'dark' ? '16px' : '2px',
            transition: 'left 0.2s',
        }}/>
          </div>
        </button>
      </aside>
    </>);
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Bell, Menu, ChevronDown, LogOut } from 'lucide-react';
import '../styles/topbar.css';
export const Topbar = ({ onMenuToggle }) => {
    const { role, setRole, userProfile, addToast, logout } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const handleRoleToggle = (newRole) => {
        setRole(newRole);
        addToast(`Switched view to ${newRole}`, 'info');
    };
    return (<header className="topbar">
      <button className="topbar-mobile-toggle" onClick={onMenuToggle} aria-label="Open Navigation">
        <Menu size={22}/>
      </button>

      <form className="topbar-search" onSubmit={handleSearchSubmit}>
        <Search size={18} className="topbar-search-icon"/>
        <input type="text" className="topbar-search-input" placeholder="Search jobs, skills, companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      </form>

      <div className="topbar-actions">
        {/* Role Toggle */}
        <div className="role-switcher">
          <button className={`role-btn ${role === 'Job Seeker' ? 'active' : ''}`} onClick={() => handleRoleToggle('Job Seeker')}>
            Job Seeker
          </button>
          <button className={`role-btn ${role === 'HR Manager' ? 'active' : ''}`} onClick={() => handleRoleToggle('HR Manager')}>
            HR Manager
          </button>
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
          <Bell size={20}/>
          <span className="topbar-badge-dot"/>
        </button>

        {/* User Profile */}
        <div className="topbar-user" onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative' }}>
          <img src={userProfile.avatar} alt={userProfile.name} className="topbar-avatar"/>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{userProfile.name}</span>
            <span className="topbar-user-role">{role}</span>
          </div>
          <ChevronDown size={14} color="#64748b"/>

          {showDropdown && (<div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '180px',
                backgroundColor: 'var(--color-bg-container)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 100,
                overflow: 'hidden',
            }}>
              <div onClick={() => {
                navigate('/profile');
                setShowDropdown(false);
            }} style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid var(--color-border-light)',
            }}>
                <span>View Profile</span>
              </div>
              <div onClick={() => {
                logout();
                navigate('/signin');
                setShowDropdown(false);
            }} style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <LogOut size={14}/>
                <span>Sign Out</span>
              </div>
            </div>)}
        </div>
      </div>
    </header>);
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Bell, Shield } from 'lucide-react';
import '../styles/jobs.css';
export const SettingsPage = () => {
    const { addToast } = useApp();
    return (<div className="jobs-page">
      <div className="jobs-page-header">
        <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={24} color="var(--color-primary)"/>
          Settings
        </h1>
      </div>

      <div className="card-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18}/>
            Email & Job Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#4648d4' }}/>
              Instant email alert on 90%+ AI job match
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#4648d4' }}/>
              Weekly application progress digest
            </label>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18}/>
            Privacy & Profile Visibility
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#4648d4' }}/>
              Make profile discoverable to verified tech recruiters
            </label>
          </div>
        </div>

        <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => addToast('Settings saved successfully', 'success')}>
          Save Preferences
        </button>
      </div>
    </div>);
};

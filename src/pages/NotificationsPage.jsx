import React from 'react';
import { Bell, Sparkles, Calendar, FileText } from 'lucide-react';
import '../styles/jobs.css';
export const NotificationsPage = () => {
    const notifications = [
        { id: '1', title: 'New AI Match Alert', desc: 'Google posted Senior Frontend Engineer (98% Match)', time: '10m ago', icon: Sparkles },
        { id: '2', title: 'Interview Scheduled', desc: 'Round 2 Technical Interview confirmed for Oct 24, 09:30 AM', time: '1h ago', icon: Calendar },
        { id: '3', title: 'Application Status Update', desc: 'Microsoft moved your AI/ML application to Interview stage', time: '1d ago', icon: FileText },
    ];
    return (<div className="jobs-page">
      <div className="jobs-page-header">
        <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={24} color="var(--color-primary)"/>
          Notifications
        </h1>
      </div>

      <div className="card-container" style={{ padding: 0 }}>
        {(notifications || []).map((n) => {
            const Icon = n.icon;
            return (<div key={n.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--color-border-light)',
                }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#eef2ff', color: '#4648d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{n.desc}</div>
              </div>
              <span style={{ fontSize: '0.775rem', color: 'var(--color-text-subtle)' }}>{n.time}</span>
            </div>);
        })}
      </div>
    </div>);
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, XCircle, UserCheck, } from 'lucide-react';
import '../styles/applications.css';
export const ApplicationsPage = () => {
    const { role, applications, candidates, updateCandidateStatus, addToast } = useApp();
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Applied', 'In Review', 'Interview', 'Offer', 'Rejected'];
    const filteredApps = applications.filter((app) => {
        if (activeTab === 'All')
            return true;
        return app.status === activeTab;
    });
    return (<div className="applications-page">
      {role === 'Job Seeker' ? (<>
          <div className="apps-header-row">
            <div>
              <h1 className="apps-page-title">My Applications</h1>
              <p className="apps-page-sub">Track and manage your job applications</p>
            </div>
          </div>

          <div className="apps-tabs-bar">
            {tabs.map((tab) => (<button key={tab} className={`app-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>))}
          </div>

          <div className="apps-list-card">
            {filteredApps.map((app) => (<div key={app.id} className="app-item-row">
                <div className="app-item-info">
                  <img src={app.companyLogo} alt={app.company} className="app-company-logo"/>
                  <div>
                    <div className="app-item-title">{app.jobTitle}</div>
                    <div className="app-item-company">
                      {app.company} • Applied on {app.appliedDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className="job-salary">{app.salary}</span>
                  <span className={`app-status-badge ${app.status === 'In Review'
                    ? 'in-review'
                    : app.status === 'Interview'
                        ? 'interview'
                        : 'applied'}`}>
                    {app.status}
                  </span>
                </div>
              </div>))}
          </div>
        </>) : (
        /* Recruiter HR Candidate Ranking View */
        <>
          <div className="apps-header-row">
            <div>
              <h1 className="apps-page-title">Senior Frontend Engineer</h1>
              <p className="apps-page-sub">42 Candidates Applied • 5 New AI Screened Matches</p>
            </div>
            <button className="btn-primary" onClick={() => addToast('AI Pipeline refresh triggered', 'info')}>
              <Sparkles size={16}/>
              <span>Refresh AI Ranking</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(candidates || []).map((cand, idx) => (<div key={cand.id} className={`top-candidate-card ${idx === 0 ? 'top-match' : ''}`}>
                {idx === 0 && (<span className="top-candidate-badge">
                    RANK 1ST • TOP AI MATCH
                  </span>)}

                <div className="candidate-body">
                  <div className="candidate-match-circle">
                    <span>{cand.aiMatchScore || cand.matchScore || 90}%</span>
                    <span className="candidate-match-label">MATCH</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="candidate-name">{cand.name}</div>
                    <div className="candidate-sub">
                      {cand.title || cand.role} • {cand.experience || `${cand.experienceYears} yrs exp`} • {cand.location || 'Remote'}
                    </div>

                    <div className="job-skills-list" style={{ marginBottom: '16px' }}>
                      {(cand.keySkills || cand.skills || []).map((skill) => (<span key={skill} className="tag-skill">
                          {skill}
                        </span>))}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                      <strong>AI Summary:</strong> {cand.summary || cand.previousNotes || 'Top tier technical candidate.'}
                    </div>

                    <div className="candidate-actions-row">
                      <button className="btn-primary" onClick={() => {
                    updateCandidateStatus(cand.id, 'Interviewed');
                    addToast(`Interview invitation sent to ${cand.name}`, 'success');
                }}>
                        <Calendar size={16}/>
                        <span>Schedule Interview</span>
                      </button>

                      <button className="btn-outline" onClick={() => {
                    updateCandidateStatus(cand.id, 'Shortlisted');
                    addToast(`${cand.name} shortlisted`, 'info');
                }}>
                        <UserCheck size={16}/>
                        <span>Shortlist</span>
                      </button>

                      <button className="btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => {
                    updateCandidateStatus(cand.id, 'Rejected');
                    addToast(`${cand.name} status updated to Rejected`, 'info');
                }}>
                        <XCircle size={16}/>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>))}
          </div>
        </>)}
    </div>);
};

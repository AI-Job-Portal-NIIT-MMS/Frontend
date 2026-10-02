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
            {filteredApps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                No job applications found. Explore open roles and submit your application!
              </div>
            ) : (
              filteredApps.map((app) => (<div key={app.id} className="app-item-row">
                <div className="app-item-info">
                  <img src={app.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&fit=crop'} alt={app.company} className="app-company-logo"/>
                  <div>
                    <div className="app-item-title">{app.jobTitle}</div>
                    <div className="app-item-company">
                      {app.company} • Applied on {app.appliedDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className="job-salary">{app.salary}</span>
                  <span className={`app-status-badge ${app.status === 'In Review' || app.status === 'REVIEWING'
                    ? 'in-review'
                    : app.status === 'Interview' || app.status === 'INTERVIEW_SCHEDULED'
                        ? 'interview'
                        : app.status === 'REJECTED' ? 'rejected' : 'applied'}`}>
                    {app.status}
                  </span>
                </div>
              </div>))
            )}
          </div>
        </>) : (
        /* Recruiter HR Candidate Ranking View */
        <>
          <div className="apps-header-row">
            <div>
              <h1 className="apps-page-title">Candidate Pipeline</h1>
              <p className="apps-page-sub">
                {candidates.length} Candidate{candidates.length === 1 ? '' : 's'} Applied • AI Screened & Ranked
              </p>
            </div>
            <button className="btn-primary" onClick={() => addToast('AI Pipeline refreshed', 'info')}>
              <Sparkles size={16}/>
              <span>Refresh AI Ranking</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {candidates.length === 0 ? (
              <div className="card-container" style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>No candidate applications received yet for your company job posts.</p>
              </div>
            ) : (
              (candidates || []).map((cand, idx) => (<div key={cand.id} className={`top-candidate-card ${idx === 0 ? 'top-match' : ''}`}>
                {idx === 0 && (<span className="top-candidate-badge">
                    RANK 1ST • TOP AI MATCH
                  </span>)}

                <div className="candidate-body">
                  <div className="candidate-match-circle">
                    <span>{cand.aiMatchScore || cand.matchScore || 88}%</span>
                    <span className="candidate-match-label">MATCH</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="candidate-name">{cand.name || cand.candidateName}</div>
                    <div className="candidate-sub">
                      {cand.title || cand.jobTitle || 'Applicant'} • {cand.location || 'Remote'}
                    </div>

                    <div className="job-skills-list" style={{ marginBottom: '16px' }}>
                      {(cand.keySkills || cand.skills || ['React', 'JavaScript', 'Spring Boot']).map((skill) => (<span key={skill} className="tag-skill">
                          {typeof skill === 'string' ? skill : (skill.name || skill.skillName)}
                        </span>))}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                      <strong>AI Summary:</strong> {cand.summary || cand.previousNotes || 'Applicant profile under evaluation.'}
                    </div>

                    <div className="candidate-actions-row">
                      <button className="btn-primary" onClick={() => {
                        updateCandidateStatus(cand.id, 'INTERVIEW_SCHEDULED');
                        addToast(`Interview invitation sent to ${cand.name || cand.candidateName}`, 'success');
                      }}>
                        <Calendar size={16}/>
                        <span>Schedule Interview</span>
                      </button>

                      <button className="btn-outline" onClick={() => {
                        updateCandidateStatus(cand.id, 'SHORTLISTED');
                        addToast(`${cand.name || cand.candidateName} shortlisted`, 'info');
                      }}>
                        <UserCheck size={16}/>
                        <span>Shortlist</span>
                      </button>

                      <button className="btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => {
                        updateCandidateStatus(cand.id, 'REJECTED');
                        addToast(`${cand.name || cand.candidateName} status updated to Rejected`, 'info');
                      }}>
                        <XCircle size={16}/>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>))
            )}
          </div>
        </>)}
    </div>);
};

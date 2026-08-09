import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Video, Sparkles, MessageSquare, Plus, } from 'lucide-react';
import '../styles/interviews.css';
export const InterviewsPage = () => {
    const { interviews, addToast } = useApp();
    const [selectedInterview, setSelectedInterview] = useState(interviews[0]);
    return (<div className="interviews-page">
      <div className="interviews-header-row">
        <div>
          <h1 className="apps-page-title">Interviews</h1>
          <p className="apps-page-sub">Manage your upcoming technical screenings and final rounds</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => addToast('Calendar synced', 'info')}>
            <CalendarIcon size={16}/>
            <span>View Calendar</span>
          </button>
          <button className="btn-primary" onClick={() => addToast('Schedule interview modal opened', 'success')}>
            <Plus size={16}/>
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      <div className="interviews-grid">
        {/* Left Column Timeline List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Upcoming Schedule</h2>

          {(interviews || []).map((item) => (<div key={item.id} className="interview-card-item" onClick={() => setSelectedInterview(item)} style={{
                cursor: 'pointer',
                borderColor: selectedInterview?.id === item.id ? 'var(--color-primary)' : 'var(--color-border)',
            }}>
              <div className="time-box">
                <span className="time-val">{item.time}</span>
                <span className="time-dur">{item.duration}</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {item.candidateName}
                  </span>
                  <span className="badge-match" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                    <Sparkles size={10}/> {item.aiMatchScore || item.matchScore || 90}% Match
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  {item.jobTitle || item.roleTitle} • {item.stage || item.type}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={(e) => {
                e.stopPropagation();
                addToast(`Joining virtual meeting with ${item.candidateName}`, 'success');
            }}>
                    <Video size={14}/>
                    <span>Join Meeting</span>
                  </button>

                  <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={(e) => {
                e.stopPropagation();
                addToast(`Notes opened for ${item.candidateName}`, 'info');
            }}>
                    <MessageSquare size={14}/>
                    <span>Add Notes</span>
                  </button>
                </div>
              </div>
            </div>))}
        </div>

        {/* Right Column Candidate Spotlight Card */}
        {selectedInterview && (<div className="candidate-upcoming-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Interview Candidate Spotlight
            </h3>

            <div className="cand-profile-row">
              <img src={selectedInterview.candidateAvatar || selectedInterview.avatar} alt={selectedInterview.candidateName} className="cand-avatar"/>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedInterview.candidateName}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Applying for {selectedInterview.jobTitle || selectedInterview.roleTitle}
                </p>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Round & Type</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {selectedInterview.stage || selectedInterview.type} ({selectedInterview.duration})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Meeting Link</div>
              <a href={selectedInterview.meetingLink || 'https://meet.google.com/abc-defg-hij'} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', wordBreak: 'break-all' }}>
                {selectedInterview.meetingLink || 'https://meet.google.com/abc-defg-hij'}
              </a>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Round 1 Feedback</div>
              <div className="notes-quote-box">"{selectedInterview.notes}"</div>
            </div>

            <button className="btn-primary" onClick={() => addToast(`Opening profile for ${selectedInterview.candidateName}`, 'info')}>
              View Full Application
            </button>
          </div>)}
      </div>
    </div>);
};

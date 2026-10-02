import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Bookmark, Sparkles, CheckCircle2, Briefcase, MapPin, Clock, Award, } from 'lucide-react';
import '../styles/jobs.css';
export const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs, toggleSaveJob, applyToJob } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const job = jobs.find((j) => String(j.id) === String(id)) || jobs[0];

    if (!job) {
      return (
        <div className="job-detail-page">
          <div className="back-link-bar">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18}/>
              <span>Back to Jobs</span>
            </button>
          </div>
          <div className="card-container" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
            <h2>Job Not Found</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>The requested job listing is unavailable or has expired.</p>
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/jobs')}>
              Browse All Jobs
            </button>
          </div>
        </div>
      );
    }

    const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : 'Company');
    const logoUrl = job.company?.logoUrl || job.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&fit=crop';
    const locationStr = job.location || [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Remote';
    const typeStr = job.type || (job.jobType ? String(job.jobType).replace(/_/g, ' ') : 'Full Time');
    const salaryStr = job.salary || (job.minSalary && job.maxSalary ? `$${Number(job.minSalary).toLocaleString()} - $${Number(job.maxSalary).toLocaleString()}/yr` : 'Competitive');
    const scoreVal = job.matchScore || job.aiScore || 88;

    return (<div className="job-detail-page">
      <div className="back-link-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18}/>
          <span>Back to Jobs</span>
        </button>
      </div>

      {/* Header Banner Card */}
      <div className="job-detail-header-card">
        <div className="job-detail-main-info">
          <img src={logoUrl} alt={companyName} className="job-detail-logo"/>
          <div style={{ flex: 1 }}>
            <h1 className="job-detail-heading">{job.title}</h1>
            <div className="job-detail-sub">
              <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{companyName}</span>
              <span>•</span>
              <span>{locationStr}</span>
              <span>•</span>
              <span>{typeStr}</span>
            </div>

            <div className="job-detail-salary-row">
              <span className="job-detail-salary-amount">{salaryStr}</span>
              <div className="badge-match">
                <Sparkles size={12}/>
                <span>{scoreVal}% AI Match</span>
              </div>
            </div>
          </div>

          <div className="job-detail-actions">
            <button className="btn-outline" onClick={() => toggleSaveJob(job.id)}>
              <Bookmark size={18} fill={job.saved ? 'currentColor' : 'none'}/>
              <span>{job.saved ? 'Saved' : 'Save Job'}</span>
            </button>
            <button className={`btn-${job.applied ? 'secondary' : 'primary'}`} onClick={() => applyToJob(job.id)} style={{ padding: '12px 24px' }}>
              {job.applied ? (<>
                  <CheckCircle2 size={18}/>
                  <span>Applied</span>
                </>) : ('Apply Now')}
            </button>
          </div>
        </div>
      </div>

      {/* Detail Body Content */}
      <div className="job-detail-content-card">
        <div className="job-tabs-header">
          <button className={`job-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`job-tab-btn ${activeTab === 'requirements' ? 'active' : ''}`} onClick={() => setActiveTab('requirements')}>
            Requirements
          </button>
          <button className={`job-tab-btn ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
            About Company
          </button>
          <button className={`job-tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            AI Match Insights
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 className="detail-section-title">About the Role</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="detail-section-title">Key Responsibilities</h3>
              <ul className="detail-bullet-list">
                {(job.responsibilities || job.requirements || []).map((resp, idx) => (<li key={idx}>{resp}</li>))}
              </ul>
            </div>

            <div>
              <h3 className="detail-section-title">Required Qualifications</h3>
              <ul className="detail-bullet-list">
                {(job.requirements || []).map((req, idx) => (<li key={idx}>{req}</li>))}
              </ul>
            </div>

            <div>
              <h3 className="detail-section-title">Required Skills</h3>
              <div className="job-skills-list" style={{ marginTop: '8px' }}>
                {(job.skills || []).map((s, idx) => (<span key={idx} className="tag-skill" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                    {s}
                  </span>))}
              </div>
            </div>

            <div className="meta-info-grid">
              <div className="meta-info-item">
                <Award size={20} className="meta-info-icon"/>
                <div>
                  <div className="meta-info-label">Experience</div>
                  <div className="meta-info-value">{job.experience}</div>
                </div>
              </div>

              <div className="meta-info-item">
                <Briefcase size={20} className="meta-info-icon"/>
                <div>
                  <div className="meta-info-label">Employment Type</div>
                  <div className="meta-info-value">{job.type}</div>
                </div>
              </div>

              <div className="meta-info-item">
                <MapPin size={20} className="meta-info-icon"/>
                <div>
                  <div className="meta-info-label">Location</div>
                  <div className="meta-info-value">{job.location}</div>
                </div>
              </div>

              <div className="meta-info-item">
                <Clock size={20} className="meta-info-icon"/>
                <div>
                  <div className="meta-info-label">Posted Date</div>
                  <div className="meta-info-value">{job.postedDate}</div>
                </div>
              </div>
            </div>
          </div>)}

        {activeTab === 'requirements' && (<div>
            <h3 className="detail-section-title">Full Requirement Details</h3>
            <ul className="detail-bullet-list">
              {(job.requirements || []).map((req, idx) => (<li key={idx}>{req}</li>))}
            </ul>
          </div>)}

        {activeTab === 'company' && (<div>
            <h3 className="detail-section-title">About {job.company}</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              {job.company} is a leading technology organization pioneering modern software and AI solutions. With offices globally, they foster an innovative and inclusive working culture.
            </p>
          </div>)}

        {activeTab === 'ai' && (<div style={{ backgroundColor: '#f5f7ff', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border-accent)' }}>
            <h3 className="detail-section-title" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20}/>
              AI Match Analysis for {job.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.925rem' }}>
              Your profile matches {job.matchScore}% with this role based on your experience with React, TypeScript, and architectural patterns.
            </p>
            <div className="skills-list-container">
              {(job.skills || []).map((skill) => (<div key={skill} className="skill-bar-item">
                  <div className="skill-bar-header">
                    <span>{skill}</span>
                    <span className="skill-bar-percentage">High Match</span>
                  </div>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill" style={{ width: '92%' }}/>
                  </div>
                </div>))}
            </div>
          </div>)}
      </div>
    </div>);
};

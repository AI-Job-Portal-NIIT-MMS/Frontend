import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import '../styles/jobs.css';
export const JobCard = ({ job }) => {
    const { toggleSaveJob, applyToJob } = useApp();
    if (!job) return null;

    const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : 'Company');
    const logoUrl = job.company?.logoUrl || job.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&fit=crop';
    const locationStr = job.location || [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Remote';
    const typeStr = job.type || (job.jobType ? String(job.jobType).replace(/_/g, ' ') : 'Full Time');
    const salaryStr = job.salary || (job.minSalary && job.maxSalary ? `$${Number(job.minSalary).toLocaleString()} - $${Number(job.maxSalary).toLocaleString()}/yr` : 'Competitive');
    const scoreVal = job.matchScore || job.aiScore || 88;

    return (<div className="job-card">
      <div className="job-card-top">
        <div className="job-company-info">
          <img src={logoUrl} alt={companyName} className="job-logo"/>
          <div className="job-title-group">
            <Link to={`/job/${job.id}`} className="job-card-title">
              {job.title}
            </Link>
            <div className="job-meta-line">
              {companyName} • {locationStr} • {typeStr}
            </div>
          </div>
        </div>

        <div className="job-card-actions">
          <div className="badge-match">
            <Sparkles size={12}/>
            <span>{scoreVal}% Match</span>
          </div>
          <button className={`job-bookmark-btn ${job.saved ? 'saved' : ''}`} onClick={() => toggleSaveJob(job.id)} aria-label="Bookmark Job">
            <Bookmark size={18} fill={job.saved ? 'currentColor' : 'none'}/>
          </button>
        </div>
      </div>

      <div className="job-card-bottom">
        <div className="job-skills-list">
          {(job.skills || []).map((skill, index) => (<span key={index} className="tag-skill">
              {skill}
            </span>))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="job-salary">{job.salary}</span>
          <button className={`btn-${job.applied ? 'secondary' : 'primary'}`} style={{ padding: '7px 16px', fontSize: '0.85rem' }} onClick={() => applyToJob(job.id)}>
            {job.applied ? (<>
                <CheckCircle2 size={14}/>
                <span>Applied</span>
              </>) : ('Apply Now')}
          </button>
        </div>
      </div>
    </div>);
};

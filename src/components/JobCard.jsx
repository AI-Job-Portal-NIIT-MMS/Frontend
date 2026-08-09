import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import '../styles/jobs.css';
export const JobCard = ({ job }) => {
    const { toggleSaveJob, applyToJob } = useApp();
    return (<div className="job-card">
      <div className="job-card-top">
        <div className="job-company-info">
          <img src={job.logo} alt={job.company} className="job-logo"/>
          <div className="job-title-group">
            <Link to={`/job/${job.id}`} className="job-card-title">
              {job.title}
            </Link>
            <div className="job-meta-line">
              {job.company} • {job.location} • {job.type}
            </div>
          </div>
        </div>

        <div className="job-card-actions">
          <div className="badge-match">
            <Sparkles size={12}/>
            <span>{job.matchScore}% Match</span>
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

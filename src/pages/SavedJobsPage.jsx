import React from 'react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { Bookmark } from 'lucide-react';
import '../styles/jobs.css';
export const SavedJobsPage = () => {
    const { jobs } = useApp();
    const savedJobs = (jobs || []).filter((j) => j?.saved);
    return (<div className="jobs-page">
      <div className="jobs-page-header">
        <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bookmark size={24} color="var(--color-primary)"/>
          Saved Jobs
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Review and quickly apply to jobs you saved for later.
        </p>
      </div>

      <div>
        {savedJobs.length > 0 ? (savedJobs.map((job) => <JobCard key={job.id} job={job}/>)) : (<div className="card-container" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              You haven't saved any jobs yet. Bookmark jobs while browsing to see them here!
            </p>
          </div>)}
      </div>
    </div>);
};

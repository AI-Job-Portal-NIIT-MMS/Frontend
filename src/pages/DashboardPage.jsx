import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { motion } from 'motion/react';
import { FileText, CheckCircle2, Bookmark, Sparkles, TrendingUp, Rocket, } from 'lucide-react';
import '../styles/dashboard.css';
export const DashboardPage = () => {
    const { jobs, applications, interviews } = useApp();
    const navigate = useNavigate();
    const titleText = "Find Your Dream Job With AI Power";

    const applicationsCount = applications?.length || 0;
    const interviewsCount = interviews?.length || 0;
    const savedJobsCount = (jobs || []).filter(j => j.saved).length;
    const avgMatchScore = (jobs && jobs.length > 0)
      ? Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 85), 0) / jobs.length)
      : 0;

    return (<div className="dashboard-grid">
      {/* Hero Banner Card */}
      <motion.div className="dash-hero-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div>
          <motion.span className="ai-powered-pill" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
            AI POWERED
          </motion.span>
          <motion.h1 className="dash-hero-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span>{titleText}</span>
            <motion.span animate={{ rotate: [0, 15, -10, 15, 0], y: [0, -4, 0] }} transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }} style={{ display: 'inline-flex', color: '#f59e0b' }}>
              <Rocket size={28}/>
            </motion.span>
          </motion.h1>
          <motion.p className="dash-hero-desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            Smart matching, AI insights and personalized recommendations to accelerate your career.
          </motion.p>
          <motion.div className="dash-hero-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <button className="btn-primary" onClick={() => navigate('/jobs')}>
              Find Jobs
            </button>
            <button className="btn-secondary" onClick={() => navigate('/ai-match')}>
              AI Job Match
            </button>
          </motion.div>
        </div>

        <motion.div className="dash-hero-image-wrapper" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&fit=crop" alt="AI Assistant Insights" className="dash-hero-illustration"/>
        </motion.div>
      </motion.div>

      {/* 4 Stats Cards */}
      <motion.div className="dash-stats-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <motion.div className="stat-card" onClick={() => navigate('/applications')} style={{ cursor: 'pointer' }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
          <div className="stat-icon-wrapper blue">
            <FileText size={22}/>
          </div>
          <div className="stat-info">
            <motion.span className="stat-number" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {applicationsCount}
            </motion.span>
            <span className="stat-label">Applications</span>
            <span className="stat-growth">
              <TrendingUp size={12}/> {applicationsCount > 0 ? `${applicationsCount} active` : 'Active tracking'}
            </span>
          </div>
        </motion.div>

        <motion.div className="stat-card" onClick={() => navigate('/interviews')} style={{ cursor: 'pointer' }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
          <div className="stat-icon-wrapper purple">
            <CheckCircle2 size={22}/>
          </div>
          <div className="stat-info">
            <motion.span className="stat-number" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {interviewsCount}
            </motion.span>
            <span className="stat-label">Interviews</span>
            <span className="stat-growth">
              <TrendingUp size={12}/> {interviewsCount > 0 ? `${interviewsCount} scheduled` : 'Ready to interview'}
            </span>
          </div>
        </motion.div>

        <motion.div className="stat-card" onClick={() => navigate('/saved-jobs')} style={{ cursor: 'pointer' }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
          <div className="stat-icon-wrapper indigo">
            <Bookmark size={22}/>
          </div>
          <div className="stat-info">
            <motion.span className="stat-number" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {savedJobsCount}
            </motion.span>
            <span className="stat-label">Saved Jobs</span>
            <span className="stat-growth">
              <TrendingUp size={12}/> {savedJobsCount > 0 ? `${savedJobsCount} saved` : 'Bookmarked'}
            </span>
          </div>
        </motion.div>

        <motion.div className="stat-card" onClick={() => navigate('/ai-match')} style={{ cursor: 'pointer' }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
          <div className="stat-icon-wrapper match">
            <Sparkles size={22}/>
          </div>
          <div className="stat-info">
            <motion.span className="stat-number" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {avgMatchScore > 0 ? `${avgMatchScore}%` : 'N/A'}
            </motion.span>
            <span className="stat-label">AI Match Score</span>
            <span className="stat-growth purple-text">
              {avgMatchScore >= 80 ? 'Excellent Match' : 'Calculated by AI'}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recommendations Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <Sparkles size={18}/>
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              AI Job Recommendations
            </motion.span>
          </div>
          <Link to="/jobs" className="view-all-link">
            View all
          </Link>
        </div>

        <div className="recommendations-list">
          {(jobs || []).slice(0, 3).map((job) => (<JobCard key={job.id} job={job}/>))}
        </div>
      </motion.div>
    </div>);
};

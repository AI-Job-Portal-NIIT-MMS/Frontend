import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { Search, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import '../styles/jobs.css';
export const JobsPage = () => {
    const { jobs } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query') || '';
    const locationParam = searchParams.get('location') || '';
    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [locationQuery, setLocationQuery] = useState(locationParam);
    const [activeCategory, setActiveCategory] = useState('All Jobs');
    const [currentPage, setCurrentPage] = useState(1);
    const categories = ['All Jobs', 'Technology', 'Design', 'Marketing', 'Data Science', 'Sales'];
    const filteredJobs = jobs.filter((job) => {
        const matchesQuery = !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLocation = !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All Jobs' || job.category === activeCategory;
        return matchesQuery && matchesLocation && matchesCategory;
    });
    return (<div className="jobs-page">
      <motion.div className="jobs-page-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <motion.h1 className="jobs-page-title" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          Find Jobs
        </motion.h1>

        <div className="jobs-filter-bar">
          <div className="jobs-search-input-group">
            <Search size={18}/>
            <input type="text" placeholder="Job title, keyword or company" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>

          <div className="jobs-search-input-group">
            <MapPin size={18}/>
            <input type="text" placeholder="Location" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)}/>
          </div>

          <button className="btn-outline" style={{ padding: '10px 14px' }}>
            <SlidersHorizontal size={18}/>
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map((cat) => (<button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>))}
        </div>

        {/* Results Header */}
        <div className="jobs-results-header">
          <motion.span key={filteredJobs.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {filteredJobs.length} jobs found
          </motion.span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Most Relevant</span>
            <ChevronDown size={14}/>
          </div>
        </div>
      </motion.div>

      {/* Job Cards */}
      <div>
        {filteredJobs.length > 0 ? (filteredJobs.map((job) => <JobCard key={job.id} job={job}/>)) : (<div className="card-container" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No jobs found matching your search criteria.</p>
          </div>)}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        {[1, 2, 3, 4].map((page) => (<button key={page} className={`page-num-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
            {page}
          </button>))}
        <span style={{ color: 'var(--color-text-subtle)', padding: '0 4px' }}>...</span>
        <button className="page-num-btn" onClick={() => setCurrentPage(20)}>
          20
        </button>
        <button className="page-num-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, 20))}>
          &gt;
        </button>
      </div>
    </div>);
};

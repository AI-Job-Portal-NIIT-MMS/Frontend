import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';
import '../styles/post-job.css';
export const PostJobPage = () => {
    const { addJob, addToast } = useApp();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('TechCorp Solutions');
    const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
    const [category, setCategory] = useState('Technology');
    const [salaryMin, setSalaryMin] = useState('120k');
    const [salaryMax, setSalaryMax] = useState('160k');
    const [description, setDescription] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js', 'Tailwind CSS']);
    const handleAddSkill = (e) => {
        if ('key' in e && e.key !== 'Enter')
            return;
        e.preventDefault();
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput('');
        }
    };
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description) {
            addToast('Please fill out all required fields', 'error');
            return;
        }
        addJob({
            title,
            company,
            logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
            location,
            type: 'Full-time',
            category,
            salary: `$${salaryMin} - $${salaryMax}`,
            description,
            matchScore: 95,
            skills,
            responsibilities: [
                'Architect and maintain scalable user interfaces.',
                'Collaborate closely with product designers and backend engineers.',
                'Optimize application performance and load times.',
            ],
            requirements: [
                '5+ years of software engineering experience.',
                'Strong proficiency in modern JavaScript/TypeScript and frameworks.',
            ],
            experience: '5+ years',
            postedDate: 'Just now',
        });
        addToast('Job post created successfully!', 'success');
        navigate('/jobs');
    };
    return (<div className="post-job-page">
      <div className="post-job-header">
        <h1 className="post-job-title">Create New Job Post</h1>
        <p className="post-job-sub">
          Let AI help you find the perfect candidate by defining smart match criteria.
        </p>
      </div>

      <form className="post-job-grid" onSubmit={handleSubmit}>
        <div className="post-form-left">
          {/* Job Details Card */}
          <div className="post-card">
            <h2 className="post-card-title">Basic Information</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" className="post-input" placeholder="e.g. Senior Frontend Engineer" value={title} onChange={(e) => setTitle(e.target.value)} required/>
              </div>

              <div className="post-input-grid">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="post-input" value={company} onChange={(e) => setCompany(e.target.value)} required/>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="post-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
              </div>

              <div className="post-input-grid">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="post-input" placeholder="e.g. San Francisco, CA (Remote)" value={location} onChange={(e) => setLocation(e.target.value)} required/>
                </div>

                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="text" className="post-input" placeholder="$120k" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)}/>
                    <span>to</span>
                    <input type="text" className="post-input" placeholder="$160k" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="post-card">
            <h2 className="post-card-title">Job Description</h2>
            <textarea className="post-textarea" rows={6} placeholder="Describe the job position, team culture, and expectations..." value={description} onChange={(e) => setDescription(e.target.value)} required/>
          </div>
        </div>

        {/* Right Side AI Criteria */}
        <div className="post-form-right">
          <div className="ai-criteria-card">
            <h2 className="post-card-title" style={{ color: 'var(--color-primary)' }}>
              <Sparkles size={18}/>
              AI Match Criteria
            </h2>
            <p className="ai-criteria-desc">
              Specify skills and required keywords. AI Power will auto-score candidates against these criteria.
            </p>

            <div className="form-group">
              <label className="form-label">Add Required Skill</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="post-input" placeholder="e.g. Next.js" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill}/>
                <button type="button" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleAddSkill}>
                  Add
                </button>
              </div>

              <div className="skills-pill-group">
                {skills.map((skill) => (<span key={skill} className="active-skill-pill">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)}>
                      <X size={12}/>
                    </button>
                  </span>))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '1rem' }}>
              <CheckCircle2 size={18}/>
              <span>Publish Job Post</span>
            </button>
            <button type="button" className="btn-outline" style={{ padding: '12px' }} onClick={() => {
            addToast('Draft saved', 'info');
            navigate('/jobs');
        }}>
              Save as Draft
            </button>
          </div>
        </div>
      </form>
    </div>);
};

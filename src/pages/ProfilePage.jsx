import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, MapPin, FileCheck, Edit2, Sparkles, } from 'lucide-react';
import '../styles/profile.css';
export const ProfilePage = () => {
    const { userProfile, applications, interviews, jobs, addSkill, addToast } = useApp();
    const [newSkillInput, setNewSkillInput] = useState('');
    const [showSkillInput, setShowSkillInput] = useState(false);

    const applicationsCount = applications?.length || 0;
    const interviewsCount = interviews?.length || 0;
    const savedJobsCount = (jobs || []).filter(j => j.saved).length;
    const avgMatchScore = (jobs && jobs.length > 0)
      ? Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 85), 0) / jobs.length)
      : 0;

    const displayName = userProfile?.fullName || userProfile?.name || 'User Profile';
    const displayTitle = userProfile?.jobTitle || userProfile?.title || (userProfile?.role === 'ROLE_EMPLOYER' ? 'Hiring Manager' : 'Software Professional');
    const displayAvatar = userProfile?.profileImage || userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop';
    const displayLocation = userProfile?.location || 'Remote';
    const displayBio = userProfile?.bio || 'Professional actively building and exploring career opportunities.';
    const skillsList = Array.isArray(userProfile?.skills) ? userProfile.skills : [];

    const handleAddSkillSubmit = (e) => {
        e.preventDefault();
        if (newSkillInput.trim()) {
            addSkill(newSkillInput.trim());
            setNewSkillInput('');
            setShowSkillInput(false);
            addToast(`Added skill "${newSkillInput.trim()}"`, 'success');
        }
    };
    return (<div className="profile-page">
      <h1 className="profile-page-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-header-row">
          <div className="profile-user-group">
            <div className="profile-avatar-wrapper">
              <img src={displayAvatar} alt={displayName} className="profile-avatar-img"/>
              <button className="profile-camera-btn" onClick={() => addToast('Upload photo triggered', 'info')} title="Change Photo">
                <Camera size={14}/>
              </button>
            </div>

            <div>
              <div className="profile-user-name">{displayName}</div>
              <div className="profile-user-role">{displayTitle}</div>

              <div className="profile-user-location">
                <span>
                  <MapPin size={14} style={{ display: 'inline', marginRight: 4 }}/>
                  {displayLocation}
                </span>
                <span>•</span>
                <span className="open-to-work-badge">Open to work</span>
              </div>
            </div>
          </div>

          <button className="btn-outline" onClick={() => addToast('Edit profile modal opened', 'info')}>
            <Edit2 size={16}/>
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Stats Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <span className="profile-stat-val">{applicationsCount}</span>
            <span className="profile-stat-lbl">Applications</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val">{interviewsCount}</span>
            <span className="profile-stat-lbl">Interviews</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val" style={{ color: 'var(--color-primary)' }}>
              {avgMatchScore > 0 ? `${avgMatchScore}%` : 'N/A'}
            </span>
            <span className="profile-stat-lbl">AI Match Score</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val">{savedJobsCount}</span>
            <span className="profile-stat-lbl">Saved Jobs</span>
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>About Me</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.925rem' }}>
            {displayBio}
          </p>
        </div>

        {/* Skills Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--color-primary)"/>
              Skills & Proficiencies
            </h3>

            {!showSkillInput && (<button className="skills-add-btn" onClick={() => setShowSkillInput(true)}>
                + Add Skill
              </button>)}
          </div>

          {showSkillInput && (<form onSubmit={handleAddSkillSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="Enter skill name (e.g. Next.js, Docker)..." value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} style={{
                padding: '8px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                flex: 1,
            }} autoFocus/>
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Add
              </button>
              <button type="button" className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => setShowSkillInput(false)}>
                Cancel
              </button>
            </form>)}

          <div className="job-skills-list">
            {(skillsList.length > 0 ? skillsList : candidateSkills || []).map((sk, idx) => {
              const skillName = typeof sk === 'string' ? sk : (sk.name || sk.skillName || `Skill #${idx + 1}`);
              return (
                <span key={skillName + idx} className="tag-skill" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                  {skillName}
                </span>
              );
            })}
          </div>
        </div>

        {/* Resume Section */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Resume & Documents</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'var(--color-bg-light)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#eef2ff', color: '#4648d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={20}/>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>John_Doe_Senior_Frontend_Resume.pdf</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                  Uploaded Oct 2026 • ATS Score: 96/100
                </div>
              </div>
            </div>

            <button className="btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => addToast('Resume download started', 'success')}>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>);
};

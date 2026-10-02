import React from 'react';
import { useApp } from '../context/AppContext';
import { CircularGauge } from '../components/CircularGauge';
import { JobCard } from '../components/JobCard';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import '../styles/ai-match.css';
export const AIMatchPage = () => {
    const { jobs, candidateSkills, userProfile } = useApp();

    const skillsArray = (userProfile?.skills && userProfile.skills.length > 0)
      ? userProfile.skills
      : (candidateSkills && candidateSkills.length > 0 ? candidateSkills : ['React', 'JavaScript', 'Spring Boot', 'SQL']);

    const dynamicScore = (jobs && jobs.length > 0)
      ? Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 88), 0) / jobs.length)
      : 88;

    const formattedSkills = skillsArray.map((s, i) => {
      const name = typeof s === 'string' ? s : (s.name || s.skillName || `Skill #${i + 1}`);
      const percentage = typeof s === 'object' && s.percentage ? s.percentage : Math.max(70, 95 - (i * 6));
      return { name, percentage };
    });

    return (<div className="ai-match-page">
      <motion.div className="ai-match-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.h1 className="ai-match-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          AI Job Match
        </motion.h1>
        <motion.p className="ai-match-sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          Get personalized job matches based on your skills, experience and career goals.
        </motion.p>
      </motion.div>

      <div className="ai-match-grid">
        {/* Overall Match Gauge */}
        <motion.div className="gauge-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <CircularGauge score={dynamicScore} size={220} strokeWidth={18}/>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '700', fontSize: '0.9rem' }}>
            <TrendingUp size={16}/>
            <span>{dynamicScore >= 80 ? 'Top candidate match rate' : 'Calculated profile match rate'}</span>
          </div>
        </motion.div>

        {/* Top Matching Skills Progress */}
        <motion.div className="skills-match-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="skills-card-title">Top Matching Skills</h2>
          <div className="skills-list-container">
            {formattedSkills.map((skill, index) => (<motion.div key={skill.name} className="skill-bar-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}>
                <div className="skill-bar-header">
                  <span>{skill.name}</span>
                  <span className="skill-bar-percentage">{skill.percentage}% Match</span>
                </div>
                <div className="skill-bar-track">
                  <motion.div className="skill-bar-fill" initial={{ width: 0 }} animate={{ width: `${skill.percentage}%` }} transition={{ delay: 0.4 + index * 0.1, duration: 0.7 }}/>
                </div>
              </motion.div>))}
          </div>
        </motion.div>
      </div>

      {/* Recommended Jobs List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-primary)"/>
            Top Recommended Matches For You
          </h2>
        </div>

        <div className="recommendations-list">
          {(jobs || []).map((job) => (<JobCard key={job.id} job={job}/>))}
        </div>
      </motion.div>
    </div>);
};

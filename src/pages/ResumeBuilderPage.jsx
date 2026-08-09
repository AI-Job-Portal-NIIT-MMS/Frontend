import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import '../styles/jobs.css';
export const ResumeBuilderPage = () => {
    const { addToast } = useApp();
    const [resumeText, setResumeText] = useState(`John Doe\nSenior Frontend Engineer\nExperienced in React, TypeScript, Node.js, and leading high-performing frontend teams.`);
    const [atsScore, setAtsScore] = useState(92);
    const handleOptimize = () => {
        setAtsScore(98);
        addToast('Resume optimized with AI keywords! ATS Score updated to 98/100.', 'success');
    };
    return (<div className="jobs-page">
      <motion.div className="jobs-page-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={24} color="var(--color-primary)"/>
          AI Resume Builder & ATS Checker
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Tailor your resume specifically for top tech company ATS systems.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        <motion.div className="card-container" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Resume Content</h2>
          <textarea rows={12} value={resumeText} onChange={(e) => setResumeText(e.target.value)} style={{
            width: '100%',
            padding: '16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.925rem',
            fontFamily: 'monospace',
        }}/>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleOptimize}>
              <Sparkles size={16}/>
              <span>Optimize with AI</span>
            </button>
            <button className="btn-outline" onClick={() => addToast('PDF Downloaded', 'success')}>
              <Download size={16}/>
              <span>Export PDF</span>
            </button>
          </div>
        </motion.div>

        <motion.div className="card-container" style={{ backgroundColor: '#f5f7ff', border: '1px solid var(--color-border-accent)' }} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18}/>
            ATS Analysis Score
          </h2>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <motion.div key={atsScore} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {atsScore}/100
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
              Excellent Match for Senior Roles
            </motion.div>
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981"/> Keyword Density: Optimal
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981"/> Formatting: ATS Parseable
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981"/> Action Verbs: High Impact
            </li>
          </ul>
        </motion.div>
      </div>
    </div>);
};

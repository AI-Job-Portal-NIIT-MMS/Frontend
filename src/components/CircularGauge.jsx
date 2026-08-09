import React from 'react';
import '../styles/ai-match.css';
export const CircularGauge = ({ score = 92, size = 220, strokeWidth = 18, }) => {
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return (<div className="gauge-svg-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Arc */}
        <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#e0e2ff" strokeWidth={strokeWidth} strokeLinecap="round"/>
        {/* Foreground Progress Arc */}
        <circle cx={center} cy={center} r={radius} fill="transparent" stroke="url(#purpleGradient)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}/>
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4648d4"/>
            <stop offset="100%" stopColor="#6366f1"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="gauge-center-text">
        <span className="gauge-score-number">{score}%</span>
        <span className="gauge-score-label">OVERALL MATCH SCORE</span>
      </div>
    </div>);
};

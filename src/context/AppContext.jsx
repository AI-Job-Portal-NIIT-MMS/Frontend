import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_JOBS, INITIAL_APPLICATIONS, INITIAL_CANDIDATES, INITIAL_INTERVIEWS, USER_PROFILE } from '../data/mockData';
const AppContext = createContext(undefined);
export const AppProvider = ({ children }) => {
    const [role, setRole] = useState('Job Seeker');
    const [jobs, setJobs] = useState(INITIAL_JOBS);
    const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
    const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
    const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
    const [userProfile, setUserProfile] = useState(USER_PROFILE);
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    const [toasts, setToasts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const addToast = (text, type = 'success') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, text }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    const toggleSaveJob = (jobId) => {
        setJobs((prevJobs) => prevJobs.map((j) => {
            if (j.id === jobId) {
                const updatedSaved = !j.saved;
                addToast(updatedSaved ? `Saved "${j.title}"` : `Removed "${j.title}" from saved jobs`, 'info');
                return { ...j, saved: updatedSaved };
            }
            return j;
        }));
    };
    const applyToJob = (jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (!job)
            return;
        if (job.applied) {
            addToast(`You have already applied for ${job.title}`, 'info');
            return;
        }
        // Mark job as applied
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j)));
        // Add to applications
        const newApp = {
            id: `app-${Date.now()}`,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            companyLogo: job.logo,
            appliedDate: 'Applied Just Now',
            status: 'Applied',
            matchScore: job.matchScore,
        };
        setApplications((prev) => [newApp, ...prev]);
        addToast(`Successfully applied to ${job.company} for ${job.title}!`, 'success');
    };
    const addJobPost = (newJobData) => {
        const newJob = {
            id: `job-${Date.now()}`,
            title: newJobData.title || 'Untitled Role',
            company: newJobData.company || 'AI Power Tech',
            logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
            location: newJobData.location || 'Remote',
            type: newJobData.type || 'Full-time',
            salary: newJobData.salary || '$120k – $150k',
            matchScore: Math.floor(Math.random() * 10) + 90,
            category: newJobData.category || 'Technology',
            description: newJobData.description || 'No description provided.',
            requirements: newJobData.requirements || ['Requirements to be specified.'],
            skills: newJobData.skills || ['React', 'TypeScript'],
            experience: newJobData.experience || '2+ years',
            postedDate: 'Just now',
            saved: false,
            applied: false,
        };
        setJobs((prev) => [newJob, ...prev]);
        addToast(`New job post "${newJob.title}" created successfully!`, 'success');
    };
    const addCandidateNote = (candidateId, note) => {
        setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, previousNotes: note } : c)));
        addToast('Candidate notes updated', 'success');
    };
    const addSkillToProfile = (skill) => {
        if (!skill.trim())
            return;
        if (userProfile.skills.includes(skill.trim())) {
            addToast('Skill already exists', 'info');
            return;
        }
        setUserProfile((prev) => ({
            ...prev,
            skills: [...prev.skills, skill.trim()],
        }));
        addToast(`Added "${skill.trim()}" to profile skills`, 'success');
    };
    const login = (email) => {
        setIsAuthenticated(true);
        addToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
    };
    const logout = () => {
        setIsAuthenticated(false);
        addToast('Logged out successfully', 'info');
    };
    return (<AppContext.Provider value={{
            role,
            setRole,
            jobs,
            applications,
            candidates,
            interviews,
            userProfile,
            theme,
            toggleTheme,
            toggleSaveJob,
            applyToJob,
            addJobPost,
            addCandidateNote,
            addSkillToProfile,
            toasts,
            addToast,
            removeToast,
            isAuthenticated,
            login,
            logout,
        }}>
      {children}
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error('useApp must be used within an AppProvider');
    return context;
};

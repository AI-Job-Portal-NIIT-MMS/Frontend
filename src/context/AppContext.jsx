import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { interviewService } from '../services/interviewService';
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
    const [toasts, setToasts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Derived properties
    const candidateSkills = userProfile?.skills || ['React', 'TypeScript', 'Node.js', 'UI/UX Design', 'Tailwind CSS'];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    /**
     * Initial API Data Fetching
     */
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [fetchedJobs, fetchedApps, fetchedCandidates, fetchedInterviews, fetchedProfile] = await Promise.all([
                jobService.getJobs(),
                applicationService.getApplications(),
                applicationService.getCandidates(),
                interviewService.getInterviews(),
                userService.getProfile(),
            ]);

            if (fetchedJobs) setJobs(fetchedJobs);
            if (fetchedApps) setApplications(fetchedApps);
            if (fetchedCandidates) setCandidates(fetchedCandidates);
            if (fetchedInterviews) setInterviews(fetchedInterviews);
            if (fetchedProfile) setUserProfile(fetchedProfile);
        } catch (err) {
            console.error('[AppContext] Error loading initial API data:', err);
            setError(err.message || 'Failed to load initial data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Toast helpers
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

    /**
     * Toggle Save Job (Async API Call with local state update)
     */
    const toggleSaveJob = async (jobId) => {
        const targetJob = jobs.find((j) => j.id === jobId);
        if (!targetJob) return;

        const updatedSaved = !targetJob.saved;
        setJobs((prevJobs) => prevJobs.map((j) => (j.id === jobId ? { ...j, saved: updatedSaved } : j)));
        addToast(updatedSaved ? `Saved "${targetJob.title}"` : `Removed "${targetJob.title}" from saved jobs`, 'info');

        try {
            await jobService.toggleSaveJob(jobId, targetJob.saved);
        } catch (err) {
            console.error('Failed to sync save status with API:', err);
        }
    };

    /**
     * Apply to Job (Async API Call with local state update)
     */
    const applyToJob = async (jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;

        if (job.applied) {
            addToast(`You have already applied for ${job.title}`, 'info');
            return;
        }

        // Optimistic UI update
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j)));

        try {
            const newApp = await applicationService.applyToJob(job);
            setApplications((prev) => [newApp, ...prev]);
            addToast(`Successfully applied to ${job.company} for ${job.title}!`, 'success');
        } catch (err) {
            console.error('Failed to apply via API:', err);
            addToast(`Successfully applied to ${job.company} for ${job.title}!`, 'success');
        }
    };

    /**
     * Create New Job Post (Async API Call with local state update)
     */
    const addJobPost = async (newJobData) => {
        try {
            const createdJob = await jobService.createJob(newJobData);
            setJobs((prev) => [createdJob, ...prev]);
            addToast(`New job post "${createdJob.title}" created successfully!`, 'success');
            return createdJob;
        } catch (err) {
            console.error('Failed to create job post via API:', err);
            addToast('Created job post locally', 'info');
        }
    };

    // Alias for addJobPost
    const addJob = addJobPost;

    /**
     * Update candidate status or note
     */
    const updateCandidateStatus = async (candidateId, newStatusOrNote) => {
        setCandidates((prev) =>
            prev.map((c) =>
                c.id === candidateId
                    ? typeof newStatusOrNote === 'string'
                        ? { ...c, status: newStatusOrNote, previousNotes: newStatusOrNote }
                        : { ...c, ...newStatusOrNote }
                    : c
            )
        );

        addToast('Candidate record updated', 'success');

        try {
            await applicationService.updateCandidate(candidateId, { status: newStatusOrNote });
        } catch (err) {
            console.error('Failed to sync candidate update with API:', err);
        }
    };

    const addCandidateNote = updateCandidateStatus;

    /**
     * Add skill to user profile
     */
    const addSkillToProfile = async (skill) => {
        if (!skill || !skill.trim()) return;
        const cleanSkill = skill.trim();

        if (userProfile.skills && userProfile.skills.includes(cleanSkill)) {
            addToast('Skill already exists', 'info');
            return;
        }

        setUserProfile((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), cleanSkill],
        }));
        addToast(`Added "${cleanSkill}" to profile skills`, 'success');

        try {
            await userService.addSkill(cleanSkill);
        } catch (err) {
            console.error('Failed to save skill to API:', err);
        }
    };

    // Alias for addSkillToProfile
    const addSkill = addSkillToProfile;

    /**
     * Authentication handlers
     */
    const login = async (email, password) => {
        try {
            const res = await authService.login({ email, password, role });
            setIsAuthenticated(true);
            addToast(`Welcome back, ${email ? email.split('@')[0] : 'User'}!`, 'success');
            return res;
        } catch (err) {
            console.error('Login error:', err);
            setIsAuthenticated(true);
            addToast('Logged in successfully', 'success');
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn('Logout API warning:', err);
        } finally {
            setIsAuthenticated(false);
            addToast('Logged out successfully', 'info');
        }
    };

    return (
        <AppContext.Provider
            value={{
                role,
                setRole,
                jobs,
                setJobs,
                applications,
                setApplications,
                candidates,
                setCandidates,
                interviews,
                setInterviews,
                userProfile,
                setUserProfile,
                candidateSkills,
                loading,
                error,
                theme,
                toggleTheme,
                toggleSaveJob,
                applyToJob,
                addJobPost,
                addJob,
                updateCandidateStatus,
                addCandidateNote,
                addSkillToProfile,
                addSkill,
                toasts,
                addToast,
                removeToast,
                isAuthenticated,
                login,
                logout,
                reloadInitialData: loadInitialData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

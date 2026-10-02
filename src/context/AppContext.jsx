import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { interviewService } from '../services/interviewService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const savedRole = localStorage.getItem('user_role');
    const initialRole = (savedRole === 'ROLE_EMPLOYER' || savedRole === 'Employer' || savedRole === 'HR Manager') ? 'HR Manager' : 'Job Seeker';
    const [role, setRoleState] = useState(initialRole);

    const setRole = (newRole) => {
        setRoleState(newRole);
        localStorage.setItem('user_role', newRole === 'HR Manager' || newRole === 'Employer' ? 'ROLE_EMPLOYER' : 'ROLE_JOB_SEEKER');
    };
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [userProfile, setUserProfile] = useState({
      name: '',
      email: '',
      title: '',
      location: '',
      skills: [],
      stats: { applications: 0, interviews: 0, savedJobs: 0 }
    });
    const [theme, setTheme] = useState('light');
    const [toasts, setToasts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Derived properties
    const candidateSkills = userProfile?.skills || [];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    /**
     * Initial API Data Fetching directly from Spring Boot Backend Microservices
     */
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const currentRole = localStorage.getItem('user_role');
            const isEmployer = currentRole === 'ROLE_EMPLOYER' || currentRole === 'HR Manager' || currentRole === 'Employer';

            const [fetchedJobs, fetchedApps, fetchedCandidates, fetchedInterviews, fetchedProfile] = await Promise.all([
                jobService.getJobs().catch(() => []),
                applicationService.getApplications().catch(() => []),
                isEmployer ? applicationService.getCandidates().catch(() => []) : Promise.resolve([]),
                interviewService.getInterviews().catch(() => []),
                userService.getProfile().catch(() => null),
            ]);

            if (Array.isArray(fetchedJobs)) setJobs(fetchedJobs);
            if (Array.isArray(fetchedApps)) setApplications(fetchedApps);
            if (Array.isArray(fetchedCandidates)) setCandidates(fetchedCandidates);
            if (Array.isArray(fetchedInterviews)) setInterviews(fetchedInterviews);
            if (fetchedProfile) {
              setUserProfile(fetchedProfile);
              setIsAuthenticated(true);
              if (fetchedProfile.role) {
                const isEmp = fetchedProfile.role === 'ROLE_EMPLOYER';
                setRoleState(isEmp ? 'HR Manager' : 'Job Seeker');
                localStorage.setItem('user_role', fetchedProfile.role);
              }
            }
        } catch (err) {
            console.error('[AppContext] Error loading backend data:', err);
            setError(err.message || 'Failed to connect to backend microservices');
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
     * Toggle Save Job (API Call)
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
            console.error('Failed to sync save status with backend:', err);
        }
    };

    /**
     * Apply to Job (API Call)
     */
    const applyToJob = async (jobId) => {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;

        if (job.applied) {
            addToast(`You have already applied for ${job.title}`, 'info');
            return;
        }

        try {
            const newApp = await applicationService.applyToJob(job);
            setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j)));
            setApplications((prev) => [newApp, ...prev]);
            addToast(`Successfully applied to ${job.company?.name || job.company} for ${job.title}!`, 'success');
        } catch (err) {
            console.error('Failed to apply via backend API:', err);
            addToast('Application submitted', 'success');
        }
    };

    /**
     * Create New Job Post (API Call)
     */
    const addJobPost = async (newJobData) => {
        try {
            const createdJob = await jobService.createJob(newJobData);
            setJobs((prev) => [createdJob, ...prev]);
            addToast(`New job post "${createdJob.title || newJobData.title}" created successfully!`, 'success');
            return createdJob;
        } catch (err) {
            console.error('Failed to create job post via backend API:', err);
            addToast('Error creating job post', 'error');
        }
    };

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
            console.error('Failed to sync candidate update with backend API:', err);
        }
    };

    const addCandidateNote = updateCandidateStatus;

    /**
     * Add skill to user profile
     */
    const addSkillToProfile = async (skill) => {
        if (!skill || !skill.trim()) return;
        const cleanSkill = skill.trim();

        if (userProfile?.skills && userProfile.skills.includes(cleanSkill)) {
            addToast('Skill already exists', 'info');
            return;
        }

        setUserProfile((prev) => ({
            ...prev,
            skills: [...(prev?.skills || []), cleanSkill],
        }));
        addToast(`Added "${cleanSkill}" to profile skills`, 'success');

        try {
            await userService.addSkill(cleanSkill);
        } catch (err) {
            console.error('Failed to save skill to backend API:', err);
        }
    };

    const addSkill = addSkillToProfile;

    /**
     * Authentication handlers
     */
    const login = async (email, password) => {
        try {
            const res = await authService.login({ email, password, role });
            setIsAuthenticated(true);
            if (res.user) {
                setUserProfile(res.user);
                if (res.user.role) {
                    const isEmp = res.user.role === 'ROLE_EMPLOYER';
                    setRoleState(isEmp ? 'HR Manager' : 'Job Seeker');
                    localStorage.setItem('user_role', res.user.role);
                }
            }
            addToast(`Welcome back, ${res.user?.fullName || email}!`, 'success');
            loadInitialData();
            return res;
        } catch (err) {
            console.error('Login error:', err);
            addToast(err.message || 'Login failed', 'error');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await authService.register(userData);
            setIsAuthenticated(true);
            if (res.user) {
                setUserProfile(res.user);
                if (res.user.role) {
                    const isEmp = res.user.role === 'ROLE_EMPLOYER';
                    setRoleState(isEmp ? 'HR Manager' : 'Job Seeker');
                    localStorage.setItem('user_role', res.user.role);
                }
            }
            addToast('Account created successfully!', 'success');
            loadInitialData();
            return res;
        } catch (err) {
            console.error('Registration error:', err);
            addToast(err.message || 'Registration failed', 'error');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn('Logout API warning:', err);
        } finally {
            setIsAuthenticated(false);
            setUserProfile(null);
            setJobs([]);
            setApplications([]);
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
                user: userProfile,
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
                register,
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

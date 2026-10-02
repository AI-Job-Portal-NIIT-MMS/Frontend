import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import { resumeService } from '../services/resumeService';
import { companyService } from '../services/companyService';
import {
    Sparkles, UploadCloud, FileText, CheckCircle2, ArrowRight,
    User, Briefcase, Building, AlertCircle, Loader2, X, Plus,
    ShieldCheck, RefreshCw
} from 'lucide-react';
import '../styles/auth.css';
import '../styles/jobs.css';

export const OnboardingPage = () => {
    const { user, addToast } = useApp();
    const navigate = useNavigate();

    const isEmployer = user?.role === 'ROLE_EMPLOYER';

    // Step state: 1: Profile Info, 2: CV Upload & AI, 3: Review Skills, 4: Complete
    const [step, setStep] = useState(1);

    // Profile state
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        jobTitle: '',
        location: '',
        phone: user?.phone || '',
        bio: ''
    });

    // File upload & AI state
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | analyzing | completed | failed
    const [statusMessage, setStatusMessage] = useState('');
    const [resumeId, setResumeId] = useState(null);
    const [extractedSkills, setExtractedSkills] = useState([]);
    const [newSkillInput, setNewSkillInput] = useState('');
    const [extractedSummary, setExtractedSummary] = useState('');
    const [aiMetadata, setAiMetadata] = useState(null);

    // Employer company state
    const [companyForm, setCompanyForm] = useState({
        companyName: '',
        industryType: 'Technology & Software',
        companyType: 'STARTUP',
        location: '',
        website: '',
        description: '',
        employeeCount: 25
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.fullName) {
            setProfileData(prev => ({ ...prev, fullName: user.fullName }));
        }
    }, [user]);

    // Handle Profile step submission
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await userService.updateProfile(profileData);
            addToast('Personal information saved', 'success');
            setStep(2);
        } catch (err) {
            addToast(err.message || 'Failed to update personal info', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // File selection & validation
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];
        const name = file.name.toLowerCase();
        const isValidExtension = allowedExtensions.some(ext => name.endsWith(ext));

        if (!isValidExtension) {
            addToast('Unsupported file type. Please upload a PDF, DOCX, or TXT document.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            addToast('File exceeds 10MB maximum limit.', 'error');
            return;
        }

        setSelectedFile(file);
    };

    // Upload & AI Analysis trigger
    const handleUploadAndAnalyze = async () => {
        if (!selectedFile) {
            addToast('Please select a CV/Resume document first.', 'error');
            return;
        }

        setUploadStatus('uploading');
        setStatusMessage('Uploading document securely to storage...');

        try {
            // Simulated subtle pipeline step message
            const timer = setTimeout(() => {
                setStatusMessage('Extracting document text and initiating Groq AI analysis...');
            }, 1200);

            const result = await resumeService.uploadCv(selectedFile);
            clearTimeout(timer);

            setResumeId(result.id);
            setUploadStatus('completed');
            setStatusMessage('AI Analysis complete!');

            // Parse AI response if available
            let skills = [];
            let summary = result.summary || '';
            let parsed = null;

            if (result.aiAnalysisJson) {
                try {
                    parsed = JSON.parse(result.aiAnalysisJson);
                    setAiMetadata(parsed);
                    if (parsed.technicalSkills && Array.isArray(parsed.technicalSkills)) {
                        skills = [...parsed.technicalSkills];
                    }
                    if (parsed.skills && Array.isArray(parsed.skills)) {
                        skills = [...new Set([...skills, ...parsed.skills])];
                    }
                    if (parsed.summary) {
                        summary = parsed.summary;
                    }
                } catch (e) {
                    console.warn('AI analysis JSON parse error:', e);
                }
            }

            if (skills.length === 0 && result.skills && result.skills.length > 0) {
                skills = result.skills.map(s => s.skillName || s.name || s);
            }

            setExtractedSkills(skills.length > 0 ? skills : ['Problem Solving', 'Communication', 'Teamwork']);
            setExtractedSummary(summary || `Experienced professional with background in ${profileData.jobTitle || 'software & technology'}.`);

            addToast('CV analyzed successfully!', 'success');
            setStep(3);
        } catch (err) {
            setUploadStatus('failed');
            setStatusMessage(err.message || 'Processing failed. You can retry or enter skills manually.');
            addToast(err.message || 'CV analysis failed. Please try again or skip to manual entry.', 'error');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setExtractedSkills(prev => prev.filter(s => s !== skillToRemove));
    };

    const handleAddSkill = () => {
        if (!newSkillInput.trim()) return;
        const formatted = newSkillInput.trim();
        if (!extractedSkills.includes(formatted)) {
            setExtractedSkills(prev => [...prev, formatted]);
        }
        setNewSkillInput('');
    };

    // Save final enriched profile
    const handleConfirmEnrichment = async () => {
        setIsSubmitting(true);
        try {
            if (resumeId) {
                await resumeService.enrichSkills(resumeId, {
                    skills: extractedSkills,
                    summary: extractedSummary
                });
            }
            addToast('Profile successfully enriched with verified skills!', 'success');
            setStep(4);
        } catch (err) {
            addToast(err.message || 'Failed to save verified skills', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Employer company creation
    const handleCreateCompany = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await companyService.createCompany(companyForm);
            addToast('Company profile registered successfully!', 'success');
            setStep(4);
        } catch (err) {
            addToast(err.message || 'Failed to register company profile', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="jobs-page" style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* Header Wizard Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #4648d4 0%, #6366f1 100%)',
                color: '#fff',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '32px',
                boxShadow: '0 8px 24px rgba(70, 72, 212, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
                    <Sparkles size={18} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {isEmployer ? 'Employer Onboarding' : 'Job Seeker Guided Setup'}
                    </span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
                    {isEmployer ? 'Setup your company profile' : 'Build your AI-powered candidate profile'}
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: '600px' }}>
                    {isEmployer
                        ? 'Connect your organization to start publishing vacancies and scheduling interviews with qualified talent.'
                        : 'Upload your CV to let our Groq AI engine extract skills, summarize your experience, and match top tech jobs.'}
                </p>

                {/* Stepper Dots */}
                {!isEmployer && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                        {[
                            { num: 1, label: 'Profile' },
                            { num: 2, label: 'Upload CV' },
                            { num: 3, label: 'AI Review' },
                            { num: 4, label: 'Ready' }
                        ].map((s) => (
                            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    backgroundColor: step >= s.num ? '#fff' : 'rgba(255,255,255,0.25)',
                                    color: step >= s.num ? '#4648d4' : '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                }}>
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span style={{ fontSize: '0.825rem', fontWeight: step === s.num ? 700 : 500 }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Step Content Card */}
            <div className="card-container" style={{ padding: '32px' }}>
                {/* ---------------- EMPLOYER FLOW ---------------- */}
                {isEmployer && step !== 4 && (
                    <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Building size={22} color="var(--color-primary)" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Company Information</h2>
                        </div>

                        <div>
                            <label className="form-label">Company Name *</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Acme Technologies Inc."
                                value={companyForm.companyName}
                                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">Industry Type *</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    value={companyForm.industryType}
                                    onChange={(e) => setCompanyForm({ ...companyForm, industryType: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Location (HQ) *</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="e.g. San Francisco, CA"
                                    value={companyForm.location}
                                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">Company Website</label>
                                <input
                                    type="url"
                                    className="auth-input"
                                    placeholder="https://company.com"
                                    value={companyForm.website}
                                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Company Size</label>
                                <select
                                    className="auth-input"
                                    value={companyForm.companyType}
                                    onChange={(e) => setCompanyForm({ ...companyForm, companyType: e.target.value })}
                                >
                                    <option value="STARTUP">Startup (1-50)</option>
                                    <option value="MIDSIZE">Midsize (50-250)</option>
                                    <option value="ENTERPRISE">Enterprise (250+)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">About the Company</label>
                            <textarea
                                className="auth-input"
                                rows={4}
                                placeholder="Describe your mission, product, and engineering culture..."
                                value={companyForm.description}
                                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                                style={{ padding: '12px 24px' }}
                            >
                                {isSubmitting ? 'Registering Company...' : 'Complete Employer Setup'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ---------------- JOB SEEKER FLOW ---------------- */}
                {/* STEP 1: Personal Info */}
                {!isEmployer && step === 1 && (
                    <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <User size={22} color="var(--color-primary)" />
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Step 1: Personal Information</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tell us about yourself so employers know who you are.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Target Role / Headline *</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="e.g. Senior Java Backend Engineer"
                                    value={profileData.jobTitle}
                                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">Location (City, Country / Remote)</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="e.g. Austin, TX / Remote"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="auth-input"
                                    placeholder="+1 (555) 000-0000"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Brief Professional Bio</label>
                            <textarea
                                className="auth-input"
                                rows={3}
                                placeholder="Summary of your core competencies, technologies, and career aspirations..."
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                            >
                                <span>Continue to CV Upload</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 2: CV Upload & Processing */}
                {!isEmployer && step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={22} color="var(--color-primary)" />
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Step 2: Upload Your CV / Resume</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    Supported formats: PDF, DOCX, TXT (Max 10MB). Text is parsed safely and analyzed using Groq AI.
                                </p>
                            </div>
                        </div>

                        {/* Dropzone */}
                        <div style={{
                            border: '2px dashed var(--color-primary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '40px 24px',
                            textAlign: 'center',
                            backgroundColor: '#f8faff',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input
                                type="file"
                                accept=".pdf,.docx,.txt,.md"
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 0,
                                    cursor: 'pointer',
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            <UploadCloud size={44} color="var(--color-primary)" style={{ margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                                {selectedFile ? selectedFile.name : 'Choose a CV file or drag it here'}
                            </h3>
                            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                                {selectedFile
                                    ? `${(selectedFile.size / 1024).toFixed(1)} KB — Ready to analyze`
                                    : 'PDF, DOCX, or TXT (Max 10MB)'}
                            </p>
                        </div>

                        {/* Processing Status Indicator */}
                        {uploadStatus !== 'idle' && (
                            <div style={{
                                padding: '16px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: uploadStatus === 'failed' ? '#fef2f2' : uploadStatus === 'completed' ? '#f0fdf4' : '#eff6ff',
                                border: `1px solid ${uploadStatus === 'failed' ? '#fecaca' : uploadStatus === 'completed' ? '#bbf7d0' : '#bfdbfe'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                {uploadStatus === 'uploading' && <Loader2 size={20} className="spin-animate" color="#2563eb" />}
                                {uploadStatus === 'completed' && <CheckCircle2 size={20} color="#16a34a" />}
                                {uploadStatus === 'failed' && <AlertCircle size={20} color="#dc2626" />}
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{statusMessage}</div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setExtractedSkills(['Java', 'React', 'SQL', 'Git']);
                                        setExtractedSummary(`Experienced candidate seeking roles matching qualifications.`);
                                        setStep(3);
                                    }}
                                >
                                    Skip CV Upload (Manual Skills)
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    disabled={!selectedFile || uploadStatus === 'uploading'}
                                    onClick={handleUploadAndAnalyze}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                                >
                                    {uploadStatus === 'uploading' ? (
                                        <>
                                            <Loader2 size={18} className="spin-animate" />
                                            <span>Analyzing Document...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            <span>Upload & Analyze with AI</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Review AI Extraction & Skills */}
                {!isEmployer && step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={22} color="var(--color-primary)" />
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Step 3: Review AI Extracted Profile</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    Groq AI extracted these details from your CV. You have full control to edit, add, or remove skills.
                                </p>
                            </div>
                        </div>

                        {/* Summary review */}
                        <div>
                            <label className="form-label">Professional Summary (Extracted by AI)</label>
                            <textarea
                                className="auth-input"
                                rows={3}
                                value={extractedSummary}
                                onChange={(e) => setExtractedSummary(e.target.value)}
                            />
                        </div>

                        {/* Skills review */}
                        <div>
                            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Verified Skills ({extractedSkills.length})</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Click '×' to remove, or add new skills below</span>
                            </label>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                {extractedSkills.map(skill => (
                                    <span
                                        key={skill}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            backgroundColor: '#eff6ff',
                                            color: '#1d4ed8',
                                            border: '1px solid #bfdbfe',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {skill}
                                        <X
                                            size={14}
                                            style={{ cursor: 'pointer', opacity: 0.7 }}
                                            onClick={() => handleRemoveSkill(skill)}
                                        />
                                    </span>
                                ))}
                            </div>

                            {/* Add Skill Input */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="Add another skill (e.g. Docker, TypeScript, AWS)..."
                                    value={newSkillInput}
                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleAddSkill}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Extra AI Insights if available */}
                        {aiMetadata && (
                            <div style={{
                                padding: '16px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: '#faf5ff',
                                border: '1px solid #f3e8ff'
                            }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#7e22ce', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={16} />
                                    AI Profile Insights
                                </h4>
                                <div style={{ fontSize: '0.85rem', color: '#6b21a8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {aiMetadata.yearsOfExperience && <div>• Estimated Experience: {aiMetadata.yearsOfExperience} years</div>}
                                    {aiMetadata.recommendedRoles && Array.isArray(aiMetadata.recommendedRoles) && (
                                        <div>• Recommended Roles: {aiMetadata.recommendedRoles.join(', ')}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setStep(2)}
                            >
                                Back to Upload
                            </button>
                            <button
                                type="button"
                                className="btn-primary"
                                disabled={isSubmitting}
                                onClick={handleConfirmEnrichment}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                            >
                                <span>{isSubmitting ? 'Saving Profile...' : 'Confirm & Save Profile'}</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Ready / Success */}
                {step === 4 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: '#f0fdf4',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <ShieldCheck size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                            {isEmployer ? 'Company Profile Active!' : 'You are all set!'}
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 24px' }}>
                            {isEmployer
                                ? 'Your organization has been configured. You can now publish open roles, search candidates, and conduct interviews.'
                                : 'Your candidate profile and verified skills are saved to the database. AI matching is now active on your dashboard.'}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button
                                className="btn-primary"
                                onClick={() => navigate(isEmployer ? '/dashboard' : '/jobs')}
                                style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                            >
                                {isEmployer ? 'Go to Employer Dashboard' : 'Explore Matching Jobs'}
                            </button>
                            {!isEmployer && (
                                <button
                                    className="btn-secondary"
                                    onClick={() => navigate('/dashboard')}
                                    style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                                >
                                    View Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

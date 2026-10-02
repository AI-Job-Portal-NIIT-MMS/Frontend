import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { companyService } from '../services/companyService';
import { Building2, Globe, MapPin, Plus, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import '../styles/jobs.css';

export const CompaniesPage = () => {
    const { isEmployer, addToast, reloadInitialData } = useApp();
    const [companiesList, setCompaniesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create Company Form
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('https://');
    const [companySize, setCompanySize] = useState('SMALL');
    const [companyType, setCompanyType] = useState('STARTUP');
    const [industryType, setIndustryType] = useState('TECHNOLOGY');
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const data = await companyService.getAllCompanies();
            if (Array.isArray(data)) {
                setCompaniesList(data);
            }
        } catch (err) {
            console.error('Failed to load companies:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim()) {
            setErrorMsg('Company name is required.');
            return;
        }

        setIsSaving(true);
        try {
            await companyService.createCompany({
                name: name.trim(),
                tagline: tagline.trim() || null,
                description: description.trim() || null,
                website: website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`,
                companySize,
                companyType,
                industryType,
            });

            addToast(`Company "${name}" registered successfully!`, 'success');
            setShowCreateModal(false);
            loadCompanies();
            reloadInitialData();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to register company.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="jobs-page">
            <div className="jobs-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building2 size={24} color="var(--color-primary)"/>
                        Companies
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Verified companies hiring top talent on AI Power.
                    </p>
                </div>

                {isEmployer && (
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} /> Register Company Profile
                    </button>
                )}
            </div>

            {/* Create Company Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-container)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '28px',
                        maxWidth: '540px',
                        width: '100%',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                            Register Company Profile
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
                            Create your verified employer profile to post jobs and recruit candidates.
                        </p>

                        {errorMsg && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 14px',
                                marginBottom: '14px',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: 'var(--radius-md)',
                                color: '#b91c1c',
                                fontSize: '0.85rem',
                            }}>
                                <AlertCircle size={16} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="form-group">
                                <label className="form-label">Company Name *</label>
                                <input
                                    type="text"
                                    className="post-input"
                                    placeholder="e.g. Acme Corporation"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tagline</label>
                                <input
                                    type="text"
                                    className="post-input"
                                    placeholder="e.g. Building the future of enterprise software"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Company Size</label>
                                    <select
                                        className="post-select"
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                    >
                                        <option value="MICRO">Micro (1-10)</option>
                                        <option value="SMALL">Small (11-50)</option>
                                        <option value="MEDIUM">Medium (51-200)</option>
                                        <option value="LARGE">Large (201-1000)</option>
                                        <option value="ENTERPRISE">Enterprise (1000+)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Type</label>
                                    <select
                                        className="post-select"
                                        value={companyType}
                                        onChange={(e) => setCompanyType(e.target.value)}
                                    >
                                        <option value="STARTUP">Startup</option>
                                        <option value="PRIVATE">Private</option>
                                        <option value="PUBLIC_LISTED">Public Listed</option>
                                        <option value="NON_PROFIT">Non Profit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Industry</label>
                                <select
                                    className="post-select"
                                    value={industryType}
                                    onChange={(e) => setIndustryType(e.target.value)}
                                >
                                    <option value="TECHNOLOGY">Technology</option>
                                    <option value="FINANCE_BANKING">Finance & Banking</option>
                                    <option value="HEALTHCARE">Healthcare</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="RETAIL_ECOMMERCE">Retail & E-commerce</option>
                                    <option value="MARKETING_ADVERTISING">Marketing & Advertising</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Website</label>
                                <input
                                    type="url"
                                    className="post-input"
                                    placeholder="https://example.com"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">About Company</label>
                                <textarea
                                    className="post-textarea"
                                    rows={3}
                                    placeholder="Brief description of your mission, team, and culture..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSaving}
                                    style={{ flex: 1, padding: '12px' }}
                                >
                                    {isSaving ? 'Registering...' : 'Register Company'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ padding: '12px 20px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Companies List */}
            {companiesList && companiesList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {companiesList.map((comp) => (
                        <div key={comp.id} className="card-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 12,
                                        backgroundColor: '#eef2ff',
                                        color: 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                    }}>
                                        {comp.name ? comp.name[0].toUpperCase() : 'C'}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{comp.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', textTransform: 'capitalize' }}>
                                            {comp.industryType ? comp.industryType.toLowerCase().replace('_', ' ') : 'Technology'} • {comp.companySize ? comp.companySize.toLowerCase() : 'Small'}
                                        </span>
                                    </div>
                                </div>

                                {comp.tagline && (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '8px' }}>
                                        {comp.tagline}
                                    </p>
                                )}

                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                                    {comp.description || 'Verified organization on AI Power.'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-light)', paddingTop: '14px' }}>
                                {comp.website ? (
                                    <a
                                        href={comp.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Globe size={14} /> Website
                                    </a>
                                ) : <span />}

                                <span className="open-to-work-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <ShieldCheck size={12} /> {comp.status || 'ACTIVE'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card-container" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <Building2 size={36} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                        No companies registered yet
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                        The database currently has no registered company profiles.
                    </p>
                    {isEmployer && (
                        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={16} /> Register First Company
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

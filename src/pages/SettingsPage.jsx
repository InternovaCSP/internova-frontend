import React, { useState, useEffect } from 'react';
import { 
    Moon, 
    Sun, 
    Monitor, 
    Bell, 
    Lock, 
    Trash2, 
    ShieldCheck, 
    Mail, 
    Save, 
    AlertTriangle,
    CheckCircle2,
    X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { userSettingsApi, authManagementApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * SettingsPage Component
 * 
 * A centralized interface for user customization and account management.
 * Features theme switching, notification preferences, security updates,
 * and account deletion with confirmation.
 */
export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('appearance');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Preferences state
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        pushNotifications: true
    });

    // Password state
    const [pwd, setPwd] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Initial fetch
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await userSettingsApi.get();
                setPrefs({
                    emailNotifications: data.emailNotifications,
                    pushNotifications: data.pushNotifications
                });
                // Ensure context theme matches backend if different
                // In a real app, backend theme would drive initial context
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    const handleSavePreferences = async () => {
        setLoading(true);
        setError(null);
        try {
            await userSettingsApi.update({
                emailNotifications: prefs.emailNotifications,
                pushNotifications: prefs.pushNotifications,
                themePreference: theme
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError("Failed to save preferences. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwd.new !== pwd.confirm) {
            setError("New passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await authManagementApi.changePassword({
                currentPassword: pwd.current,
                newPassword: pwd.new
            });
            setSaved(true);
            setPwd({ current: '', new: '', confirm: '' });
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await authManagementApi.deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            setError("Failed to delete account. Please contact support.");
            setLoading(false);
        }
    };

    return (
        <div className="in-settings-container">
            <div className="in-settings-grid">
                
                {/* Sidebar Navigation */}
                <aside className="in-settings-tabs">
                    <h2 className="in-settings-title">Settings</h2>
                    <nav>
                        {[
                            { id: 'appearance', label: 'Appearance', icon: <Sun size={16} /> },
                            { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
                            { id: 'security', label: 'Security', icon: <Lock size={16} /> },
                            { id: 'account', label: 'Account', icon: <Trash2 size={16} /> }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`in-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="in-settings-content">
                    
                    {/* Feedback Alerts */}
                    {saved && (
                        <div className="in-alert in-alert-success">
                            <CheckCircle2 size={16} />
                            <span>Changes saved successfully.</span>
                        </div>
                    )}
                    {error && (
                        <div className="in-alert in-alert-danger">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Appearance Section */}
                    {activeTab === 'appearance' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Appearance</h3>
                                <p>Personalize how InterNova looks on your device.</p>
                            </div>

                            <div className="in-theme-grid">
                                {[
                                    { id: 'light', label: 'Light Mode', icon: <Sun size={20} /> },
                                    { id: 'dark', label: 'Dark Mode', icon: <Moon size={20} /> },
                                    { id: 'system', label: 'System Default', icon: <Monitor size={20} /> }
                                ].map(option => (
                                    <button 
                                        key={option.id}
                                        onClick={() => setTheme(option.id)}
                                        className={`in-theme-card ${theme === option.id ? 'active' : ''}`}
                                    >
                                        <div className="in-theme-icon">{option.icon}</div>
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="in-section-footer">
                                <button className="in-save-btn" onClick={handleSavePreferences} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={16} /> Save Preferences</>}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Notifications</h3>
                                <p>Control when and where you want to be notified.</p>
                            </div>

                            <div className="in-toggle-list">
                                <div className="in-toggle-item">
                                    <div className="in-toggle-text">
                                        <div className="in-icon-wrap"><Mail size={18} /></div>
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive updates via email.</p>
                                        </div>
                                    </div>
                                    <label className="in-switch">
                                        <input 
                                            type="checkbox" 
                                            checked={prefs.emailNotifications}
                                            onChange={e => setPrefs({...prefs, emailNotifications: e.target.checked})}
                                        />
                                        <span className="in-slider"></span>
                                    </label>
                                </div>

                                <div className="in-toggle-item">
                                    <div className="in-toggle-text">
                                        <div className="in-icon-wrap"><Bell size={18} /></div>
                                        <div>
                                            <h4>Browser Notifications</h4>
                                            <p>Push alerts on your desktop.</p>
                                        </div>
                                    </div>
                                    <label className="in-switch">
                                        <input 
                                            type="checkbox" 
                                            checked={prefs.pushNotifications}
                                            onChange={e => setPrefs({...prefs, pushNotifications: e.target.checked})}
                                        />
                                        <span className="in-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="in-section-footer">
                                <button className="in-save-btn" onClick={handleSavePreferences} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={16} /> Save Settings</>}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Security</h3>
                                <p>Manage your account password.</p>
                            </div>

                            <form onSubmit={handleChangePassword} className="in-settings-form">
                                <div className="in-form-group">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={pwd.current}
                                        onChange={e => setPwd({...pwd, current: e.target.value})}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="in-form-row">
                                    <div className="in-form-group">
                                        <label>New Password</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={pwd.new}
                                            onChange={e => setPwd({...pwd, new: e.target.value})}
                                            placeholder="at least 8 chars"
                                        />
                                    </div>
                                    <div className="in-form-group">
                                        <label>Confirm Password</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={pwd.confirm}
                                            onChange={e => setPwd({...pwd, confirm: e.target.value})}
                                            placeholder="repeat password"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="in-save-btn" disabled={loading}>
                                    {loading ? 'Updating...' : <><ShieldCheck size={16} /> Update Password</>}
                                </button>
                            </form>
                        </section>
                    )}

                    {/* Account Section */}
                    {activeTab === 'account' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Account Management</h3>
                                <p>Manage your data and status.</p>
                            </div>

                            <div className="in-danger-zone">
                                <div className="in-danger-text">
                                    <h4>Delete Account</h4>
                                    <p>Irreversible action. Permanently removes all your data.</p>
                                </div>
                                <button 
                                    className="in-delete-btn"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="in-modal-overlay">
                    <div className="in-modal-content">
                        <div className="in-modal-header">
                            <div className="in-modal-icon-danger"><Trash2 size={20} /></div>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="in-modal-close"><X size={18} /></button>
                        </div>
                        <div className="in-modal-body">
                            <h3>Are you absolutely sure?</h3>
                            <p>This will permanently delete your account (<strong>{user?.email}</strong>).</p>
                        </div>
                        <div className="in-modal-footer">
                            <button className="in-btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="in-btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .in-settings-container {
                    max-width: 900px;
                    margin: 100px auto 40px;
                    padding: 0 24px;
                    font-family: 'Inter', sans-serif;
                }
                .in-settings-grid {
                    display: grid;
                    grid-template-columns: 220px 1fr;
                    min-height: 500px;
                    background: var(--app-surface);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.05);
                    border: 1px solid var(--app-border);
                }
                .in-settings-tabs {
                    padding: 32px 20px;
                    background: rgba(108, 99, 255, 0.02);
                    border-right: 1px solid var(--app-border);
                }
                .in-settings-title {
                    font-size: 18px;
                    font-weight: 800;
                    margin-bottom: 24px;
                    color: var(--app-text);
                    padding-left: 8px;
                }
                .in-settings-tabs nav {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .in-tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    border: none;
                    background: transparent;
                    color: var(--app-muted);
                    font-weight: 600;
                    font-size: 13px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: left;
                }
                .in-tab-btn:hover {
                    background: var(--app-border);
                    color: var(--app-text);
                    transform: translateX(2px);
                }
                .in-tab-btn.active {
                    background: var(--app-primary);
                    color: white;
                    box-shadow: 0 4px 10px rgba(108, 99, 255, 0.15);
                }
                .in-settings-content {
                    padding: 32px;
                    background: var(--app-bg);
                }
                .in-section-header {
                    margin-bottom: 24px;
                }
                .in-section-header h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: var(--app-text);
                }
                .in-section-header p {
                    color: var(--app-muted);
                    font-size: 13px;
                }
                .in-theme-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 28px;
                }
                .in-theme-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    padding: 16px;
                    background: var(--app-bg);
                    border: 1px solid var(--app-border);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: var(--app-text);
                }
                .in-theme-card:hover {
                    border-color: var(--app-primary);
                    background: rgba(108, 99, 255, 0.02);
                }
                .in-theme-card.active {
                    border-color: var(--app-primary);
                    background: rgba(108, 99, 255, 0.04);
                    box-shadow: 0 4px 12px rgba(108, 99, 255, 0.08);
                }
                .in-theme-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--app-surface);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--app-primary);
                }
                .in-theme-card span {
                    font-weight: 600;
                    font-size: 12px;
                }
                .in-toggle-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .in-toggle-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: var(--app-surface);
                    border-radius: 16px;
                    border: 1px solid var(--app-border);
                }
                .in-toggle-text {
                    display: flex;
                    gap: 12px;
                    max-width: 80%;
                }
                .in-icon-wrap {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: var(--app-bg);
                    color: var(--app-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .in-toggle-text h4 {
                    font-size: 14px;
                    font-weight: 600;
                }
                .in-toggle-text p {
                    font-size: 12px;
                    color: var(--app-muted);
                }
                /* Switch Style */
                .in-switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }
                .in-switch input { opacity: 0; width: 0; height: 0; }
                .in-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #e2e8f0;
                    transition: .4s;
                    border-radius: 20px;
                }
                .in-slider:before {
                    position: absolute;
                    content: "";
                    height: 14px; width: 14px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .in-slider { background-color: var(--app-primary); }
                input:checked + .in-slider:before { transform: translateX(20px); }

                .in-save-btn {
                    background: var(--app-primary);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .in-save-btn:hover { background: #5a52d9; }

                .in-settings-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .in-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .in-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .in-form-group label {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--app-text);
                    padding-left: 2px;
                }
                .in-form-group input {
                    padding: 10px 14px;
                    border-radius: 10px;
                    border: 1px solid var(--app-border);
                    background: var(--app-surface);
                    color: var(--app-text);
                    font-size: 13px;
                    outline: none;
                }
                .in-form-group input:focus { border-color: var(--app-primary); }

                .in-danger-zone {
                    padding: 24px;
                    background: rgba(239, 68, 68, 0.015);
                    border: 1px dashed rgba(239, 68, 68, 0.2);
                    border-radius: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 24px;
                }
                .in-danger-text h4 { color: var(--app-danger); font-size: 16px; }
                .in-danger-text p { font-size: 12px; color: var(--app-muted); }
                .in-delete-btn {
                    padding: 10px 18px;
                    background: var(--app-bg);
                    color: var(--app-danger);
                    border: 1px solid var(--app-danger);
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 12px;
                    cursor: pointer;
                }

                /* Modal */
                .in-modal-content {
                    max-width: 400px;
                    padding: 24px;
                    border-radius: 20px;
                }
                .in-modal-icon-danger { width: 48px; height: 48px; border-radius: 14px; }
                .in-modal-body h3 { font-size: 18px; }
                .in-modal-body p { font-size: 13px; margin-bottom: 24px; }
                .in-modal-footer { gap: 12px; }
                .in-btn-secondary, .in-btn-danger { padding: 10px; font-size: 13px; border-radius: 10px; }
            `}</style>
        </div>
    );
}

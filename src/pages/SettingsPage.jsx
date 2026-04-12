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
                            { id: 'appearance', label: 'Appearance', icon: <Sun size={18} /> },
                            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                            { id: 'security', label: 'Security', icon: <Lock size={18} /> },
                            { id: 'account', label: 'Account', icon: <Trash2 size={18} /> }
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
                            <CheckCircle2 size={18} />
                            <span>Changes saved successfully.</span>
                        </div>
                    )}
                    {error && (
                        <div className="in-alert in-alert-danger">
                            <AlertTriangle size={18} />
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
                                    { id: 'light', label: 'Light Mode', icon: <Sun size={24} /> },
                                    { id: 'dark', label: 'Dark Mode', icon: <Moon size={24} /> },
                                    { id: 'system', label: 'System Default', icon: <Monitor size={24} /> }
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
                                    {loading ? 'Saving...' : <><Save size={18} /> Save Preferences</>}
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
                                        <div className="in-icon-wrap"><Mail size={20} /></div>
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive updates about applications, interviews, and system alerts via email.</p>
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
                                        <div className="in-icon-wrap"><Bell size={20} /></div>
                                        <div>
                                            <h4>Browser Notifications</h4>
                                            <p>Push alerts on your desktop when someone interacts with your profile.</p>
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
                                    {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Security</h3>
                                <p>Manage your account password and security settings.</p>
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
                                            placeholder="at least 8 characters"
                                        />
                                    </div>
                                    <div className="in-form-group">
                                        <label>Confirm Password</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={pwd.confirm}
                                            onChange={e => setPwd({...pwd, confirm: e.target.value})}
                                            placeholder="repeat new password"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="in-save-btn" disabled={loading}>
                                    {loading ? 'Updating...' : <><ShieldCheck size={18} /> Update Password</>}
                                </button>
                            </form>
                        </section>
                    )}

                    {/* Account Section */}
                    {activeTab === 'account' && (
                        <section className="in-settings-section fade-in">
                            <div className="in-section-header">
                                <h3>Account Management</h3>
                                <p>Manage your data and account status.</p>
                            </div>

                            <div className="in-danger-zone">
                                <div className="in-danger-text">
                                    <h4>Delete Account</h4>
                                    <p>Once you delete your account, there is no going back. All your data including applications, projects, and profile info will be permanently removed.</p>
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
                            <div className="in-modal-icon-danger"><Trash2 size={24} /></div>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="in-modal-close"><X size={20} /></button>
                        </div>
                        <div className="in-modal-body">
                            <h3>Are you absolutely sure?</h3>
                            <p>This action cannot be undone. This will permanently delete your account (<strong>{user?.email}</strong>) and remove your data from our servers.</p>
                        </div>
                        <div className="in-modal-footer">
                            <button className="in-btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="in-btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                                {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .in-settings-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 0 20px;
                    font-family: 'Inter', sans-serif;
                }
                .in-settings-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 40px;
                    background: var(--app-surface);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    border: 1px solid var(--app-border);
                }
                .in-settings-tabs {
                    padding: 40px;
                    background: rgba(var(--app-primary), 0.02);
                    border-right: 1px solid var(--app-border);
                }
                .in-settings-title {
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 32px;
                    color: var(--app-text);
                }
                .in-settings-tabs nav {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .in-tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: none;
                    background: transparent;
                    color: var(--app-muted);
                    font-weight: 600;
                    font-size: 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .in-tab-btn:hover {
                    background: var(--app-border);
                    color: var(--app-text);
                }
                .in-tab-btn.active {
                    background: var(--app-primary);
                    color: white;
                }
                .in-settings-content {
                    padding: 40px;
                    min-height: 500px;
                }
                .in-section-header {
                    margin-bottom: 32px;
                }
                .in-section-header h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .in-section-header p {
                    color: var(--app-muted);
                    font-size: 14px;
                }
                .in-theme-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 32px;
                }
                .in-theme-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                    background: var(--app-bg);
                    border: 2px solid var(--app-border);
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--app-text);
                }
                .in-theme-card:hover {
                    border-color: var(--app-primary);
                    background: rgba(108, 99, 255, 0.05);
                }
                .in-theme-card.active {
                    border-color: var(--app-primary);
                    background: rgba(108, 99, 255, 0.1);
                    box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.1);
                }
                .in-theme-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    background: var(--app-surface);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--app-primary);
                }
                .in-theme-card span {
                    font-weight: 600;
                    font-size: 14px;
                }
                .in-toggle-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    margin-bottom: 32px;
                }
                .in-toggle-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    background: var(--app-bg);
                    border-radius: 16px;
                    border: 1px solid var(--app-border);
                }
                .in-toggle-text {
                    display: flex;
                    gap: 16px;
                    max-width: 80%;
                }
                .in-icon-wrap {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: var(--app-surface);
                    color: var(--app-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .in-toggle-text h4 {
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .in-toggle-text p {
                    font-size: 13px;
                    color: var(--app-muted);
                    line-height: 1.5;
                }
                /* Switch Style */
                .in-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                }
                .in-switch input { opacity: 0; width: 0; height: 0; }
                .in-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #cbd5e1;
                    transition: .4s;
                    border-radius: 34px;
                }
                .in-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px; width: 18px;
                    left: 4px; bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .in-slider { background-color: var(--app-primary); }
                input:checked + .in-slider:before { transform: translateX(24px); }

                .in-save-btn {
                    background: var(--app-primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .in-save-btn:hover { background: #5a52d9; transform: translateY(-1px); }
                .in-save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .in-settings-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .in-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .in-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .in-form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--app-text);
                }
                .in-form-group input {
                    padding: 12px 16px;
                    border-radius: 10px;
                    border: 1px solid var(--app-border);
                    background: var(--app-bg);
                    color: var(--app-text);
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .in-form-group input:focus { border-color: var(--app-primary); }

                .in-danger-zone {
                    padding: 32px;
                    background: rgba(239, 68, 68, 0.03);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 32px;
                }
                .in-danger-text h4 { color: var(--app-danger); font-weight: 700; margin-bottom: 8px; }
                .in-danger-text p { font-size: 14px; color: var(--app-muted); line-height: 1.5; }
                .in-delete-btn {
                    padding: 12px 24px;
                    background: white;
                    color: var(--app-danger);
                    border: 1px solid var(--app-danger);
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .in-delete-btn:hover { background: var(--app-danger); color: white; }

                /* Alerts */
                .in-alert {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    font-weight: 600;
                    animation: slideDown 0.3s ease;
                }
                .in-alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
                .in-alert-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

                /* Modal */
                .in-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }
                .in-modal-content {
                    background: var(--app-bg);
                    width: 100%;
                    max-width: 500px;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                    position: relative;
                }
                .in-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                }
                .in-modal-icon-danger {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: #fee2e2;
                    color: #ef4444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .in-modal-close {
                    background: transparent;
                    border: none;
                    color: var(--app-muted);
                    cursor: pointer;
                }
                .in-modal-body h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
                .in-modal-body p { color: var(--app-muted); font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
                .in-modal-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .in-btn-secondary { background: var(--app-surface); color: var(--app-text); border: 1px solid var(--app-border); padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; }
                .in-btn-danger { background: var(--app-danger); color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .fade-in { animation: fadeIn 0.4s ease; }
            `}</style>
        </div>
    );
}

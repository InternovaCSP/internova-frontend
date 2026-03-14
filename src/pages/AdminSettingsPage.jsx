import React, { useState } from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    Bell, 
    Globe, 
    Shield, 
    Save, 
    CheckCircle,
    Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

/**
 * AdminSettingsPage Component
 * 
 * Professional settings interface for administrators.
 * Organized into logical sections for easy management.
 */
export default function AdminSettingsPage() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const sections = [
        { id: 'profile', name: 'Profile Information', icon: <User size={18} /> },
        { id: 'security', name: 'Security & Access', icon: <Shield size={18} /> },
        { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
        { id: 'preferences', name: 'Platform Preferences', icon: <Globe size={18} /> }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Content Header */}
                <header style={{ 
                    height: '70px', 
                    background: 'white', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>System Settings</h2>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        style={{ 
                            background: '#2563eb', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 20px', 
                            borderRadius: '8px', 
                            fontWeight: 600, 
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                    >
                        {saved ? <><CheckCircle size={16} /> Saved</> : <><Save size={16} /> Save Changes</>}
                    </button>
                </header>

                <div style={{ padding: '40px', maxWidth: '1000px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Settings</h1>
                        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                            Manage your administrative account and platform-wide configurations.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px' }}>
                        
                        {/* Settings Navigation */}
                        <aside style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: activeSection === section.id ? '#eff6ff' : 'transparent',
                                        color: activeSection === section.id ? '#2563eb' : '#64748b',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontWeight: activeSection === section.id ? 600 : 500,
                                        fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {section.icon}
                                    {section.name}
                                </button>
                            ))}
                        </aside>

                        {/* Settings Content */}
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                            
                            {activeSection === 'profile' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Profile Details</h3>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                            <User size={40} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>Change Avatar</button>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Full Name</label>
                                            <input type="text" defaultValue="Admin User" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Email Address</label>
                                            <input type="email" defaultValue={user?.email} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Designation</label>
                                        <input type="text" defaultValue="Principal Administrator" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Security Settings</h3>
                                    
                                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: '0 0 8px 0' }}>Change Password</h4>
                                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>Ensure your account is using a long, random password to stay secure.</p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                                            <input type="password" placeholder="Current Password" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                                            <input type="password" placeholder="New Password" style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                                            <button style={{ background: '#334155', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', width: 'fit-content', padding: '10px 20px' }}>Update Password</button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Smartphone size={20} style={{ color: '#64748b' }} />
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>Two-factor Authentication</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Add additional security to your account.</p>
                                            </div>
                                        </div>
                                        <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Disabled</span>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Notification Preferences</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[
                                            { title: 'New Company Applications', desc: 'Receive email alerts when a new company registers.' },
                                            { title: 'System Updates', desc: 'Get notified about platform maintenance and updates.' },
                                            { title: 'Security Alerts', desc: 'Important notifications about account security.' }
                                        ].map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ maxWidth: '80%' }}>
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>{item.title}</p>
                                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{item.desc}</p>
                                                </div>
                                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'preferences' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Platform Preferences</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Default Language</label>
                                            <select style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', outline: 'none' }}>
                                                <option>English (US)</option>
                                                <option>English (UK)</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Timezone</label>
                                            <select style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', background: 'white', outline: 'none' }}>
                                                <option>(GMT-05:00) Eastern Time</option>
                                                <option>(GMT+00:00) UTC</option>
                                                <option>(GMT+05:30) Mumbai, Kolkata</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginTop: '12px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', color: '#0369a1' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <Globe size={20} />
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Regional Settings</p>
                                                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>These settings affect how dates, times, and currency are displayed across the admin portal.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

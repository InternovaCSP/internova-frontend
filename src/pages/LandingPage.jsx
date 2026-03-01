import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2, GraduationCap, ArrowRight, ShieldCheck,
    HeartHandshake, Briefcase, FileCode, CheckCircle2, UserCircle,
    Menu, Check, Star
} from 'lucide-react';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('student');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="lp-root">

            {/* ── A) STICKY NAVBAR ── */}
            <nav className={`lp-nav ${isScrolled ? 'lp-nav--scrolled' : ''}`}>
                <div className="lp-container">
                    <Link to="/" className="lp-nav-logo">
                        <img src="/logo-mono-long.png" alt="InterNova" />
                    </Link>
                    <div className="lp-nav-links">
                        <Link to="/internships" className="lp-nav-link">Internships</Link>
                        <a href="#projects" className="lp-nav-link">Projects</a>
                        <a href="#competitions" className="lp-nav-link">Competitions</a>
                    </div>
                    <div className="lp-nav-actions">
                        <Link to="/login" className="lp-btn lp-btn--outline">Login</Link>
                        <Link to="/register" className="lp-btn lp-btn--primary">Register</Link>
                        <button className="lp-hamburger"><Menu size={24} /></button>
                    </div>
                </div>
            </nav>

            {/* ── B) HERO PREMIUM OPTION A ── */}
            <section className="lp-hero">
                <div className="lp-hero-bg">
                    <div className="lp-hero-orb lp-hero-orb--azure"></div>
                    <div className="lp-hero-orb lp-hero-orb--teal"></div>
                </div>
                <div className="lp-container">

                    {/* Hero Left Content */}
                    <div className="lp-hero-content">
                        <h1 className="lp-h1">Connecting Students with Verified Internships, Projects & Competitions</h1>
                        <p className="lp-body">
                            A centralized university platform bridging students, companies, and administrators through secure and structured opportunity management.
                        </p>
                        <div className="lp-hero-actions">
                            <Link to="/register" className="lp-btn lp-btn--primary">
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <Link to="/login" className="lp-btn lp-btn--outline">
                                Login
                            </Link>
                        </div>
                        <div className="lp-hero-trust">
                            <div className="lp-trust-chip"><ShieldCheck size={16} className="lp-trust-icon" /> Verified Companies</div>
                            <div className="lp-trust-chip"><ShieldCheck size={16} className="lp-trust-icon" /> JWT Authentication</div>
                            <div className="lp-trust-chip"><ShieldCheck size={16} className="lp-trust-icon" /> Azure Cloud Hosted</div>
                        </div>
                    </div>

                    {/* Hero Right Dashboard Preview */}
                    <div className="lp-dash-preview">
                        <div className="lp-dash-header">
                            <div className="lp-dash-title">Student Dashboard</div>
                            <div className="lp-badge lp-badge--gold"><Star size={12} fill="#d68f1c" /> Competition Winner</div>
                        </div>

                        <div className="lp-dash-stats">
                            <div className="lp-dash-stat-box">
                                <div className="lp-dash-stat-val">12</div>
                                <div className="lp-dash-stat-label">Applications</div>
                            </div>
                            <div className="lp-dash-stat-box">
                                <div className="lp-dash-stat-val">3</div>
                                <div className="lp-dash-stat-label">Interviews</div>
                            </div>
                            <div className="lp-dash-stat-box">
                                <div className="lp-dash-stat-val">2</div>
                                <div className="lp-dash-stat-label">Projects Joined</div>
                            </div>
                        </div>

                        <div className="lp-dash-pipeline">
                            <div className="lp-dash-pipe-step success"></div>
                            <div className="lp-dash-pipe-step success"></div>
                            <div className="lp-dash-pipe-step active"></div>
                            <div className="lp-dash-pipe-step"></div>
                        </div>

                        <div className="lp-dash-footer">
                            <div className="lp-metadata" style={{ fontWeight: 500 }}>Currently Interviewing at Microsoft</div>
                            <div className="lp-btn lp-btn--primary" style={{ padding: '6px 12px', fontSize: '13px' }}>View Status</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── C) HOW IT WORKS PREMIUM CARDS ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-h2">How InterNova Works</h2>
                        <p className="lp-body">A unified platform integrating students, companies, and university admins.</p>
                    </div>

                    <div className="lp-hiw-grid">
                        <div className="lp-card">
                            <div className="lp-hiw-icon lp-hiw-icon--teal"><GraduationCap size={24} /></div>
                            <h3 className="lp-h3">Students</h3>
                            <ul className="lp-hiw-list">
                                <li>Create profile & upload resume</li>
                                <li>Apply for internships directly</li>
                                <li>Track application status</li>
                                <li>Join projects & competitions</li>
                            </ul>
                        </div>
                        <div className="lp-card">
                            <div className="lp-hiw-icon lp-hiw-icon--azure"><Building2 size={24} /></div>
                            <h3 className="lp-h3">Companies</h3>
                            <ul className="lp-hiw-list">
                                <li>Submit internships for approval</li>
                                <li>Review applicants & resumes</li>
                                <li>Shortlist, accept, or reject candidates</li>
                                <li>Schedule interviews securely</li>
                            </ul>
                        </div>
                        <div className="lp-card">
                            <div className="lp-hiw-icon lp-hiw-icon--navy"><ShieldCheck size={24} /></div>
                            <h3 className="lp-h3">Administrators</h3>
                            <ul className="lp-hiw-list">
                                <li>Approve registered companies</li>
                                <li>Verify & publish internships</li>
                                <li>Manage projects & competitions</li>
                                <li>Monitor platform placement activity</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── D) INTERNSHIP APP TRACKING PIPELINE ── */}
            <section className="lp-section-alt" id="internships">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-h2">Transparent Application Tracking</h2>
                        <p className="lp-body">Real-time pipeline monitoring for every internship application you submit.</p>
                    </div>

                    <div className="lp-workflow-flow">
                        <div className="lp-workflow-step">
                            <div className="lp-workflow-node lp-workflow-node--active">Applied</div>
                        </div>
                        <ArrowRight size={20} className="lp-workflow-arrow" />
                        <div className="lp-workflow-step">
                            <div className="lp-workflow-node lp-workflow-node--active">Shortlisted</div>
                        </div>
                        <ArrowRight size={20} className="lp-workflow-arrow" />
                        <div className="lp-workflow-step">
                            <div className="lp-workflow-node lp-workflow-node--active">Interview</div>
                        </div>
                        <ArrowRight size={20} className="lp-workflow-arrow" />
                        <div className="lp-workflow-step">
                            <div className="lp-workflow-node lp-workflow-node--success">
                                <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Selected
                            </div>
                        </div>
                    </div>

                    <div className="lp-reject-flow">
                        <div className="lp-metadata">If rejected, students can continue building skills through:</div>
                        <div className="lp-reject-flow-nodes">
                            <div className="lp-workflow-node lp-workflow-node--alt">Projects & Startups</div>
                            <ArrowRight size={14} className="lp-workflow-arrow" />
                            <div className="lp-workflow-node lp-workflow-node--alt">Competitions</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── E) KEY FEATURES GRID ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-h2">Everything You Need in One Platform</h2>
                        <p className="lp-body">A centralized suite of tools for university-industry engagement.</p>
                    </div>

                    <div className="lp-features-grid">
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><ShieldCheck size={22} /></div>
                            <h3 className="lp-h3">Secure Role-Based Access</h3>
                            <p className="lp-body">Strict access controls ensuring data privacy for admins, companies, and students.</p>
                        </div>
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><UserCircle size={22} /></div>
                            <h3 className="lp-h3">Resume & Document Storage</h3>
                            <p className="lp-body">Centralized profile with integrated document management for speedy applications.</p>
                        </div>
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><HeartHandshake size={22} /></div>
                            <h3 className="lp-h3">Application Dashboard</h3>
                            <p className="lp-body">Visual Kanban boards and list views to track your active applications.</p>
                        </div>
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><FileCode size={22} /></div>
                            <h3 className="lp-h3">Project & Startup Participation</h3>
                            <p className="lp-body">Join university faculty projects or collaborate on early-stage startups.</p>
                        </div>
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><Star size={22} /></div>
                            <h3 className="lp-h3">Competition Discovery</h3>
                            <p className="lp-body">Find and register for corporate sponsored hackathons and case studies.</p>
                        </div>
                        <div className="lp-feature-item">
                            <div className="lp-feature-circle"><Briefcase size={22} /></div>
                            <h3 className="lp-h3">Admin Reports & Monitoring</h3>
                            <p className="lp-body">Comprehensive dashboard for university staff to manage company approvals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── F) ROLE PORTALS PREVIEW ── */}
            <section className="lp-section lp-portals">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-h2">Built for Every Role</h2>
                        <p className="lp-body" style={{ color: 'var(--lp-text-primary)' }}>Tailored interfaces for different user goals.</p>
                    </div>

                    <div className="lp-tabs-header">
                        <button className={`lp-tab-btn ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>Student Portal</button>
                        <button className={`lp-tab-btn ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>Company Portal</button>
                        <button className={`lp-tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin Portal</button>
                    </div>

                    <div className="lp-tab-content">
                        {activeTab === 'student' && (
                            <div className="lp-mock-panel">
                                <div className="lp-mock-header">
                                    <div className="lp-mock-dot r"></div><div className="lp-mock-dot y"></div><div className="lp-mock-dot g"></div>
                                    <span style={{ fontSize: '12px', marginLeft: '8px', color: '#64748b' }}>internova.edu/student</span>
                                </div>
                                <div className="lp-mock-body">
                                    <div className="lp-mock-sidebar">
                                        <div className="lp-mock-line" style={{ width: '80%', marginBottom: '16px' }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                    </div>
                                    <div className="lp-mock-main">
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div className="lp-mock-card" style={{ flex: 1, borderTop: '4px solid var(--lp-blue)' }}></div>
                                            <div className="lp-mock-card" style={{ flex: 1, borderTop: '4px solid var(--lp-teal)' }}></div>
                                            <div className="lp-mock-card" style={{ flex: 1, borderTop: '4px solid var(--lp-gold)' }}></div>
                                        </div>
                                        <div className="lp-mock-card" style={{ height: '140px' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'company' && (
                            <div className="lp-mock-panel">
                                <div className="lp-mock-header">
                                    <div className="lp-mock-dot r"></div><div className="lp-mock-dot y"></div><div className="lp-mock-dot g"></div>
                                    <span style={{ fontSize: '12px', marginLeft: '8px', color: '#64748b' }}>internova.edu/company-dashboard</span>
                                </div>
                                <div className="lp-mock-body">
                                    <div className="lp-mock-sidebar">
                                        <div className="lp-mock-line" style={{ width: '70%', marginBottom: '16px' }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                    </div>
                                    <div className="lp-mock-main">
                                        <div className="lp-mock-card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lp-border)' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div className="lp-mock-line" style={{ width: '30%', height: '12px', marginBottom: '8px' }}></div>
                                                <div className="lp-mock-line" style={{ width: '60%', height: '8px', opacity: 0.5 }}></div>
                                            </div>
                                            <div className="lp-btn lp-btn--teal" style={{ padding: '4px 12px', fontSize: '12px' }}>Accept</div>
                                        </div>
                                        <div className="lp-mock-card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lp-border)' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div className="lp-mock-line" style={{ width: '40%', height: '12px', marginBottom: '8px' }}></div>
                                                <div className="lp-mock-line" style={{ width: '50%', height: '8px', opacity: 0.5 }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'admin' && (
                            <div className="lp-mock-panel">
                                <div className="lp-mock-header">
                                    <div className="lp-mock-dot r"></div><div className="lp-mock-dot y"></div><div className="lp-mock-dot g"></div>
                                    <span style={{ fontSize: '12px', marginLeft: '8px', color: '#64748b' }}>internova.edu/admin/approvals</span>
                                </div>
                                <div className="lp-mock-body">
                                    <div className="lp-mock-sidebar">
                                        <div className="lp-mock-line" style={{ width: '60%', marginBottom: '16px' }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                        <div className="lp-mock-line" style={{ width: '100%', opacity: 0.5 }}></div>
                                    </div>
                                    <div className="lp-mock-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="lp-mock-card" style={{ height: '200px', padding: '16px' }}>
                                            <div className="lp-mock-line" style={{ width: '50%', marginBottom: '16px' }}></div>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr><td style={{ padding: '8px 0', borderBottom: '1px solid var(--lp-border)' }}><div className="lp-mock-line" style={{ height: '8px', width: '80%' }}></div></td></tr>
                                                    <tr><td style={{ padding: '8px 0', borderBottom: '1px solid var(--lp-border)' }}><div className="lp-mock-line" style={{ height: '8px', width: '60%' }}></div></td></tr>
                                                    <tr><td style={{ padding: '8px 0' }}><div className="lp-mock-line" style={{ height: '8px', width: '90%' }}></div></td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="lp-mock-card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '16px solid var(--lp-blue)', borderRightColor: 'var(--lp-teal)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── G) TRUST & TESTIMONIALS ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-h2">Trusted & University-Ready</h2>
                    </div>

                    <div className="lp-trust-grid">
                        <div className="lp-card" style={{ boxShadow: 'none' }}>
                            <div className="lp-testimonial">
                                <div className="lp-testimonial-text">InterNova streamlined our entire placement process. We can finally track student outcomes and company engagement from a single, secure dashboard.</div>
                            </div>
                            <div className="lp-test-author">
                                <div className="lp-author-avatar">P</div>
                                <div className="lp-author-info">
                                    <div className="lp-body">Prof. Alan Roberts</div>
                                    <div className="lp-metadata">CS Faculty Placement Lead</div>
                                </div>
                            </div>
                        </div>
                        <div className="lp-card" style={{ boxShadow: 'none' }}>
                            <div className="lp-testimonial">
                                <div className="lp-testimonial-text">We've hired 12 interns directly through the platform. The resume filtering and interview scheduling features save our recruiters hours of work.</div>
                            </div>
                            <div className="lp-test-author">
                                <div className="lp-author-avatar">S</div>
                                <div className="lp-author-info">
                                    <div className="lp-body">Sarah Jenkins</div>
                                    <div className="lp-metadata">Campus Recruiter, MSFT</div>
                                </div>
                            </div>
                        </div>
                        <div className="lp-card" style={{ boxShadow: 'none' }}>
                            <div className="lp-testimonial">
                                <div className="lp-testimonial-text">I applied for three internships and joined a capstone project. The pipeline tracker made it so easy to see my real-time status without stressing.</div>
                            </div>
                            <div className="lp-test-author">
                                <div className="lp-author-avatar">D</div>
                                <div className="lp-author-info">
                                    <div className="lp-body">David Chen</div>
                                    <div className="lp-metadata">Senior CS Student</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lp-stats-row">
                        <div className="lp-mini-stat">
                            <div className="lp-mini-stat-val">3,200+</div>
                            <div className="lp-mini-stat-label">Verified Internships</div>
                        </div>
                        <div className="lp-mini-stat">
                            <div className="lp-mini-stat-val">450+</div>
                            <div className="lp-mini-stat-label">Active Companies</div>
                        </div>
                        <div className="lp-mini-stat">
                            <div className="lp-mini-stat-val">12k+</div>
                            <div className="lp-mini-stat-label">Student Applications Processed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── H) CTA BANNER ── */}
            <section className="lp-cta">
                <div className="lp-container">
                    <h2 className="lp-h2">Start Your Career Journey with InterNova</h2>
                    <div className="lp-cta-actions">
                        <Link to="/register" className="lp-btn lp-btn--primary">Register as Student</Link>
                        <Link to="/login" className="lp-btn lp-btn--teal">Register as Company</Link>
                    </div>
                    <div className="lp-metadata" style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                        *Admin verification required for all company accounts.
                    </div>
                </div>
            </section>

            {/* ── I) FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer-inner">
                        <div className="lp-footer-col">
                            <Link to="/" className="lp-footer-logo">
                                <img src="/logo-mono-long.png" alt="InterNova" />
                            </Link>
                            <div className="lp-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                Bridging students, industry companies, and university administrators.
                            </div>
                        </div>
                        <div className="lp-footer-col">
                            <div className="lp-footer-col-title">Product</div>
                            <Link to="/internships" className="lp-footer-link">Internships</Link>
                            <a href="#" className="lp-footer-link">Projects</a>
                            <a href="#" className="lp-footer-link">Competitions</a>
                        </div>
                        <div className="lp-footer-col">
                            <div className="lp-footer-col-title">Company</div>
                            <a href="#" className="lp-footer-link">About Us</a>
                            <a href="#" className="lp-footer-link">Contact</a>
                            <a href="#" className="lp-footer-link">Universities</a>
                        </div>
                        <div className="lp-footer-col">
                            <div className="lp-footer-col-title">Legal</div>
                            <a href="#" className="lp-footer-link">Privacy Policy</a>
                            <a href="#" className="lp-footer-link">Terms of Service</a>
                            <a href="#" className="lp-footer-link">Cookies</a>
                        </div>
                    </div>
                    <div className="lp-footer-bottom">
                        &copy; 2026 InterNova. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
}

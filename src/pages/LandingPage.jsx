import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2, GraduationCap, ArrowRight, ShieldCheck,
    HeartHandshake, Briefcase, FileCode, CheckCircle2, UserCircle,
    Star, Users, Zap, Globe, Lock
} from 'lucide-react';

/**
 * LandingPage Component
 * 
 * The primary public-facing 'Home' index page of the application.
 * Highlights the value proposition of InterNova for Students, Companies, and Universities.
 * features a "wow" premium design with full mobile responsiveness, 
 * glassmorphism, and smooth animations in a clean LIGHT THEME.
 */
export default function LandingPage() {
    const [activeTab, setActiveTab] = useState('student');

    return (
        <div className="lp-root">
            {/* ── HERO SECTION ── */}
            <section className="lp-hero">
                <div className="lp-hero-bg">
                    <div className="lp-hero-orb lp-hero-orb--azure"></div>
                    <div className="lp-hero-orb lp-hero-orb--teal"></div>
                </div>
                <div className="lp-container">
                    <div className="lp-hero-content">
                        <h1 className="lp-h1">The Future of University <span style={{ color: 'var(--lp-blue)' }}>Career Growth.</span></h1>
                        <p className="lp-body">
                            InterNova connects ambitious students with verified industry opportunities. 
                            A centralized ecosystem for internships, projects, and competitions.
                        </p>
                        <div className="lp-hero-actions">
                            <Link to="/register" className="lp-btn lp-btn--primary">
                                Get Started Free <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="lp-btn lp-btn--outline">
                                View Demo
                            </Link>
                        </div>
                       
                    </div>

                    <div className="lp-dash-preview">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ height: '12px', width: '100px', background: 'var(--lp-slate)', borderRadius: '6px' }}></div>
                            <div style={{ height: '12px', width: '40px', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '6px' }}></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ height: '80px', background: 'var(--lp-gray)', borderRadius: '16px', border: '1px solid var(--lp-border)' }}></div>
                            <div style={{ height: '80px', background: 'var(--lp-gray)', borderRadius: '16px', border: '1px solid var(--lp-border)' }}></div>
                        </div>
                        <div style={{ height: '140px', background: 'linear-gradient(180deg, var(--lp-gray) 0%, transparent 100%)', borderRadius: '16px', border: '1px solid var(--lp-border)', padding: '16px' }}>
                            <div style={{ height: '8px', width: '60%', background: 'var(--lp-slate)', borderRadius: '4px', marginBottom: '12px' }}></div>
                            <div style={{ height: '8px', width: '40%', background: 'var(--lp-gray)', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="lp-section" style={{ marginTop: '-60px', zIndex: 10 }}>
                <div className="lp-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        <div className="lp-card" style={{ textAlign: 'center', background: 'white' }}>
                            <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--lp-blue)', marginBottom: '8px' }}>3.2k+</div>
                            <div className="lp-body" style={{ fontSize: '14px' }}>Verified Internships</div>
                        </div>
                        <div className="lp-card" style={{ textAlign: 'center', background: 'white' }}>
                            <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--lp-teal)', marginBottom: '8px' }}>85%</div>
                            <div className="lp-body" style={{ fontSize: '14px' }}>Placement Rate</div>
                        </div>
                        <div className="lp-card" style={{ textAlign: 'center', background: 'white' }}>
                            <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--lp-navy)', marginBottom: '8px' }}>$0</div>
                            <div className="lp-body" style={{ fontSize: '14px' }}>Cost for Universities</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-section-header" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                        <h2 className="lp-h2">Designed for Every Stakeholder</h2>
                        <p className="lp-body">A unified platform to bridge the gap between academic learning and professional excellence.</p>
                    </div>

                    <div className="lp-hiw-grid">
                        <div className="lp-card" style={{ background: 'white' }}>
                            <div className="lp-hiw-icon lp-hiw-icon--teal"><GraduationCap size={32} /></div>
                            <h3 className="lp-h3">For Students</h3>
                            <p className="lp-body" style={{ fontSize: '15px' }}>
                                Build your professional identity, apply to top-tier internships, and track every application in real-time.
                            </p>
                        </div>
                        <div className="lp-card" style={{ background: 'white' }}>
                            <div className="lp-hiw-icon lp-hiw-icon--azure"><Building2 size={32} /></div>
                            <h3 className="lp-h3">For Companies</h3>
                            <p className="lp-body" style={{ fontSize: '15px' }}>
                                Access a filtered pool of verified student talent. Manage recruitment pipelines and schedule interviews effortlessly.
                            </p>
                        </div>
                        <div className="lp-card" style={{ background: 'white' }}>
                            <div className="lp-hiw-icon lp-hiw-icon--navy"><ShieldCheck size={32} /></div>
                            <h3 className="lp-h3">For Admins</h3>
                            <p className="lp-body" style={{ fontSize: '15px' }}>
                                Full oversight of the placement ecosystem. Approve companies, verify postings, and monitor student success.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ── */}
            <section className="lp-section-alt">
                <div className="lp-container">
                    <div className="lp-section-header" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                        <h2 className="lp-h2">Powerful Features for Modern Growth</h2>
                    </div>

                    <div className="lp-features-grid">
                        <div className="lp-feature-item">
                            <Zap className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Real-time Tracking</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Visual pipeline for every application. Know exactly where you stand at any moment.</p>
                        </div>
                        <div className="lp-feature-item">
                            <Lock className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Secure Verification</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Multi-step verification for all companies and internships to ensure student safety.</p>
                        </div>
                        <div className="lp-feature-item">
                            <Globe className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Global Discovery</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Discover opportunities from startups to Fortune 500 companies in one place.</p>
                        </div>
                        <div className="lp-feature-item">
                            <FileCode className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Project Lab</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Join collaborative projects and hackathons to build your portfolio outside the classroom.</p>
                        </div>
                        <div className="lp-feature-item">
                            <Briefcase className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Interview Hub</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Consolidated view for all interview invitations and scheduling tools.</p>
                        </div>
                        <div className="lp-feature-item">
                            <UserCircle className="lp-trust-icon" size={24} style={{ marginBottom: '16px' }} />
                            <h3 className="lp-h3">Smart Profiles</h3>
                            <p className="lp-body" style={{ fontSize: '14px' }}>Dynamic resumes that highlight your projects, skills, and competition wins.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ROLE PORTALS ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-section-header" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                        <h2 className="lp-h2">A Unified Experience</h2>
                        <div className="lp-tabs-header" style={{ marginTop: '24px' }}>
                            <button className={`lp-tab-btn ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>Student</button>
                            <button className={`lp-tab-btn ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>Company</button>
                            <button className={`lp-tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin</button>
                        </div>
                    </div>

                    <div className="lp-tab-content">
                        {activeTab === 'student' && (
                            <div className="lp-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lp-gray)' }}>
                                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                    <UserCircle size={64} style={{ marginBottom: '16px' }} />
                                    <p>Interactive Student Dashboard Preview</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'company' && (
                            <div className="lp-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lp-gray)' }}>
                                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                    <Building2 size={64} style={{ marginBottom: '16px' }} />
                                    <p>Recruiter Pipeline Vista</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'admin' && (
                            <div className="lp-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lp-gray)' }}>
                                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                    <ShieldCheck size={64} style={{ marginBottom: '16px' }} />
                                    <p>Comprehensive Admin Overview</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="lp-section-alt">
                <div className="lp-container">
                    <div className="lp-section-header" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                        <h2 className="lp-h2">Trusted by the Community</h2>
                    </div>
                    <div className="lp-trust-grid">
                        <div className="lp-card" style={{ background: 'white' }}>
                            <p className="lp-testimonial">"InterNova redefined how we handle placements. The automated verification and tracking saved us hundreds of hours."</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lp-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>R</div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Robert Fox</div>
                                    <div style={{ fontSize: '12px', color: 'var(--lp-text-secondary)' }}>Placement Director, MIT</div>
                                </div>
                            </div>
                        </div>
                        <div className="lp-card" style={{ background: 'white' }}>
                            <p className="lp-testimonial">"The quality of candidates we received exceeded our expectations. The platform is intuitive and high-performing."</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lp-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>J</div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Jane Cooper</div>
                                    <div style={{ fontSize: '12px', color: 'var(--lp-text-secondary)' }}>HR Manager, Google</div>
                                </div>
                            </div>
                        </div>
                        <div className="lp-card" style={{ background: 'white' }}>
                            <p className="lp-testimonial">"I found my dream internship within two weeks. The application tracker kept me informed every step of the way."</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lp-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>C</div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Cody Fisher</div>
                                    <div style={{ fontSize: '12px', color: 'var(--lp-text-secondary)' }}>CS Student, Stanford</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="lp-section">
                <div className="lp-container">
                    <div className="lp-cta">
                        <h2 className="lp-h2" style={{ color: 'white', marginBottom: '24px' }}>Ready to Scale Your Career?</h2>
                        <p className="lp-body" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '600px', marginInline: 'auto' }}>
                            Join thousands of students and hundreds of companies already using InterNova to bridge the gap between education and industry.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <Link to="/register" className="lp-btn lp-btn--teal">Join as Student</Link>
                            <Link to="/register?role=Company" className="lp-btn lp-btn--outline" style={{ color: 'white', borderColor: 'white' }}>Hire Talent</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer-inner">
                        <div className="lp-footer-col">
                            <Building2 size={32} style={{ marginBottom: '16px', color: 'var(--lp-blue)' }} />
                            <p className="lp-body" style={{ fontSize: '14px' }}>Bridging the gap between university talent and industry excellence.</p>
                        </div>
                        <div className="lp-footer-col">
                            <h4 style={{ marginBottom: '16px' }}>Platform</h4>
                            <Link to="/internships" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>Internships</Link>
                            <Link to="/projects" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>Projects</Link>
                            <Link to="/competitions" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block' }}>Competitions</Link>
                        </div>
                        <div className="lp-footer-col">
                            <h4 style={{ marginBottom: '16px' }}>Company</h4>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>About</a>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>Privacy</a>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block' }}>Terms</a>
                        </div>
                        <div className="lp-footer-col">
                            <h4 style={{ marginBottom: '16px' }}>Connect</h4>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>LinkedIn</a>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>Twitter</a>
                            <a href="#" className="lp-body" style={{ fontSize: '14px', textDecoration: 'none', display: 'block' }}>Github</a>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid var(--lp-border)', color: 'var(--lp-text-secondary)', fontSize: '13px' }}>
                        © 2026 InterNova. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Server, Lock,
    GraduationCap, Building2, BarChart2,
    Rocket, Star, Globe, Award
} from 'lucide-react';

/**
 * AuthLayout Component
 *
 * A structured split-screen wrapper used for authentication pages (Login/Register).
 * The left brand panel cycles through multiple themed slides with smooth fade transitions.
 * The right panel wraps the active authentication form.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The specific authentication form to render.
 * @returns {JSX.Element} The split-view authentication layout.
 */

const SLIDES = [
    {
        gradient: 'radial-gradient(circle at 0% 0%, rgba(0, 120, 212, 0.20) 0%, transparent 65%)',
        headline: 'Secure Access to Verified Opportunities',
        sub: 'A centralized university platform bridging students, companies, and administrators through secure, structured opportunity management.',
        items: [
            { Icon: Lock,       label: 'Role-Based Access Control' },
            { Icon: ShieldCheck, label: 'Secure JWT Authentication' },
            { Icon: Server,     label: 'Azure Cloud Infrastructure' },
        ],
    },
    {
        gradient: 'radial-gradient(circle at 100% 0%, rgba(29, 137, 84, 0.20) 0%, transparent 65%)',
        headline: 'Launch Your Career with Real Internships',
        sub: 'Discover curated internship listings from verified companies, apply in seconds, and track every step of your application journey.',
        items: [
            { Icon: GraduationCap, label: 'University-Verified Students' },
            { Icon: Building2,     label: 'Top-Tier Company Partners' },
            { Icon: BarChart2,     label: 'Real-Time Application Tracking' },
        ],
    },
    {
        gradient: 'radial-gradient(circle at 50% 100%, rgba(249, 168, 37, 0.18) 0%, transparent 65%)',
        headline: 'Post Opportunities. Hire Top Talent.',
        sub: 'Companies can post internships, review student profiles, manage applications, and build a pipeline of tomorrow\'s professionals — all in one place.',
        items: [
            { Icon: Rocket,  label: 'Post Internships in Minutes' },
            { Icon: Star,    label: 'Smart Candidate Shortlisting' },
            { Icon: Globe,   label: 'Reach Students Across Universities' },
        ],
    },
    {
        gradient: 'radial-gradient(circle at 0% 100%, rgba(108, 99, 255, 0.20) 0%, transparent 65%)',
        headline: 'A Platform Built for Academic Excellence',
        sub: 'Competitions, projects, and internships all on one platform — designed to enrich student portfolios and connect them with the opportunities they deserve.',
        items: [
            { Icon: Award,       label: 'Competitions & Challenges' },
            { Icon: BarChart2,   label: 'Portfolio Analytics' },
            { Icon: ShieldCheck, label: 'Admin-Controlled Verification' },
        ],
    },
];

const INTERVAL_MS = 4500;

export default function AuthLayout({ children }) {
    const [active, setActive] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            // Fade out
            setVisible(false);
            setTimeout(() => {
                setActive(prev => (prev + 1) % SLIDES.length);
                setVisible(true);
            }, 400); // matches CSS transition duration
        }, INTERVAL_MS);

        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[active];

    return (
        <div className="auth-layout">
            {/* ── Left Brand Panel ── */}
            <div className="auth-panel-brand">
                {/* Dynamic gradient overlay — changes per slide */}
                <div
                    className="auth-brand-gradient"
                    style={{ background: slide.gradient }}
                />

                <div className="auth-brand-inner">
                    {/* Logo — always visible */}
                  

                    {/* Animated slide content */}
                    <div className={`auth-slide-content ${visible ? 'auth-slide--in' : 'auth-slide--out'}`}>
                        <h1 className="auth-brand-h1">{slide.headline}</h1>
                        <p className="auth-brand-sub">{slide.sub}</p>

                        <div className="auth-trust-list">
                            {slide.items.map(({ Icon, label }) => (
                                <div className="auth-trust-item" key={label}>
                                    <Icon size={18} className="auth-trust-icon" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className="auth-slide-dots">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                className={`auth-dot ${i === active ? 'auth-dot--active' : ''}`}
                                onClick={() => {
                                    setVisible(false);
                                    setTimeout(() => { setActive(i); setVisible(true); }, 400);
                                }}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="auth-panel-form">
                {children}
            </div>
        </div>
    );
}

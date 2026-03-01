import { Link } from 'react-router-dom';
import { ShieldCheck, Server, Lock } from 'lucide-react';

export default function AuthLayout({ children }) {
    return (
        <div className="auth-layout">
            <div className="auth-panel-brand">
                <div className="auth-brand-inner">
                    <Link to="/">
                        <img src="/logo-mono-long.png" alt="InterNova" className="auth-brand-logo" />
                    </Link>
                    <h1 className="auth-brand-h1">Secure Access to Verified Opportunities</h1>
                    <p className="auth-brand-sub">
                        A centralized university platform bridging students, companies, and administrators through secure and structured opportunity management.
                    </p>

                    <div className="auth-trust-list">
                        <div className="auth-trust-item">
                            <Lock size={18} className="auth-trust-icon" /> Role-Based Access Control
                        </div>
                        <div className="auth-trust-item">
                            <ShieldCheck size={18} className="auth-trust-icon" /> Secure JWT Authentication
                        </div>
                        <div className="auth-trust-item">
                            <Server size={18} className="auth-trust-icon" /> Azure Cloud Infrastructure
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-panel-form">
                {children}
            </div>
        </div>
    );
}

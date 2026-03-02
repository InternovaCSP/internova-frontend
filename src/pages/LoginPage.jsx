import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage Component
 * 
 * Handles user authentication against the backend API.
 * Uses the global AuthContext to invoke login logic and store the resulting JWT.
 * Features inline validation, loading states, and secure password visibility toggles.
 * Automatically routes users to their respective dashboards upon successful login.
 * 
 * @returns {JSX.Element} The login form wrapped in the AuthLayout.
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [pendingRedirect, setPendingRedirect] = useState(false);

    /**
     * Navigate AFTER AuthContext has committed the user state.
     *
     * Why this matters:
     * login() calls setToken + setUser inside AuthContext. React batches these
     * state updates and commits them asynchronously. If we call navigate()
     * in the same synchronous block, ProtectedRoute renders with the OLD
     * user state (null) and immediately redirects back to /login.
     *
     * By setting pendingRedirect=true and watching user in a useEffect, we
     * guarantee navigation only happens AFTER the re-render where user is set.
     */
    useEffect(() => {
        if (pendingRedirect && user) {
            const roleRoutes = {
                Student: '/student/dashboard',
                Company: '/company/dashboard',
                Admin: '/admin/dashboard',
            };
            navigate(roleRoutes[user.role] ?? '/', { replace: true });
            setPendingRedirect(false);
        }
    }, [pendingRedirect, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            await login(formData.email, formData.password);
            // Signal the useEffect to redirect once user state is confirmed
            setPendingRedirect(true);
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-card-header">
                    <h2 className="auth-card-title">
                        Sign In <Lock size={20} style={{ color: 'var(--auth-teal)' }} />
                    </h2>
                    <p className="auth-card-sub">Access your portal to manage applications and opportunities.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMsg && (
                        <div style={{ backgroundColor: '#fef2f2', color: 'var(--auth-error)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} /> {errorMsg}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="auth-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@university.edu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="pwd-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="auth-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="pwd-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-utils">
                        <label className="remember-me">
                            <input type="checkbox" name="remember" />
                            Keep me logged in
                        </label>
                        <a href="#" className="auth-link">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="spinner"></div> : "Login"}
                    </button>

                    <div className="auth-divider">OR</div>

                    <div className="auth-footer-text">
                        Don't have an account? <Link to="/register" className="auth-link auth-link--teal">Register here</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

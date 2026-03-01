import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login attempt:', formData);
            // navigate('/dashboard');
        }, 1200);
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

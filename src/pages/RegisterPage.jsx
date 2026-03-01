import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, GraduationCap, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Dynamic Fields
        universityId: '',
        department: '',
        companyName: '',
        industry: ''
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
            console.log('Register attempt:', { role, ...formData });
            // navigate('/dashboard');
        }, 1200);
    };

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-card-header">
                    <h2 className="auth-card-title">Create Account</h2>
                    <p className="auth-card-sub" style={{ marginBottom: '24px' }}>
                        Join InterNova to access internships, projects, and verify your university status.
                    </p>

                    <div className="role-tabs">
                        <div
                            className={`role-tab ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            <GraduationCap size={16} /> Student
                        </div>
                        <div
                            className={`role-tab ${role === 'company' ? 'active' : ''}`}
                            onClick={() => setRole('company')}
                        >
                            <Building2 size={16} /> Company
                        </div>
                        <div
                            className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
                        >
                            <ShieldCheck size={16} /> Admin
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="auth-input"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">University or Work Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="auth-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@university.edu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="pwd-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="auth-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label" htmlFor="confirmPassword">Confirm</label>
                                <div className="pwd-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="auth-input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="pwd-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Simulated Password Strength UI */}
                        {formData.password.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--auth-teal)', borderRadius: '2px' }}></div>
                                <div style={{ height: '4px', flex: 1, backgroundColor: formData.password.length > 5 ? 'var(--auth-teal)' : 'var(--auth-border)', borderRadius: '2px' }}></div>
                                <div style={{ height: '4px', flex: 1, backgroundColor: formData.password.length > 8 ? 'var(--auth-teal)' : 'var(--auth-border)', borderRadius: '2px' }}></div>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Fields Section */}
                    <div className={`dynamic-fields ${role === 'student' ? 'open' : ''}`}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label className="form-label" htmlFor="universityId">Student ID</label>
                                <input
                                    type="text"
                                    id="universityId"
                                    name="universityId"
                                    className="auth-input"
                                    value={formData.universityId}
                                    onChange={handleChange}
                                    placeholder="Ex: 20210543"
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="department">Department</label>
                                <select
                                    className="auth-input"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    style={{ height: '45px' }} /* Align visual height */
                                >
                                    <option value="">Select Dept...</option>
                                    <option value="cs">Computer Science</option>
                                    <option value="eng">Engineering</option>
                                    <option value="bus">Business</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`dynamic-fields ${role === 'company' ? 'open' : ''}`}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label className="form-label" htmlFor="companyName">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    className="auth-input"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Microsoft Inc."
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="industry">Industry</label>
                                <select
                                    className="auth-input"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    style={{ height: '45px' }}
                                >
                                    <option value="">Select Industry...</option>
                                    <option value="tech">Technology</option>
                                    <option value="finance">Finance</option>
                                    <option value="health">Healthcare</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`dynamic-fields ${role === 'admin' ? 'open' : ''}`}>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label" htmlFor="adminKey">Admin Verification Key</label>
                            <input
                                type="text"
                                id="adminKey"
                                name="adminKey"
                                className="auth-input"
                                placeholder="Enter university issued key"
                            />
                            <div className="form-error" style={{ color: 'var(--auth-text-sec)', marginTop: '4px', animation: 'none' }}>
                                Required for elevated platform access.
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="spinner"></div> : "Create Account"}
                    </button>

                    <div className="auth-footer-text" style={{ marginTop: '24px' }}>
                        Already have an account? <Link to="/login" className="auth-link auth-link--teal">Sign in</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

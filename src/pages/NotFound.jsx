import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <div className="auth-logo">404</div>
                <p className="auth-subtitle">Page not found</p>
                <button className="btn btn-primary" onClick={() => navigate('/login', { replace: true })}>
                    Go to Login
                </button>
            </div>
        </div>
    )
}

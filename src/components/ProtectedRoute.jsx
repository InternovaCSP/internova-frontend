import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_DASHBOARDS = {
    Admin: '/admin/dashboard',
    Student: '/student/dashboard',
    Company: '/company/dashboard',
}

/**
 * ProtectedRoute Component
 * 
 * A higher-order wrapper component that restricts access to role-gated routes.
 * 
 * Behavior:
 * - If no authentication token or user exists, redirects to `/login`.
 * - If the authenticated user's role is not included in the `allowedRoles` array, 
 *   redirects them to their appropriate specific role Dashboard based on ROLE_DASHBOARDS map.
 * - Otherwise, correctly renders the requested child component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected page component to render.
 * @param {string[]} props.allowedRoles - Array of roles permitted to view this route (e.g., ['Student', 'Admin']).
 * @returns {JSX.Element} The children or a Navigate redirection element.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, user } = useAuth()

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const correct = ROLE_DASHBOARDS[user.role] ?? '/login'
        return <Navigate to={correct} replace />
    }

    return children
}

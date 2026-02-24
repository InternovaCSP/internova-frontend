import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_DASHBOARDS = {
    Admin: '/admin/dashboard',
    Student: '/student/dashboard',
    Company: '/company/dashboard',
}

/**
 * ProtectedRoute
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={['Student']}>
 *     <StudentDashboard />
 *   </ProtectedRoute>
 *
 * - No token → redirect to /login
 * - Token present but wrong role → redirect to the user's correct dashboard
 * - Role matches (or no allowedRoles restriction) → render children
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

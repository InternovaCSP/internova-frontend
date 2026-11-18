import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_DASHBOARDS = {
  Admin: '/admin/dashboard',
  Student: '/student/dashboard',
  Company: '/company/dashboard',
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] ?? '/login'} replace />;
  }

  return children;
}

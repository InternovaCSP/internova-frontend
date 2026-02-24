import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import StartupLoader from './components/StartupLoader'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function App() {
    return (
        <>
            <StartupLoader />
            <Routes>
                {/* Public — redirect root to /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected — role-gated */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Company']}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App

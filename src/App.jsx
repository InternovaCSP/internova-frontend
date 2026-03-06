import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import TopNavbar from './components/TopNavbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminCompaniesPage from './pages/AdminCompaniesPage'
import StudentProfilePage from './pages/StudentProfilePage'
import NotFound from './pages/NotFound'
import InternshipsPage from './pages/InternshipsPage'
import ProjectsPage from './pages/ProjectsPage'
import CompetitionsPage from './pages/CompetitionsPage'

/**
 * App Component
 * 
 * Serves as the primary routing configuration for the InterNova frontend.
 * Defines both public routes (accessible to anyone) and protected routes
 * (gated by specific user roles like Student, Company, or Admin).
 * The universal TopNavbar is rendered securely outside the Routes wrapper
 * so it remains sticky across all page transitions.
 *
 * @returns {JSX.Element} The rendered React Router tree.
 */
function App() {
    return (
        <>
            <TopNavbar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/internships" element={<InternshipsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
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
                    path="/student/profile"
                    element={
                        <ProtectedRoute allowedRoles={['Student']}>
                            <StudentProfilePage />
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
                <Route
                    path="/admin/companies"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminCompaniesPage />
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

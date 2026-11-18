import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './shared/context/NotificationContext';
import AppLayout from './shared/layouts/AppLayout';
import ProtectedRoute from './shared/components/navigation/ProtectedRoute';

import LandingPage from './modules/landing/pages/LandingPage';
import NotFoundPage from './modules/landing/pages/NotFoundPage';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';

import InternshipsPage from './modules/internships/pages/InternshipsPage';
import CreateInternshipPage from './modules/internships/pages/CreateInternshipPage';
import ProjectsPage from './modules/projects/pages/ProjectsPage';
import CompetitionsPage from './modules/competitions/pages/CompetitionsPage';
import SeminarsPage from './modules/seminars/pages/SeminarsPage';

import StudentDashboardPage from './modules/student/pages/StudentDashboardPage';
import BreakoutRoomsPage from './modules/student/pages/BreakoutRoomsPage';

import CompanyDashboardPage from './modules/company/pages/CompanyDashboardPage';
import CompanyApplicationsPage from './modules/company/pages/CompanyApplicationsPage';

import AdminLayout from './modules/admin/components/AdminLayout';
import AdminDashboardPage from './modules/admin/pages/AdminDashboardPage';
import AdminCompaniesPage from './modules/admin/pages/AdminCompaniesPage';
import AdminInternshipsPage from './modules/admin/pages/AdminInternshipsPage';
import AdminProjectsPage from './modules/admin/pages/AdminProjectsPage';
import AdminSettingsPage from './modules/admin/pages/AdminSettingsPage';

import ProfilePage from './modules/account/pages/ProfilePage';
import SettingsPage from './modules/account/pages/SettingsPage';
import NotificationsPage from './modules/account/pages/NotificationsPage';

function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Auth pages (full-screen split layout without TopNavbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Standard pages (wrapped with TopNavbar) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/breakout-rooms" element={<BreakoutRoomsPage />} />
          <Route path="/seminars" element={<SeminarsPage />} />

          {/* Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Company */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Company']}>
                <CompanyDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/create-internship"
            element={
              <ProtectedRoute allowedRoles={['Company']}>
                <CreateInternshipPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applications"
            element={
              <ProtectedRoute allowedRoles={['Company']}>
                <CompanyApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Account */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['Student', 'Company', 'Admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['Student', 'Company', 'Admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['Student', 'Company', 'Admin']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin portal (dedicated sidebar layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="internships" element={<AdminInternshipsPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;

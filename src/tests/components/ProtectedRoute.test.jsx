/**
 * src/tests/components/ProtectedRoute.test.jsx
 *
 * Unit tests for ProtectedRoute — unauthenticated redirect, wrong-role redirect,
 * and successful child rendering for all supported roles.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';
import { makeFakeJwt } from '../utils/testHelpers';

// Place sentinel pages at the expected redirect targets
function RoutingHarness({ token, allowedRoles, children }) {
    if (token) localStorage.setItem('internova_token', token);

    return (
        <MemoryRouter initialEntries={['/protected']}>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute allowedRoles={allowedRoles}>
                                {children}
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/student/dashboard" element={<div>Student Dashboard</div>} />
                    <Route path="/company/dashboard" element={<div>Company Dashboard</div>} />
                    <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('ProtectedRoute', () => {
    describe('unauthenticated access', () => {
        it('redirects to /login when no token exists', () => {
            render(
                <RoutingHarness token={null} allowedRoles={['Student']}>
                    <div>Secret Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Login Page')).toBeInTheDocument();
            expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
        });

        it('redirects to /login for an invalid (corrupt) token', () => {
            render(
                <RoutingHarness token="not.valid.jwt" allowedRoles={['Student']}>
                    <div>Secret Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
    });

    describe('wrong-role access', () => {
        it('redirects a Student to /student/dashboard if accessing an Admin-only route', () => {
            const jwt = makeFakeJwt({ user_id: '1', email: 'stu@test.com', role: 'Student' });
            render(
                <RoutingHarness token={jwt} allowedRoles={['Admin']}>
                    <div>Admin Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
            expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
        });

        it('redirects a Company user to /company/dashboard when accessing a Student route', () => {
            const jwt = makeFakeJwt({ user_id: '2', email: 'co@test.com', role: 'Company' });
            render(
                <RoutingHarness token={jwt} allowedRoles={['Student']}>
                    <div>Student-only Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Company Dashboard')).toBeInTheDocument();
        });

        it('redirects an Admin to /admin/dashboard when accessing a Company route', () => {
            const jwt = makeFakeJwt({ user_id: '3', email: 'adm@test.com', role: 'Admin' });
            render(
                <RoutingHarness token={jwt} allowedRoles={['Company']}>
                    <div>Company-only Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });

    describe('authorized access', () => {
        it('renders children when user role is in allowedRoles', () => {
            const jwt = makeFakeJwt({ user_id: '5', email: 'stu@test.com', role: 'Student' });
            render(
                <RoutingHarness token={jwt} allowedRoles={['Student']}>
                    <div>Protected Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });

        it('renders children for multi-role routes when user matches one role', () => {
            const jwt = makeFakeJwt({ user_id: '6', email: 'adm@test.com', role: 'Admin' });
            render(
                <RoutingHarness token={jwt} allowedRoles={['Student', 'Company', 'Admin']}>
                    <div>Universal Content</div>
                </RoutingHarness>
            );
            expect(screen.getByText('Universal Content')).toBeInTheDocument();
        });
    });
});

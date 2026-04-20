/**
 * src/tests/context/AuthContext.test.jsx
 *
 * Unit tests for AuthContext — parseToken, login, register, logout,
 * storeToken, and the useAuth guard hook.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { makeFakeJwt } from '../utils/testHelpers';

// ─── Mock the api service ──────────────────────────────────────────────────────
vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
        get:  vi.fn(),
        interceptors: { request: { use: vi.fn() } },
    },
}));

import api from '../../services/api';

// ─── Helper to render inside AuthProvider ─────────────────────────────────────
// Renders auth context and keeps a mutable ref that always points to latest value
function AuthConsumer({ authRef }) {
    const auth = useAuth();
    authRef.current = auth;
    return null;
}

function renderWithAuth(token = null) {
    if (token) localStorage.setItem('internova_token', token);
    const authRef = { current: null };
    render(
        <MemoryRouter>
            <AuthProvider>
                <AuthConsumer authRef={authRef} />
            </AuthProvider>
        </MemoryRouter>
    );
    return authRef;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AuthContext', () => {
    // ── Initial state ──────────────────────────────────────────────────────
    describe('initial state', () => {
        it('starts with null token and user when localStorage is empty', () => {
            const authRef = renderWithAuth();
            expect(authRef.current.token).toBeNull();
            expect(authRef.current.user).toBeNull();
        });

        it('hydrates token and user from localStorage on mount', () => {
            const jwt = makeFakeJwt({ user_id: '42', email: 'alice@test.com', role: 'Student' });
            const authRef = renderWithAuth(jwt);
            expect(authRef.current.token).toBe(jwt);
            expect(authRef.current.user).toMatchObject({ userId: '42', email: 'alice@test.com', role: 'Student' });
        });

        it('sets user to null for an invalid / corrupt token in localStorage', () => {
            localStorage.setItem('internova_token', 'not.a.jwt');
            const authRef = renderWithAuth();
            expect(authRef.current.user).toBeNull();
        });
    });

    // ── login ──────────────────────────────────────────────────────────────
    describe('login()', () => {
        it('calls POST /auth/login and stores the returned token', async () => {
            const jwt = makeFakeJwt({ user_id: '1', email: 'bob@test.com', role: 'Student' });
            api.post.mockResolvedValueOnce({ data: { token: jwt } });

            const authRef = renderWithAuth();

            await act(async () => {
                await authRef.current.login('bob@test.com', 'password123');
            });

            expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'bob@test.com', password: 'password123' });
            expect(localStorage.getItem('internova_token')).toBe(jwt);
            await waitFor(() => expect(authRef.current.user?.email).toBe('bob@test.com'));
        });

        it('throws when the API call rejects', async () => {
            api.post.mockRejectedValueOnce(new Error('401 Unauthorized'));

            const authRef = renderWithAuth();

            await expect(
                act(async () => { await authRef.current.login('bad@user.com', 'wrong'); })
            ).rejects.toThrow('401 Unauthorized');
        });
    });

    // ── register ───────────────────────────────────────────────────────────
    describe('register()', () => {
        it('calls POST /auth/register with correct payload', async () => {
            api.post.mockResolvedValueOnce({ data: { message: 'Registered' } });

            const authRef = renderWithAuth();

            await act(async () => {
                await authRef.current.register('Carol', 'carol@test.com', 'secure', 'Student');
            });

            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                fullName: 'Carol', email: 'carol@test.com', password: 'secure', role: 'Student',
            });
        });

        it('does NOT store a token after registration (registration ≠ login)', async () => {
            api.post.mockResolvedValueOnce({ data: {} });

            const authRef = renderWithAuth();

            await act(async () => {
                await authRef.current.register('Dan', 'dan@test.com', 'pw', 'Company');
            });

            expect(localStorage.getItem('internova_token')).toBeNull();
            expect(authRef.current.token).toBeNull();
        });
    });

    // ── logout ─────────────────────────────────────────────────────────────
    describe('logout()', () => {
        it('clears token, user, and localStorage on logout', async () => {
            const jwt = makeFakeJwt({ user_id: '5', email: 'eve@test.com', role: 'Admin' });
            api.post.mockResolvedValueOnce({ data: { token: jwt } });

            const authRef = renderWithAuth();

            await act(async () => { await authRef.current.login('eve@test.com', 'pass'); });
            await waitFor(() => expect(authRef.current.token).toBe(jwt));

            act(() => { authRef.current.logout(); });

            await waitFor(() => expect(authRef.current.token).toBeNull());
            expect(authRef.current.user).toBeNull();
            expect(localStorage.getItem('internova_token')).toBeNull();
        });
    });

    // ── role parsing ───────────────────────────────────────────────────────
    describe('role parsing from JWT', () => {
        it('extracts role from microsoft claims namespace', () => {
            const claimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
            const jwt = makeFakeJwt({ [claimKey]: 'Admin', sub: '99', email: 'admin@test.com' });
            const authRef = renderWithAuth(jwt);
            expect(authRef.current.user.role).toBe('Admin');
        });

        it('prefers the "role" field over the microsoft claims key', () => {
            const claimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
            const jwt = makeFakeJwt({ role: 'Student', [claimKey]: 'Admin', sub: '7', email: 'test@test.com' });
            const authRef = renderWithAuth(jwt);
            expect(authRef.current.user.role).toBe('Student');
        });
    });

    // ── useAuth guard ──────────────────────────────────────────────────────
    describe('useAuth guard', () => {
        it('throws an error when called outside <AuthProvider>', () => {
            // Suppress React's own error boundary logs
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            function Bare() { useAuth(); return null; }
            expect(() => render(<MemoryRouter><Bare /></MemoryRouter>)).toThrow('useAuth must be used within <AuthProvider>');
            spy.mockRestore();
        });
    });
});

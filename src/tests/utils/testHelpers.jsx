/**
 * src/tests/utils/testHelpers.jsx
 *
 * Shared render utilities that automatically wrap components with all
 * necessary providers (Router, AuthProvider, ThemeProvider).
 */
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

/**
 * Renders a component inside MemoryRouter + AuthProvider + ThemeProvider.
 * @param {React.ReactElement} ui
 * @param {Object} options
 * @param {string[]} options.initialEntries - Initial MemoryRouter paths
 * @returns Testing Library render result
 */
export function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <ThemeProvider>
                <AuthProvider>
                    {ui}
                </AuthProvider>
            </ThemeProvider>
        </MemoryRouter>
    );
}

/**
 * Returns a minimal valid internship object for test fixtures.
 */
export function buildInternship(overrides = {}) {
    return {
        id: 1,
        title: 'Software Intern',
        company: 'Tech Corp',
        status: 'Active',
        description: 'Work on cool projects.',
        location: 'Colombo',
        duration: '3 Months',
        deadline: '2026-12-31T00:00:00.000Z',
        currentUserStatus: null,
        ...overrides,
    };
}

/**
 * Returns a minimal valid competition object for test fixtures.
 */
export function buildCompetition(overrides = {}) {
    return {
        id: 10,
        title: 'Hackathon 2026',
        organizer: 'SLIIT',
        status: 'Upcoming',
        description: 'Annual coding competition.',
        deadline: '2026-06-30',
        eligibility: 'Undergraduates',
        category: 'Tech',
        skills: ['React', 'Node', 'Python'],
        currentUserStatus: null,
        ...overrides,
    };
}

/**
 * Creates a fake JWT that decodes to the supplied payload.
 * We base64url-encode the header and payload; signature is dummy.
 */
export function makeFakeJwt(payload) {
    const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.fakesig`;
}

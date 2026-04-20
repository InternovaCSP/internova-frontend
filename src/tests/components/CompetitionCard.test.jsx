/**
 * src/tests/components/CompetitionCard.test.jsx
 *
 * Unit tests for the CompetitionCard component covering:
 *  - Title, organizer, description, category, and skill rendering
 *  - Status badge for Upcoming / Ongoing / Closed
 *  - Register button states per user status (new, Registered, Won, etc.)
 *  - Winner badge visibility
 *  - Non-student users should not see the Register button
 *  - Callback invocations (onViewDetails, onRegister)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import CompetitionCard from '../../components/CompetitionCard';
import { buildCompetition } from '../utils/testHelpers';

// ── Helper ────────────────────────────────────────────────────────────────────
function renderCard(competitionOverrides = {}, props = {}) {
    const competition = buildCompetition(competitionOverrides);
    const onViewDetails = props.onViewDetails ?? vi.fn();
    const onRegister = props.onRegister ?? vi.fn();
    const userRole = props.userRole ?? 'Student';

    const result = render(
        <MemoryRouter>
            <CompetitionCard
                competition={competition}
                userRole={userRole}
                onViewDetails={onViewDetails}
                onRegister={onRegister}
            />
        </MemoryRouter>
    );

    return { ...result, onViewDetails, onRegister, competition };
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('CompetitionCard', () => {
    describe('content rendering', () => {
        it('renders the competition title', () => {
            renderCard({ title: 'AI Challenge 2026' });
            expect(screen.getByText('AI Challenge 2026')).toBeInTheDocument();
        });

        it('renders the organizer name', () => {
            renderCard({ organizer: 'IEEE Sri Lanka' });
            expect(screen.getByText('IEEE Sri Lanka')).toBeInTheDocument();
        });

        it('renders the description', () => {
            renderCard({ description: 'Build the next AI assistant.' });
            expect(screen.getByText('Build the next AI assistant.')).toBeInTheDocument();
        });

        it('renders the category tag', () => {
            renderCard({ category: 'Machine Learning' });
            expect(screen.getByText('Machine Learning')).toBeInTheDocument();
        });

        it('renders up to 3 skill tags', () => {
            renderCard({ skills: ['Python', 'TensorFlow', 'Keras'] });
            expect(screen.getByText('Python')).toBeInTheDocument();
            expect(screen.getByText('TensorFlow')).toBeInTheDocument();
            expect(screen.getByText('Keras')).toBeInTheDocument();
        });

        it('shows a "+N" overflow tag when there are more than 3 skills', () => {
            renderCard({ skills: ['A', 'B', 'C', 'D', 'E'] });
            expect(screen.getByText('+2')).toBeInTheDocument();
        });

        it('renders the deadline', () => {
            renderCard({ deadline: '2026-08-01' });
            expect(screen.getByText(/Deadline/i)).toBeInTheDocument();
        });
    });

    describe('status badge', () => {
        it('shows "Upcoming" badge for upcoming competitions', () => {
            renderCard({ status: 'Upcoming' });
            expect(screen.getByText('Upcoming')).toBeInTheDocument();
        });

        it('shows "Ongoing" badge for ongoing competitions', () => {
            renderCard({ status: 'Ongoing' });
            expect(screen.getByText('Ongoing')).toBeInTheDocument();
        });

        it('shows "Closed" badge for closed competitions', () => {
            renderCard({ status: 'Closed' });
            expect(screen.getByText('Closed')).toBeInTheDocument();
        });
    });

    describe('register button — Student role', () => {
        it('shows "Register" button when student has no status (not yet registered)', () => {
            renderCard({ currentUserStatus: null }, { userRole: 'Student' });
            expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
        });

        it('shows disabled "Registered" button when student is registered', () => {
            renderCard({ currentUserStatus: 'Registered' }, { userRole: 'Student' });
            const btn = screen.getByRole('button', { name: /Registered/i });
            expect(btn).toBeDisabled();
        });

        it('shows disabled "Participated" button for Submitted status', () => {
            renderCard({ currentUserStatus: 'Submitted' }, { userRole: 'Student' });
            const btn = screen.getByRole('button', { name: /Participated/i });
            expect(btn).toBeDisabled();
        });

        it('shows disabled "Winner" button when student won', () => {
            renderCard({ currentUserStatus: 'Won' }, { userRole: 'Student' });
            const btn = screen.getByRole('button', { name: /Winner/i });
            expect(btn).toBeDisabled();
        });
    });

    describe('register button — non-Student', () => {
        it('does NOT render register button for Company users', () => {
            renderCard({}, { userRole: 'Company' });
            expect(screen.queryByRole('button', { name: /Register/i })).not.toBeInTheDocument();
        });

        it('does NOT render register button for Admin users', () => {
            renderCard({}, { userRole: 'Admin' });
            expect(screen.queryByRole('button', { name: /Register/i })).not.toBeInTheDocument();
        });
    });

    describe('winner badge', () => {
        it('shows "Winner Achieved" badge when currentUserStatus is Won', () => {
            renderCard({ currentUserStatus: 'Won' });
            expect(screen.getByText(/Winner Achieved/i)).toBeInTheDocument();
        });

        it('does NOT show winner badge for non-winners', () => {
            renderCard({ currentUserStatus: 'Registered' });
            expect(screen.queryByText(/Winner Achieved/i)).not.toBeInTheDocument();
        });
    });

    describe('callbacks', () => {
        it('calls onViewDetails when "View Details" is clicked', () => {
            const onViewDetails = vi.fn();
            const { competition } = renderCard({}, { onViewDetails });
            fireEvent.click(screen.getByRole('button', { name: /View Details/i }));
            expect(onViewDetails).toHaveBeenCalledWith(competition);
        });

        it('calls onRegister with competition id when "Register" is clicked', () => {
            const onRegister = vi.fn();
            renderCard({ id: 42, currentUserStatus: null }, { userRole: 'Student', onRegister });
            fireEvent.click(screen.getByRole('button', { name: /Register/i }));
            expect(onRegister).toHaveBeenCalledWith(42);
        });

        it('does NOT call onRegister for a disabled (already registered) button', () => {
            const onRegister = vi.fn();
            renderCard({ currentUserStatus: 'Registered' }, { userRole: 'Student', onRegister });
            fireEvent.click(screen.getByRole('button', { name: /Registered/i }));
            expect(onRegister).not.toHaveBeenCalled();
        });
    });
});

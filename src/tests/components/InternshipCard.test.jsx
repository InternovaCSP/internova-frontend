/**
 * src/tests/components/InternshipCard.test.jsx
 *
 * Unit tests for the InternshipCard component covering:
 *  - Basic rendering of title, company, location, duration
 *  - Badge logic (Active, Closed, Selected)
 *  - Apply button visibility / disabled state per role
 *  - Progress track rendering for applied students
 *  - Callback invocations (onApply, onViewDetails)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import InternshipCard from '../../components/InternshipCard';
import { buildInternship } from '../utils/testHelpers';

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderCard(internshipOverrides = {}, props = {}) {
    const internship = buildInternship(internshipOverrides);
    const onApply = props.onApply ?? vi.fn();
    const onViewDetails = props.onViewDetails ?? vi.fn();
    const userRole = props.userRole ?? 'Student';

    const result = render(
        <InternshipCard
            internship={internship}
            userRole={userRole}
            onApply={onApply}
            onViewDetails={onViewDetails}
        />
    );

    return { ...result, onApply, onViewDetails, internship };
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('InternshipCard', () => {
    describe('content rendering', () => {
        it('renders the internship title', () => {
            renderCard({ title: 'Frontend Engineer Intern' });
            expect(screen.getByText('Frontend Engineer Intern')).toBeInTheDocument();
        });

        it('renders the company name', () => {
            renderCard({ company: 'Acme Ltd' });
            expect(screen.getByText('Acme Ltd')).toBeInTheDocument();
        });

        it('renders the location', () => {
            renderCard({ location: 'Kandy, Sri Lanka' });
            expect(screen.getByText('Kandy, Sri Lanka')).toBeInTheDocument();
        });

        it('renders the duration', () => {
            renderCard({ duration: '6 Months' });
            expect(screen.getByText('6 Months')).toBeInTheDocument();
        });

        it('renders a formatted deadline date', () => {
            renderCard({ deadline: '2027-01-15T00:00:00.000Z' });
            // Deadline label presents formatted date; exact format depends on locale
            expect(screen.getByText(/Deadline/i)).toBeInTheDocument();
        });

        it('renders the description', () => {
            renderCard({ description: 'Join our fast-paced team.' });
            expect(screen.getByText('Join our fast-paced team.')).toBeInTheDocument();
        });
    });

    describe('status badge', () => {
        it('shows "Active" badge for open internships with no user status', () => {
            renderCard({ status: 'Active', currentUserStatus: null });
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('shows "Closed" badge when status is Closed', () => {
            renderCard({ status: 'Closed' });
            expect(screen.getByText('Closed')).toBeInTheDocument();
        });

        it('shows "Selected" badge when currentUserStatus is Selected', () => {
            renderCard({ status: 'Active', currentUserStatus: 'Selected' });
            expect(screen.getByText('Selected')).toBeInTheDocument();
        });
    });

    describe('apply button — Student role', () => {
        it('shows enabled "Apply Now" button when student has not applied', () => {
            renderCard({ currentUserStatus: null }, { userRole: 'Student' });
            const btn = screen.getByRole('button', { name: /Apply Now/i });
            expect(btn).toBeInTheDocument();
            expect(btn).not.toBeDisabled();
        });

        it('shows disabled "Applied" button when student has already applied', () => {
            renderCard({ currentUserStatus: 'Applied' }, { userRole: 'Student' });
            const btn = screen.getByRole('button', { name: /Applied/i });
            expect(btn).toBeDisabled();
        });

        it('disables the apply button when internship is Closed', () => {
            renderCard(
                { status: 'Closed', currentUserStatus: null },
                { userRole: 'Student' }
            );
            const btn = screen.getByRole('button', { name: /Apply Now/i });
            expect(btn).toBeDisabled();
        });
    });

    describe('apply button — non-Student role', () => {
        it('does NOT render the apply button for Company users', () => {
            renderCard({}, { userRole: 'Company' });
            expect(screen.queryByRole('button', { name: /Apply Now/i })).not.toBeInTheDocument();
        });

        it('does NOT render the apply button for Admin users', () => {
            renderCard({}, { userRole: 'Admin' });
            expect(screen.queryByRole('button', { name: /Apply Now/i })).not.toBeInTheDocument();
        });
    });

    describe('callbacks', () => {
        it('calls onViewDetails with the internship object when "View Details" is clicked', () => {
            const onViewDetails = vi.fn();
            const { internship } = renderCard({}, { onViewDetails });
            fireEvent.click(screen.getByRole('button', { name: /View Details/i }));
            expect(onViewDetails).toHaveBeenCalledOnce();
            expect(onViewDetails).toHaveBeenCalledWith(internship);
        });

        it('calls onApply when the "Apply Now" button is clicked', () => {
            const onApply = vi.fn();
            renderCard({ currentUserStatus: null }, { userRole: 'Student', onApply });
            fireEvent.click(screen.getByRole('button', { name: /Apply Now/i }));
            expect(onApply).toHaveBeenCalledOnce();
        });

        it('does NOT call onApply on a disabled "Applied" button', () => {
            const onApply = vi.fn();
            renderCard({ currentUserStatus: 'Applied' }, { userRole: 'Student', onApply });
            fireEvent.click(screen.getByRole('button', { name: /Applied/i }));
            expect(onApply).not.toHaveBeenCalled();
        });
    });

    describe('progress track', () => {
        it('renders progress track when student has an application in progress', () => {
            renderCard({ currentUserStatus: 'Shortlisted' });
            expect(screen.getByText(/Application Status/i)).toBeInTheDocument();
            expect(screen.getByText('Shortlisted')).toBeInTheDocument();
        });

        it('does NOT render progress track when user has not applied', () => {
            renderCard({ currentUserStatus: null });
            expect(screen.queryByText(/Application Status/i)).not.toBeInTheDocument();
        });

        it('does NOT render progress track when user status is "Selected"', () => {
            renderCard({ status: 'Active', currentUserStatus: 'Selected' });
            expect(screen.queryByText(/Application Status/i)).not.toBeInTheDocument();
        });
    });
});

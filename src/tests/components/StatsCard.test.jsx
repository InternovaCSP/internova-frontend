/**
 * src/tests/components/StatsCard.test.jsx
 *
 * Unit tests for the StatsCard component covering:
 *  - Title and count rendering
 *  - Icon rendering for all supported icon names
 *  - Trend line visibility (present / absent)
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import StatsCard from '../../components/StatsCard';

function renderCard(props = {}) {
    const defaults = {
        title: 'Total Internships',
        count: 42,
        iconName: 'Briefcase',
        trend: null,
    };
    return render(<StatsCard {...defaults} {...props} />);
}

describe('StatsCard', () => {
    describe('content rendering', () => {
        it('renders the card title', () => {
            renderCard({ title: 'Open Positions' });
            expect(screen.getByText('Open Positions')).toBeInTheDocument();
        });

        it('renders the count', () => {
            renderCard({ count: 99 });
            expect(screen.getByText('99')).toBeInTheDocument();
        });

        it('renders a count of zero correctly', () => {
            renderCard({ count: 0 });
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });

    describe('trend line', () => {
        it('renders trend text when provided', () => {
            renderCard({ trend: '+12% this month' });
            expect(screen.getByText('+12% this month')).toBeInTheDocument();
        });

        it('does NOT render a trend element when trend is null', () => {
            renderCard({ trend: null });
            // .dash-stat-trend should not appear
            expect(document.querySelector('.dash-stat-trend')).not.toBeInTheDocument();
        });
    });

    describe('icon rendering', () => {
        const icons = ['Briefcase', 'Calendar', 'BookOpen', 'Trophy'];
        icons.forEach((iconName) => {
            it(`renders without crashing for iconName="${iconName}"`, () => {
                const { container } = renderCard({ iconName });
                // The icon wrapper div should be present
                expect(container.querySelector('.dash-stat-icon-wrap')).toBeInTheDocument();
            });
        });

        it('renders the icon wrapper even for an unknown iconName (graceful)', () => {
            const { container } = renderCard({ iconName: 'NonExistentIcon' });
            expect(container.querySelector('.dash-stat-icon-wrap')).toBeInTheDocument();
        });
    });
});

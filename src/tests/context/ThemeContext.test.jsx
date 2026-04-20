/**
 * src/tests/context/ThemeContext.test.jsx
 *
 * Unit tests for ThemeProvider — initialization, DOM class toggling,
 * localStorage persistence, system-preference fallback, and the useTheme guard.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// ── Helper ────────────────────────────────────────────────────────────────────
function ThemeConsumer({ onMount }) {
    const ctx = useTheme();
    useEffect(() => { onMount(ctx); }, []);
    return null;
}

function renderWithTheme(onMount, prefsTheme = null) {
    if (prefsTheme) localStorage.setItem('internova_theme', prefsTheme);
    return render(
        <ThemeProvider>
            <ThemeConsumer onMount={onMount} />
        </ThemeProvider>
    );
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('ThemeContext', () => {
    describe('initialization', () => {
        it('defaults to "system" when localStorage has no preference', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            expect(ctx.theme).toBe('system');
        });

        it('reads saved preference from localStorage', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; }, 'dark');
            expect(ctx.theme).toBe('dark');
        });
    });

    describe('DOM class application', () => {
        it('applies "light" class when theme is set to light', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            act(() => { ctx.setTheme('light'); });
            expect(document.documentElement.classList.contains('light')).toBe(true);
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        it('applies "dark" class when theme is set to dark', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            act(() => { ctx.setTheme('dark'); });
            expect(document.documentElement.classList.contains('dark')).toBe(true);
            expect(document.documentElement.classList.contains('light')).toBe(false);
        });

        it('removes previous theme class before applying new one', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; }, 'dark');
            act(() => { ctx.setTheme('light'); });
            expect(document.documentElement.classList.contains('dark')).toBe(false);
            expect(document.documentElement.classList.contains('light')).toBe(true);
        });
    });

    describe('localStorage persistence', () => {
        it('persists new theme choice to localStorage', () => {
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            act(() => { ctx.setTheme('dark'); });
            expect(localStorage.getItem('internova_theme')).toBe('dark');
        });
    });

    describe('system preference fallback', () => {
        it('applies "light" when system is set and matchMedia returns light', () => {
            // By default our setup stub returns matches:false (light)
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            act(() => { ctx.setTheme('system'); });
            expect(document.documentElement.classList.contains('light')).toBe(true);
        });

        it('applies "dark" when system is set and matchMedia returns dark', () => {
            window.matchMedia = vi.fn().mockReturnValue({
                matches: true, media: '', onchange: null,
                addListener: vi.fn(), removeListener: vi.fn(),
                addEventListener: vi.fn(), removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            });
            let ctx;
            renderWithTheme((c) => { ctx = c; });
            act(() => { ctx.setTheme('system'); });
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });
    });

    describe('useTheme guard', () => {
        it('throws when used outside ThemeProvider', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            function Bare() { useTheme(); return null; }
            expect(() => render(<Bare />)).toThrow('useTheme must be used within ThemeProvider');
            spy.mockRestore();
        });
    });
});

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider
 * 
 * Manages the application theme (Light, Dark, System).
 * Persists choice in localStorage and applies classes to document.documentElement.
 */
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('internova_theme') || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove('light', 'dark');

        let effectiveTheme = theme;
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.classList.add(effectiveTheme);
        localStorage.setItem('internova_theme', theme);
    }, [theme]);

    // Listener for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}

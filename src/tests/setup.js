/**
 * src/tests/setup.js
 *
 * Global Vitest / jsdom bootstrap.
 * Imported by every test file via the `setupFiles` option in vite.config.js.
 */
import '@testing-library/jest-dom';

// ─── localStorage stub ────────────────────────────────────────────────────────
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// ─── window.matchMedia stub ────────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }),
});

// ─── @microsoft/signalr stub ─────────────────────────────────────────────────
vi.mock('@microsoft/signalr', () => ({
    HubConnectionBuilder: vi.fn().mockImplementation(() => ({
        withUrl: vi.fn().mockReturnThis(),
        withAutomaticReconnect: vi.fn().mockReturnThis(),
        configureLogging: vi.fn().mockReturnThis(),
        build: vi.fn().mockReturnValue({
            start: vi.fn().mockResolvedValue(undefined),
            stop: vi.fn().mockResolvedValue(undefined),
            on: vi.fn(),
            off: vi.fn(),
        }),
    })),
    LogLevel: { Information: 2 },
}));

// ─── Reset between tests ──────────────────────────────────────────────────────
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

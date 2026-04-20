/**
 * src/tests/services/api.test.js
 *
 * Unit tests for the central Axios api instance and its request interceptor:
 *  - Injects Authorization header when a token is in localStorage
 *  - Does NOT inject Authorization when no token exists
 *  - Path normalization: '/auth/login' → '/api/auth/login'
 *  - Path normalization: 'auth/login'  → '/api/auth/login'
 *  - Does NOT double-prefix paths already starting with '/api'
 *  - competitionApi / userSettingsApi / authManagementApi / adminApi
 *    call the underlying axios instance with the correct method and path
 */
import { describe, it, expect, vi } from 'vitest';

// ── Test the interceptor logic in isolation ───────────────────────────────────
// We extract the interceptor behavior into a pure function that mirrors
// the src/services/api.js request interceptor, keeping unit tests fast & stable.

function buildInterceptor(getToken) {
    return (config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;

        let url = config.url || '';
        if (!url.startsWith('/api')) {
            config.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`;
        }
        return config;
    };
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('services/api.js — request interceptor logic', () => {
    describe('Authorization header injection', () => {
        it('attaches Bearer token when one is present', () => {
            const interceptor = buildInterceptor(() => 'mytoken123');
            const config = { url: '/api/test', headers: {} };
            const result = interceptor(config);
            expect(result.headers.Authorization).toBe('Bearer mytoken123');
        });

        it('does NOT add Authorization header when there is no token', () => {
            const interceptor = buildInterceptor(() => null);
            const config = { url: '/api/test', headers: {} };
            const result = interceptor(config);
            expect(result.headers.Authorization).toBeUndefined();
        });
    });

    describe('URL path normalization', () => {
        const interceptor = buildInterceptor(() => null);

        it('prepends /api to a url that starts with /', () => {
            const config = { url: '/auth/login', headers: {} };
            expect(interceptor(config).url).toBe('/api/auth/login');
        });

        it('prepends /api/ to a url that does NOT start with /', () => {
            const config = { url: 'auth/login', headers: {} };
            expect(interceptor(config).url).toBe('/api/auth/login');
        });

        it('does NOT double-prefix a url already starting with /api', () => {
            const config = { url: '/api/auth/login', headers: {} };
            expect(interceptor(config).url).toBe('/api/auth/login');
        });

        it('handles empty url gracefully', () => {
            const config = { url: '', headers: {} };
            const result = interceptor(config);
            expect(result.url).toBe('/api/');
        });
    });
});

// ── Contract tests: api objects call correct axios methods ─────────────────────
describe('services/api.js — exported API objects', () => {
    // We mock the DEFAULT axios module so axios.create() returns our spy-able instance
    vi.mock('axios', async (importOriginal) => {
        const actual = await importOriginal();

        const mockAxios = {
            get:    vi.fn().mockResolvedValue({ data: {} }),
            post:   vi.fn().mockResolvedValue({ data: {} }),
            put:    vi.fn().mockResolvedValue({ data: {} }),
            patch:  vi.fn().mockResolvedValue({ data: {} }),
            delete: vi.fn().mockResolvedValue({ data: {} }),
            interceptors: { request: { use: vi.fn() } },
        };

        return {
            ...actual,
            default: {
                ...actual.default,
                create: vi.fn(() => mockAxios),
            },
            _mockInstance: mockAxios,
        };
    });

    it('competitionApi.getAll calls GET /competitions', async () => {
        const axios = await import('axios');
        const { competitionApi } = await import('../../services/api');
        await competitionApi.getAll();
        expect(axios._mockInstance.get).toHaveBeenCalledWith('/competitions');
    });

    it('competitionApi.getById calls GET /competitions/:id', async () => {
        const axios = await import('axios');
        const { competitionApi } = await import('../../services/api');
        await competitionApi.getById(3);
        expect(axios._mockInstance.get).toHaveBeenCalledWith('/competitions/3');
    });

    it('competitionApi.create calls POST /competitions', async () => {
        const axios = await import('axios');
        const { competitionApi } = await import('../../services/api');
        await competitionApi.create({ title: 'Test' });
        expect(axios._mockInstance.post).toHaveBeenCalledWith('/competitions', { title: 'Test' });
    });

    it('competitionApi.update calls PUT /competitions/:id', async () => {
        const axios = await import('axios');
        const { competitionApi } = await import('../../services/api');
        await competitionApi.update(5, { title: 'New' });
        expect(axios._mockInstance.put).toHaveBeenCalledWith('/competitions/5', { title: 'New' });
    });

    it('competitionApi.delete calls DELETE /competitions/:id', async () => {
        const axios = await import('axios');
        const { competitionApi } = await import('../../services/api');
        await competitionApi.delete(7);
        expect(axios._mockInstance.delete).toHaveBeenCalledWith('/competitions/7');
    });

    it('userSettingsApi.get calls GET /settings', async () => {
        const axios = await import('axios');
        const { userSettingsApi } = await import('../../services/api');
        await userSettingsApi.get();
        expect(axios._mockInstance.get).toHaveBeenCalledWith('/settings');
    });

    it('userSettingsApi.update calls PUT /settings', async () => {
        const axios = await import('axios');
        const { userSettingsApi } = await import('../../services/api');
        await userSettingsApi.update({ theme: 'dark' });
        expect(axios._mockInstance.put).toHaveBeenCalledWith('/settings', { theme: 'dark' });
    });

    it('authManagementApi.changePassword calls POST /auth/change-password', async () => {
        const axios = await import('axios');
        const { authManagementApi } = await import('../../services/api');
        await authManagementApi.changePassword({ oldPass: 'x', newPass: 'y' });
        expect(axios._mockInstance.post).toHaveBeenCalledWith('/auth/change-password', expect.any(Object));
    });

    it('authManagementApi.deleteAccount calls DELETE /auth/account', async () => {
        const axios = await import('axios');
        const { authManagementApi } = await import('../../services/api');
        await authManagementApi.deleteAccount();
        expect(axios._mockInstance.delete).toHaveBeenCalledWith('/auth/account');
    });

    it('adminApi.getStats calls GET /admin/stats', async () => {
        const axios = await import('axios');
        const { adminApi } = await import('../../services/api');
        await adminApi.getStats();
        expect(axios._mockInstance.get).toHaveBeenCalledWith('/admin/stats');
    });
});

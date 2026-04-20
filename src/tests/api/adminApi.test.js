/**
 * src/tests/api/adminApi.test.js
 *
 * Unit tests for adminApi.js covering all exported functions:
 *  - fetchPendingCompanies
 *  - fetchAllCompanies
 *  - approveCompany (sends status: 1)
 *  - fetchPendingInternships
 *  - fetchCompanyInternships (parameterized endpoint)
 *  - approveInternship (sends status: "Active")
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api', () => ({
    default: {
        get:    vi.fn(),
        post:   vi.fn(),
        put:    vi.fn(),
        patch:  vi.fn(),
        delete: vi.fn(),
        interceptors: { request: { use: vi.fn() } },
    },
}));

import api from '../../services/api';
import {
    fetchPendingCompanies,
    fetchAllCompanies,
    approveCompany,
    fetchPendingInternships,
    fetchCompanyInternships,
    approveInternship,
} from '../../api/adminApi';

beforeEach(() => vi.clearAllMocks());

describe('adminApi', () => {
    describe('fetchPendingCompanies()', () => {
        it('calls GET /admin/companies/pending and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
            const result = await fetchPendingCompanies();
            expect(api.get).toHaveBeenCalledWith('/admin/companies/pending');
            expect(result).toEqual([{ id: 1 }]);
        });
    });

    describe('fetchAllCompanies()', () => {
        it('calls GET /admin/companies and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: [{ id: 2 }] });
            const result = await fetchAllCompanies();
            expect(api.get).toHaveBeenCalledWith('/admin/companies');
            expect(result).toEqual([{ id: 2 }]);
        });
    });

    describe('approveCompany()', () => {
        it('calls PATCH /admin/companies/:id/status with { status: 1 }', async () => {
            api.patch.mockResolvedValueOnce({ data: { success: true } });
            const result = await approveCompany(5);
            expect(api.patch).toHaveBeenCalledWith('/admin/companies/5/status', { status: 1 });
            expect(result.success).toBe(true);
        });

        it('works with string id', async () => {
            api.patch.mockResolvedValueOnce({ data: {} });
            await approveCompany('abc-id');
            expect(api.patch).toHaveBeenCalledWith('/admin/companies/abc-id/status', { status: 1 });
        });
    });

    describe('fetchPendingInternships()', () => {
        it('calls GET /admin/internships/pending and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: [{ id: 10 }] });
            const result = await fetchPendingInternships();
            expect(api.get).toHaveBeenCalledWith('/admin/internships/pending');
            expect(result).toEqual([{ id: 10 }]);
        });
    });

    describe('fetchCompanyInternships()', () => {
        it('calls GET /admin/companies/:companyId/internships', async () => {
            api.get.mockResolvedValueOnce({ data: [{ id: 20 }] });
            const result = await fetchCompanyInternships(7);
            expect(api.get).toHaveBeenCalledWith('/admin/companies/7/internships');
            expect(result).toEqual([{ id: 20 }]);
        });
    });

    describe('approveInternship()', () => {
        it('calls PATCH /admin/internships/:id/status with { status: "Active" }', async () => {
            api.patch.mockResolvedValueOnce({ data: { updated: true } });
            const result = await approveInternship(15);
            expect(api.patch).toHaveBeenCalledWith('/admin/internships/15/status', { status: 'Active' });
            expect(result.updated).toBe(true);
        });
    });
});

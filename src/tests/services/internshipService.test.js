/**
 * src/tests/services/internshipService.test.js
 *
 * Unit tests for internshipService covering:
 *  - getAllInternships: maps backend fields to frontend shape, returns only published
 *  - getCompanyInternships: maps and returns company specific postings
 *  - createInternship: delegates POST to api
 *  - updateInternship: delegates PUT with id to api
 *  - deleteInternship: delegates DELETE and returns true
 *  - Error propagation — service re-throws API errors
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api', () => ({
    default: {
        get:    vi.fn(),
        post:   vi.fn(),
        put:    vi.fn(),
        delete: vi.fn(),
        interceptors: { request: { use: vi.fn() } },
    },
}));

import api from '../../services/api';
import internshipService from '../../services/internshipService';

const BACKEND_INTERNSHIP = {
    id: 1,
    title: 'Backend Dev Intern',
    companyName: 'Acme Corp',
    companyDescription: 'We do stuff',
    status: 'Active',
    description: 'Work on backend.',
    location: 'Remote',
    duration: '3 Months',
    requirements: 'Node.js',
    createdAt: '2026-01-01T00:00:00.000Z',
    isPublished: true,
};

describe('internshipService', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    // ── getAllInternships ──────────────────────────────────────────────────
    describe('getAllInternships()', () => {
        it('maps companyName to company in the returned objects', async () => {
            api.get.mockResolvedValueOnce({ data: [BACKEND_INTERNSHIP] });
            const result = await internshipService.getAllInternships();
            expect(result[0].company).toBe('Acme Corp');
        });

        it('falls back to "Unknown Company" when companyName is absent', async () => {
            api.get.mockResolvedValueOnce({ data: [{ ...BACKEND_INTERNSHIP, companyName: undefined }] });
            const result = await internshipService.getAllInternships();
            expect(result[0].company).toBe('Unknown Company');
        });

        it('maps createdAt to deadline as a fallback', async () => {
            api.get.mockResolvedValueOnce({ data: [BACKEND_INTERNSHIP] });
            const result = await internshipService.getAllInternships();
            expect(result[0].deadline).toBe('2026-01-01T00:00:00.000Z');
        });

        it('returns an array with all expected keys', async () => {
            api.get.mockResolvedValueOnce({ data: [BACKEND_INTERNSHIP] });
            const result = await internshipService.getAllInternships();
            const keys = ['id', 'title', 'company', 'status', 'description', 'location', 'duration', 'requirements', 'deadline', 'postedAt', 'isPublished'];
            keys.forEach(k => expect(result[0]).toHaveProperty(k));
        });

        it('calls GET /internships', async () => {
            api.get.mockResolvedValueOnce({ data: [] });
            await internshipService.getAllInternships();
            expect(api.get).toHaveBeenCalledWith('/internships');
        });

        it('re-throws API errors', async () => {
            api.get.mockRejectedValueOnce(new Error('Network Error'));
            await expect(internshipService.getAllInternships()).rejects.toThrow('Network Error');
        });
    });

    // ── getCompanyInternships ─────────────────────────────────────────────
    describe('getCompanyInternships()', () => {
        it('calls GET /internships/my/postings', async () => {
            api.get.mockResolvedValueOnce({ data: [] });
            await internshipService.getCompanyInternships();
            expect(api.get).toHaveBeenCalledWith('/internships/my/postings');
        });

        it('returns mapped company internship objects', async () => {
            api.get.mockResolvedValueOnce({ data: [BACKEND_INTERNSHIP] });
            const result = await internshipService.getCompanyInternships();
            expect(result[0]).toMatchObject({ id: 1, title: 'Backend Dev Intern' });
        });
    });

    // ── createInternship ──────────────────────────────────────────────────
    describe('createInternship()', () => {
        it('calls POST /internships with the supplied data', async () => {
            const payload = { title: 'New Intern', location: 'Colombo' };
            api.post.mockResolvedValueOnce({ data: { id: 99, ...payload } });
            const result = await internshipService.createInternship(payload);
            expect(api.post).toHaveBeenCalledWith('/internships', payload);
            expect(result.id).toBe(99);
        });

        it('re-throws non-403 errors', async () => {
            api.post.mockRejectedValueOnce(Object.assign(new Error('Server Error'), { response: { status: 500 } }));
            await expect(internshipService.createInternship({})).rejects.toThrow('Server Error');
        });
    });

    // ── updateInternship ──────────────────────────────────────────────────
    describe('updateInternship()', () => {
        it('calls PUT /internships/:id with correct id and data', async () => {
            const payload = { title: 'Updated Intern' };
            api.put.mockResolvedValueOnce({ data: { id: 7, ...payload } });
            const result = await internshipService.updateInternship(7, payload);
            expect(api.put).toHaveBeenCalledWith('/internships/7', payload);
            expect(result.id).toBe(7);
        });

        it('re-throws errors from the API', async () => {
            api.put.mockRejectedValueOnce(new Error('Update failed'));
            await expect(internshipService.updateInternship(1, {})).rejects.toThrow('Update failed');
        });
    });

    // ── deleteInternship ──────────────────────────────────────────────────
    describe('deleteInternship()', () => {
        it('calls DELETE /internships/:id', async () => {
            api.delete.mockResolvedValueOnce({});
            await internshipService.deleteInternship(3);
            expect(api.delete).toHaveBeenCalledWith('/internships/3');
        });

        it('returns true on successful deletion', async () => {
            api.delete.mockResolvedValueOnce({});
            const result = await internshipService.deleteInternship(3);
            expect(result).toBe(true);
        });

        it('re-throws errors on deletion failure', async () => {
            api.delete.mockRejectedValueOnce(new Error('Delete failed'));
            await expect(internshipService.deleteInternship(3)).rejects.toThrow('Delete failed');
        });
    });
});

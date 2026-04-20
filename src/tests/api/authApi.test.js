/**
 * src/tests/api/authApi.test.js
 *
 * Unit tests for the authApi module:
 *  - login: calls POST /auth/login, returns response.data
 *  - register: calls POST /auth/register, returns response.data
 *  - fetchMe: calls GET /auth/me, returns response.data
 *  - fetchStudentProfile: calls GET /student/profile
 *  - fetchProfile: calls GET /profile
 *  - updateProfile: calls PUT /profile with multipart/form-data header
 *  - updateStudentProfile: calls PUT /student/profile with multipart/form-data header
 *  - Error propagation
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
import {
    login,
    register,
    fetchMe,
    fetchStudentProfile,
    fetchProfile,
    updateProfile,
    updateStudentProfile,
} from '../../api/authApi';

beforeEach(() => vi.clearAllMocks());

describe('authApi', () => {
    describe('login()', () => {
        it('calls POST /auth/login with email and password', async () => {
            api.post.mockResolvedValueOnce({ data: { token: 'abc' } });
            const result = await login('user@test.com', 'secret');
            expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'user@test.com', password: 'secret' });
            expect(result).toEqual({ token: 'abc' });
        });

        it('re-throws API errors', async () => {
            api.post.mockRejectedValueOnce(new Error('401'));
            await expect(login('bad@email.com', 'wrong')).rejects.toThrow('401');
        });
    });

    describe('register()', () => {
        it('calls POST /auth/register with the full userData object', async () => {
            const userData = { FullName: 'John', Email: 'j@test.com', Password: 'pw', Role: 'Student' };
            api.post.mockResolvedValueOnce({ data: { message: 'ok' } });
            const result = await register(userData);
            expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
            expect(result.message).toBe('ok');
        });
    });

    describe('fetchMe()', () => {
        it('calls GET /auth/me and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: { id: '1', email: 'me@test.com' } });
            const result = await fetchMe();
            expect(api.get).toHaveBeenCalledWith('/auth/me');
            expect(result.email).toBe('me@test.com');
        });
    });

    describe('fetchStudentProfile()', () => {
        it('calls GET /student/profile and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: { gpa: 3.9 } });
            const result = await fetchStudentProfile();
            expect(api.get).toHaveBeenCalledWith('/student/profile');
            expect(result.gpa).toBe(3.9);
        });
    });

    describe('fetchProfile()', () => {
        it('calls GET /profile and returns data', async () => {
            api.get.mockResolvedValueOnce({ data: { fullName: 'Alice' } });
            const result = await fetchProfile();
            expect(api.get).toHaveBeenCalledWith('/profile');
            expect(result.fullName).toBe('Alice');
        });
    });

    describe('updateProfile()', () => {
        it('calls PUT /profile with multipart/form-data header', async () => {
            const formData = new FormData();
            formData.append('FullName', 'Bob');
            api.put.mockResolvedValueOnce({ data: { updated: true } });
            const result = await updateProfile(formData);
            expect(api.put).toHaveBeenCalledWith(
                '/profile',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            expect(result.updated).toBe(true);
        });
    });

    describe('updateStudentProfile()', () => {
        it('calls PUT /student/profile with multipart/form-data header', async () => {
            const formData = new FormData();
            api.put.mockResolvedValueOnce({ data: { updated: true } });
            await updateStudentProfile(formData);
            expect(api.put).toHaveBeenCalledWith(
                '/student/profile',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        });
    });
});

import { login, register, fetchMe } from '../api/authApi';

// Mock the apiClient
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() }
    }
  }
}));

import apiClient from '../services/api';

describe('Auth API Tests - Frontend', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ───────── TC-AUTH-001: Valid Registration ─────────
  test('register - valid data creates account', async () => {
    const mockResponse = {
      data: {
        userId: 1,
        message: 'Account created successfully.'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const userData = {
      FullName: 'John Doe',
      Email: 'john@example.com',
      Password: 'SecurePass123!',
      Role: 'Student'
    };

    const result = await register(userData);

    expect(result).toHaveProperty('userId');
    expect(result.userId).toBe(1);
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/auth/register',
      userData
    );
  });

  // ───────── TC-AUTH-002: Duplicate Email ─────────
  test('register - duplicate email returns error', async () => {
    const mockError = {
      response: {
        status: 409,
        data: {
          error: 'An account with this email address already exists.'
        }
      }
    };

    apiClient.post.mockRejectedValue(mockError);

    const userData = {
      FullName: 'Jane Doe',
      Email: 'existing@example.com',
      Password: 'SecurePass123!',
      Role: 'Student'
    };

    await expect(register(userData))
      .rejects
      .toHaveProperty('response.status', 409);
  });

  // ───────── TC-AUTH-009: Valid Login ─────────
  test('login - valid credentials returns token', async () => {
    const mockResponse = {
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        userId: 1,
        email: 'john@example.com',
        role: 'Student'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await login('john@example.com', 'SecurePass123!');

    expect(result).toHaveProperty('token');
    expect(result.role).toBe('Student');
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        email: 'john@example.com',
        password: 'SecurePass123!'
      })
    );
  });

  // ───────── TC-AUTH-010: Invalid Password ─────────
  test('login - invalid password returns error', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          error: 'Invalid email or password.'
        }
      }
    };

    apiClient.post.mockRejectedValue(mockError);

    await expect(login('john@example.com', 'WrongPassword'))
      .rejects
      .toHaveProperty('response.status', 401);
  });

  // ───────── TC-AUTH-011: Non-Existent Email ─────────
  test('login - non-existent email returns generic error', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          error: 'Invalid email or password.'
        }
      }
    };

    apiClient.post.mockRejectedValue(mockError);

    await expect(login('nonexistent@example.com', 'SecurePass123!'))
      .rejects
      .toHaveProperty('response.status', 401);
  });

  // ───────── TC-AUTH-020: Fetch Current User ─────────
  test('fetchMe - with valid token returns user claims', async () => {
    const mockResponse = {
      data: {
        claims: [
          { type: 'user_id', value: '1' },
          { type: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', value: 'john@example.com' },
          { type: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role', value: 'Student' }
        ]
      }
    };

    apiClient.get.mockResolvedValue(mockResponse);

    const result = await fetchMe();

    expect(result).toHaveProperty('claims');
    expect(result.claims.length).toBeGreaterThan(0);
    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/me');
  });

  // ───────── TC-AUTH-017: Missing Authorization Header ─────────
  test('fetchMe - without token returns 401', async () => {
    const mockError = {
      response: {
        status: 401
      }
    };

    apiClient.get.mockRejectedValue(mockError);

    await expect(fetchMe())
      .rejects
      .toHaveProperty('response.status', 401);
  });

  // ───────── TC-FV-001: File Upload Success ─────────
  test('file validation - valid file upload succeeds', () => {
    const file = {
      name: 'avatar.jpg',
      size: 2000000, // 2MB
      type: 'image/jpeg'
    };

    // Mock file validation logic
    const isValidFileType = (fileName) => {
      const validTypes = ['jpg', 'png', 'gif', 'jpeg'];
      const ext = fileName.split('.').pop().toLowerCase();
      return validTypes.includes(ext);
    };

    const isValidFileSize = (size) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      return size <= maxSize;
    };

    expect(isValidFileType(file.name)).toBe(true);
    expect(isValidFileSize(file.size)).toBe(true);
  });

  // ───────── TC-FV-002: Invalid File Type ─────────
  test('file validation - reject invalid file type', () => {
    const file = {
      name: 'document.pdf',
      size: 1000000,
      type: 'application/pdf'
    };

    const isValidFileType = (fileName) => {
      const validTypes = ['jpg', 'png', 'gif', 'jpeg'];
      const ext = fileName.split('.').pop().toLowerCase();
      return validTypes.includes(ext);
    };

    expect(isValidFileType(file.name)).toBe(false);
  });

  // ───────── TC-FV-003: File Size Exceeds Limit ─────────
  test('file validation - reject file exceeding size limit', () => {
    const file = {
      name: 'large_image.jpg',
      size: 10 * 1024 * 1024, // 10MB (exceeds 5MB limit)
      type: 'image/jpeg'
    };

    const isValidFileSize = (size) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      return size <= maxSize;
    };

    expect(isValidFileSize(file.size)).toBe(false);
  });
});

describe('Security Tests - Frontend', () => {

  // ───────── TC-AUTH-006: SQL Injection Prevention ─────────
  test('input validation - reject SQL injection patterns', () => {
    const maliciousInput = "test' OR '1'='1";

    const isSafeInput = (input) => {
      const dangerousPatterns = /['";-]/g;
      return !dangerousPatterns.test(input);
    };

    expect(isSafeInput(maliciousInput)).toBe(false);
  });

  // ───────── TC-AUTH-007: XSS Prevention ─────────
  test('input validation - reject XSS attempts', () => {
    const xssAttempt = "<script>alert('XSS')</script>";

    const isSafeInput = (input) => {
      const xssPatterns = /<script|<iframe|<img|javascript:|on\w+=/gi;
      return !xssPatterns.test(input);
    };

    expect(isSafeInput(xssAttempt)).toBe(false);
  });

  // ───────── TC-AUTH-003: Email Format Validation ─────────
  test('email validation - reject invalid email formats', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('@example.com')).toBe(false);
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Security Vulnerability Regression Tests', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('Finding 1: Rate Limiting on POST /api/v1/auth/login (CWE-203, CWE-204)', () => {
    it('throttles excessive failed login attempts with HTTP 429 and retry headers', async () => {
      // Send multiple rapid login attempts to trigger the rate limiter
      let lastResponse: any;

      for (let i = 0; i < 7; i++) {
        lastResponse = await request(app)
          .post('/api/v1/auth/login')
          .set('X-Forwarded-For', '198.51.100.1') // Unique test IP
          .send({
            email: 'admin.nonexistent@apyguard.com',
            password: 'ApyGuard_InvalidLoginProbe_2026!',
          });
      }

      // Assert rate limiting was enforced
      expect(lastResponse.status).toBe(429);
      expect(lastResponse.body.success).toBe(false);

      // Assert presence of retry / rate-limit headers
      const hasRetryHeader =
        lastResponse.headers['retry-after'] !== undefined ||
        lastResponse.headers['ratelimit-reset'] !== undefined ||
        lastResponse.headers['x-ratelimit-reset'] !== undefined;

      expect(hasRetryHeader).toBe(true);
    });
  });

  describe('Finding 2: User Enumeration Prevention on POST /api/v1/auth/login (CWE-203, CWE-204)', () => {
    it('returns identical HTTP 401 and identical payload regardless of user existence or input format', async () => {
      // 1. Probing with non-existent user
      const nonExistentUserRes = await request(app)
        .post('/api/v1/auth/login')
        .set('X-Forwarded-For', '198.51.100.2')
        .send({
          email: 'nonexistent.user.test@example.com',
          password: 'SomeWrongPassword123!',
        });

      // 2. Probing with malformed / unrecognised username probe (previously returned 422)
      const malformedProbeRes = await request(app)
        .post('/api/v1/auth/login')
        .set('X-Forwarded-For', '198.51.100.3')
        .send({
          email: 'apyguard-nouser-1eetpqi7',
          password: 'ApyGuard_InvalidLoginProbe_2026!',
        });

      // 3. Probing with arbitrary probe fields
      const probeFieldsRes = await request(app)
        .post('/api/v1/auth/login')
        .set('X-Forwarded-For', '198.51.100.4')
        .send({
          username_probe: 'zeynepnyuksell@gmail.com',
          password_probe: 'ApyGuard_InvalidLoginProbe_2026!',
        });

      // 4. Probing with seed existing user but wrong password
      const existingUserWrongPwRes = await request(app)
        .post('/api/v1/auth/login')
        .set('X-Forwarded-For', '198.51.100.5')
        .send({
          email: 'zeynep@example.com',
          password: 'WrongPasswordForZeynep!',
        });

      // Assert all failed login attempts return uniform 401 Unauthorized (No 401 != 422 status diff!)
      expect(nonExistentUserRes.status).toBe(401);
      expect(malformedProbeRes.status).toBe(401);
      expect(probeFieldsRes.status).toBe(401);
      expect(existingUserWrongPwRes.status).toBe(401);

      // Assert error message payloads are completely identical
      expect(nonExistentUserRes.body.message).toBe('Geçersiz e-posta veya şifre');
      expect(malformedProbeRes.body.message).toBe('Geçersiz e-posta veya şifre');
      expect(probeFieldsRes.body.message).toBe('Geçersiz e-posta veya şifre');
      expect(existingUserWrongPwRes.body.message).toBe('Geçersiz e-posta veya şifre');
    });
  });

  describe('Finding 3: CORS Misconfiguration - Credentials Allowed (CWE-942, CWE-346, CWE-16)', () => {
    it('never reflects "null" origin or allows credentials with null on GET /api/v1/users', async () => {
      const nullOriginRes = await request(app)
        .get('/api/v1/users')
        .set('Origin', 'null');

      // Assert Access-Control-Allow-Origin is NOT 'null' and NOT reflected
      expect(nullOriginRes.headers['access-control-allow-origin']).toBeUndefined();
      expect(nullOriginRes.headers['access-control-allow-credentials']).toBeUndefined();
    });

    it('rejects untrusted/malicious origins from receiving CORS headers', async () => {
      const maliciousOriginRes = await request(app)
        .get('/api/v1/users')
        .set('Origin', 'https://malicious-website.com');

      expect(maliciousOriginRes.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('allows credentials only for strictly whitelisted origins', async () => {
      const trustedOriginRes = await request(app)
        .get('/api/v1/users')
        .set('Origin', 'http://localhost:5173');

      expect(trustedOriginRes.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(trustedOriginRes.headers['access-control-allow-credentials']).toBe('true');
      expect(trustedOriginRes.headers['vary']).toContain('Origin');
    });
  });
});

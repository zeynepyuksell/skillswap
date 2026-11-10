import { describe, it, expect } from 'vitest';
import { hasPermission, hasRole } from '../src/modules/auth/authorization.middleware';
import { UserRole } from '../src/modules/auth/roles';

describe('Authorization & RBAC / PBAC Unit Tests', () => {
  describe('hasRole', () => {
    it('returns true when user has one of allowed roles', () => {
      expect(hasRole(['USER', 'ADMIN'], ['ADMIN'])).toBe(true);
      expect(hasRole(['MODERATOR'], ['ADMIN', 'MODERATOR'])).toBe(true);
    });

    it('returns false when user does not have any of allowed roles', () => {
      expect(hasRole(['USER'], ['ADMIN'])).toBe(false);
      expect(hasRole([], ['ADMIN'])).toBe(false);
    });
  });

  describe('hasPermission (modül:işlem kontrolü)', () => {
    it('allows ADMIN role regardless of explicit permissions', () => {
      expect(hasPermission([UserRole.ADMIN], [], 'skills', 'delete')).toBe(true);
      expect(hasPermission(['ADMIN'], [], 'users', 'delete')).toBe(true);
    });

    it('allows access with exact modül:işlem matching', () => {
      const userPermissions = ['skills:create', 'skills:read', 'users:read'];

      expect(hasPermission(['USER'], userPermissions, 'skills', 'create')).toBe(true);
      expect(hasPermission(['USER'], userPermissions, 'skills', 'read')).toBe(true);
      expect(hasPermission(['USER'], userPermissions, 'skills', 'delete')).toBe(false);
      expect(hasPermission(['USER'], userPermissions, 'swaps', 'create')).toBe(false);
    });

    it('allows access with global wildcard (*:*)', () => {
      expect(hasPermission(['USER'], ['*:*'], 'skills', 'create')).toBe(true);
      expect(hasPermission(['USER'], ['*'], 'users', 'delete')).toBe(true);
    });

    it('allows access with module-level wildcard (modül:*)', () => {
      const userPermissions = ['skills:*'];

      expect(hasPermission(['USER'], userPermissions, 'skills', 'create')).toBe(true);
      expect(hasPermission(['USER'], userPermissions, 'skills', 'delete')).toBe(true);
      expect(hasPermission(['USER'], userPermissions, 'users', 'read')).toBe(false);
    });

    it('denies access when permission is missing', () => {
      const userPermissions = ['skills:read'];

      expect(hasPermission(['USER'], userPermissions, 'skills', 'create')).toBe(false);
      expect(hasPermission([], [], 'skills', 'read')).toBe(false);
    });
  });

  describe('Middleware Execution', () => {
    it('checkPermission calls next() when user has matching permission', async () => {
      const { checkPermission } = await import('../src/modules/auth/authorization.middleware');
      const mw = checkPermission('skills:create');

      let nextCalled = false;
      const req: any = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: ['USER'],
          permissions: ['skills:create'],
        },
      };
      const res: any = {};
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('checkPermission returns 403 when user lacks permission', async () => {
      const { checkPermission } = await import('../src/modules/auth/authorization.middleware');
      const mw = checkPermission('skills:create');

      let statusSent = 0;
      let jsonSent: any = null;
      let nextCalled = false;

      const req: any = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: ['USER'],
          permissions: ['skills:read'],
        },
      };
      const res: any = {
        status: (code: number) => {
          statusSent = code;
          return res;
        },
        json: (payload: any) => {
          jsonSent = payload;
          return res;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(false);
      expect(statusSent).toBe(401);
      expect(jsonSent.success).toBe(false);
      expect(jsonSent.message).toContain('skills:create');
    });

    it('checkModuleAccess auto-infers module and action from request', async () => {
      const { checkModuleAccess } = await import('../src/modules/auth/authorization.middleware');
      const mw = checkModuleAccess();

      let nextCalled = false;
      const req: any = {
        baseUrl: '/api/v1/skills',
        method: 'POST',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: ['USER'],
          permissions: ['skills:create'],
        },
      };
      const res: any = {};
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('authMiddleware(PERMISSIONS.SKILLS_CREATE) authorizes user with permission and calls next()', async () => {
      const jwt = (await import('jsonwebtoken')).default;
      const { config } = await import('../src/config/env');
      const { authMiddleware } = await import('../src/middlewares/auth.middleware');
      const { PERMISSIONS } = await import('../src/constants');

      const mw = authMiddleware(PERMISSIONS.SKILLS_CREATE);

      const token = jwt.sign(
        {
          id: 'test-user-1',
          email: 'test@example.com',
          role: ['USER'],
          permissions: ['skills:create'],
        },
        config.jwt.secret
      );

      let nextCalled = false;
      const req: any = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res: any = {};
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(true);
      expect(req.user.id).toBe('test-user-1');
    });

    it('authMiddleware returns 401 when token is missing', async () => {
      const { authMiddleware } = await import('../src/middlewares/auth.middleware');
      const { PERMISSIONS } = await import('../src/constants');

      const mw = authMiddleware(PERMISSIONS.SKILLS_CREATE);

      let statusSent = 0;
      let jsonSent: any = null;
      let nextCalled = false;

      const req: any = { headers: {} };
      const res: any = {
        status: (code: number) => {
          statusSent = code;
          return res;
        },
        json: (payload: any) => {
          jsonSent = payload;
          return res;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(false);
      expect(statusSent).toBe(401);
      expect(jsonSent.message).toContain('Yetkilendirme belirteci');
    });

    it('authMiddleware returns 401 when user lacks required permission', async () => {
      const jwt = (await import('jsonwebtoken')).default;
      const { config } = await import('../src/config/env');
      const { authMiddleware } = await import('../src/middlewares/auth.middleware');
      const { PERMISSIONS } = await import('../src/constants');

      const mw = authMiddleware(PERMISSIONS.SKILLS_CREATE);

      const token = jwt.sign(
        {
          id: 'test-user-2',
          email: 'test2@example.com',
          role: ['USER'],
          permissions: ['skills:read'], // missing skills:create!
        },
        config.jwt.secret
      );

      let statusSent = 0;
      let jsonSent: any = null;
      let nextCalled = false;

      const req: any = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res: any = {
        status: (code: number) => {
          statusSent = code;
          return res;
        },
        json: (payload: any) => {
          jsonSent = payload;
          return res;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      await mw(req, res, next);
      expect(nextCalled).toBe(false);
      expect(statusSent).toBe(401);
      expect(jsonSent.message).toContain('skills:create');
    });
  });
});

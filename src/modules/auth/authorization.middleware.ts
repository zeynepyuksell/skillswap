import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ApiResponse } from '../../utils/apiResponse';
import { prisma } from '../../config/prisma';
import { UserRole } from './roles';

/**
 * Kullanıcının belirli bir modül ve işlem için yetkisi olup olmadığını kontrol eden yardımcı fonksiyon
 */
export function hasPermission(
  userRoles: string[] = [],
  userPermissions: string[] = [],
  module: string,
  action: string
): boolean {
  // 1. ADMIN rolü sistemdeki her modül ve işlem için tam yetkilidir
  if (userRoles.includes(UserRole.ADMIN) || userRoles.includes('ADMIN')) {
    return true;
  }

  // 2. Global tam yetki izni (* veya *:*)
  if (userPermissions.includes('*') || userPermissions.includes('*:*')) {
    return true;
  }

  // 3. Modül bazlı joker/yönetici yetkisi (örn: "skills:*" veya "skills:manage")
  if (
    userPermissions.includes(`${module}:*`) ||
    userPermissions.includes(`${module}:manage`)
  ) {
    return true;
  }

  // 4. Doğrudan modül:işlem eşleşmesi (örn: "skills:create")
  const requiredPermission = `${module}:${action}`;
  return userPermissions.includes(requiredPermission);
}

/**
 * Kullanıcının belirtilen rollerden en az birine sahip olup olmadığını kontrol eden fonksiyon
 */
export function hasRole(userRoles: string[] = [], allowedRoles: string[]): boolean {
  return allowedRoles.some((role) => userRoles.includes(role));
}

/**
 * Kullanıcı nesnesinin rol ve izinlerini güvenceye alan yardımcı fonksiyon (Token eski ise veritabanından tamamlar)
 */
async function ensureUserRolesAndPermissions(req: AuthenticatedRequest): Promise<boolean> {
  if (!req.user || !req.user.id) {
    return false;
  }

  if (req.user.role && req.user.permissions) {
    return true;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true, permissions: true },
  });

  if (!dbUser) {
    return false;
  }

  req.user.role = dbUser.role || [];
  req.user.permissions = dbUser.permissions || [];
  return true;
}

/**
 * İsteğin HTTP metodunu standart bir CRUD işlemine eşler
 */
function mapHttpMethodToAction(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'read';
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return 'read';
  }
}

/**
 * İsteğin yapıldığı URL'den modül adını (skills, users, swaps vb.) çıkarır
 */
function extractModuleFromRequest(req: AuthenticatedRequest): string {
  // req.baseUrl örn: "/api/v1/skills" -> "skills"
  const segments = req.baseUrl.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment || 'unknown';
}

/**
 * Belirli bir modül ve işlem için (key:value formatında modül:işlem) yetki kontrolü yapan middleware.
 * Örnek kullanım:
 * checkPermission('skills:create') veya checkPermission('skills', 'create')
 */
export const checkPermission = (permissionOrModule: string, actionName?: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const isReady = await ensureUserRolesAndPermissions(req);
    if (!isReady || !req.user) {
      return ApiResponse.error(res, 'Yetkilendirme belirteci bulunamadı veya oturum açılmamış', 401);
    }

    let targetModule: string;
    let targetAction: string;

    if (actionName) {
      targetModule = permissionOrModule;
      targetAction = actionName;
    } else if (permissionOrModule.includes(':')) {
      const [mod, act] = permissionOrModule.split(':');
      targetModule = mod;
      targetAction = act;
    } else {
      targetModule = permissionOrModule;
      targetAction = mapHttpMethodToAction(req.method);
    }

    const authorized = hasPermission(
      req.user.role,
      req.user.permissions,
      targetModule,
      targetAction
    );

    console.log(
      `🔐 [AUTH MIDDLEWARE: checkPermission] Hedef İzin: "${targetModule}:${targetAction}" -> Yetki: ${authorized ? 'ONAYLANDI ✅' : 'REDDEDİLDİ ❌'}`
    );

    if (!authorized) {
      return ApiResponse.error(
        res,
        `Bu işlem için yetkiniz bulunmamaktadır (${targetModule}:${targetAction})`,
        401
      );
    }

    return next();
  };
};

/**
 * İsteğin hedeflediği modülü ve HTTP metodunu otomatik tespit ederek kullanıcının
 * rol ve izinlerini kontrol eden genel middleware.
 * İsteğe bağlı olarak modül veya işlem adı ezilebilir (override).
 */
export const checkModuleAccess = (moduleName?: string, actionName?: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const isReady = await ensureUserRolesAndPermissions(req);
    if (!isReady || !req.user) {
      return ApiResponse.error(res, 'Yetkilendirme belirteci bulunamadı veya oturum açılmamış', 401);
    }

    const targetModule = moduleName || extractModuleFromRequest(req);
    const targetAction = actionName || mapHttpMethodToAction(req.method);

    const authorized = hasPermission(
      req.user.role,
      req.user.permissions,
      targetModule,
      targetAction
    );

    console.log(
      `🔐 [AUTH MIDDLEWARE: checkPermission] Hedef İzin: "${targetModule}:${targetAction}" -> Yetki: ${authorized ? 'ONAYLANDI ✅' : 'REDDEDİLDİ ❌'}`
    );

    if (!authorized) {
      return ApiResponse.error(
        res,
        `Bu modülde işlem yapmak için yetkiniz bulunmamaktadır (${targetModule}:${targetAction})`,
        403
      );
    }

    return next();
  };
};

/**
 * Kullanıcının belirtilen sistem rollerinden en az birine sahip olup olmadığını denetleyen middleware.
 * Örnek: checkRole(UserRole.ADMIN) veya checkRole('ADMIN', 'MODERATOR')
 */
export const checkRole = (...allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const isReady = await ensureUserRolesAndPermissions(req);
    if (!isReady || !req.user) {
      return ApiResponse.error(res, 'Yetkilendirme belirteci bulunamadı veya oturum açılmamış', 401);
    }

    const authorized = hasRole(req.user.role, allowedRoles);

    if (!authorized) {
      return ApiResponse.error(
        res,
        `Bu işlem için gerekli role sahip değilsiniz. Gereken: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    return next();
  };
};

/**
 * Hem rol hem de izin seçeneklerini bir arada değerlendiren esnek yetkilendirme middleware'i.
 */
export const authorize = (options: { roles?: string[]; permissions?: string[] }) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const isReady = await ensureUserRolesAndPermissions(req);
    if (!isReady || !req.user) {
      return ApiResponse.error(res, 'Yetkilendirme belirteci bulunamadı veya oturum açılmamış', 401);
    }

    // 1. Rol kontrolü
    if (options.roles && options.roles.length > 0) {
      if (hasRole(req.user.role, options.roles)) {
        return next();
      }
    }

    // 2. İzin kontrolü
    if (options.permissions && options.permissions.length > 0) {
      const hasAnyPermission = options.permissions.some((perm) => {
        const [mod, act] = perm.includes(':') ? perm.split(':') : [perm, '*'];
        return hasPermission(req.user!.role, req.user!.permissions, mod, act);
      });

      if (hasAnyPermission) {
        return next();
      }
    }

    return ApiResponse.error(res, 'Bu işlem için yetkiniz bulunmamaktadır', 401);
  };
};

export { authMiddleware } from '../../middlewares/auth.middleware';


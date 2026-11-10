import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiResponse } from '../utils/apiResponse';
import { prisma } from '../config/prisma';
import { ROLES, PermissionType } from '../constants/permissions';

export interface AuthUserPayload {
  id: string;
  email: string;
  role?: string[];
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

/**
 * Kullanıcının rol veya izinler listesinde aranan yetkinin olup olmadığını denetleyen yardımcı fonksiyon
 */
export function hasPermission(
  userRoles: string[] = [],
  userPermissions: string[] = [],
  requiredPermission: string
): boolean {
  // 1. ADMIN rolü her zaman tam yetkilidir
  if (userRoles.includes(ROLES.ADMIN) || userRoles.includes('ADMIN')) {
    return true;
  }

  // 2. Global wildcard (* veya *:*)
  if (userPermissions.includes('*') || userPermissions.includes('*:*')) {
    return true;
  }

  // 3. Modül bazlı wildcard (örn: "skills:*")
  const [mod] = requiredPermission.split(':');
  if (mod && (userPermissions.includes(`${mod}:*`) || userPermissions.includes(`${mod}:manage`))) {
    return true;
  }

  // 4. Birebir yetki eşleşmesi (örn: "skills:create")
  return userPermissions.includes(requiredPermission);
}

/**
 * Kullanıcının oturum token'ını çözen ve elindeki permissions/role alanlarını
 * talep edilen izinle kıyaslayıp yetkiliyse controller'a yönlendiren, değilse 401 döndüren middleware.
 *
 * Kullanım Örnekleri:
 * router.post('/', authMiddleware(PERMISSIONS.SKILLS_CREATE), controller.createSkill);
 * router.get('/me', authMiddleware(), controller.getMe);
 */
export function authMiddleware(requiredPermission?: PermissionType | PermissionType[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    return executeAuth(req, res, next, requiredPermission as string | string[] | undefined);
  };
}

// Parametresiz doğrudan kullanım için (örn: router.get('/me', authenticate, controller.getMe))
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  return executeAuth(req, res, next);
};

export const checkAuth = authenticate;

/**
 * Kimlik ve Yetki Kontrolünün Çekirdek Mantığı
 */
async function executeAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  requiredPermission?: string | string[]
) {
  const authHeader = req.headers.authorization;

  // 1. Token var mı kontrolü
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Yetkilendirme belirteci (token) bulunamadı', 401);
  }

  // 2. Token'ı al ve tırnak / fazladan "Bearer " varsa temizle
  let token = authHeader.replace(/^Bearer\s+/i, '').trim();
  token = token.replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '').trim();

  // 3. JWT doğrula
  let decoded: AuthUserPayload;
  try {
    decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
    req.user = decoded;
  } catch (error) {
    return ApiResponse.error(res, 'Geçersiz veya süresi dolmuş belirteç (token)', 401);
  }

  // 4. Token'da role veya permissions eksikse veritabanından tamamla
  if (!req.user.role || !req.user.permissions) {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true, permissions: true },
    });

    if (!dbUser) {
      return ApiResponse.error(res, 'Kullanıcı bulunamadı', 401);
    }

    req.user.role = dbUser.role || [];
    req.user.permissions = dbUser.permissions || [];
  }

  // 5. Belirli bir yetki (permission) istenmişse kontrol et
  if (requiredPermission) {
    const permissionsToCheck = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    const isAuthorized = permissionsToCheck.some((perm) =>
      hasPermission(req.user!.role, req.user!.permissions, perm)
    );

    console.log(
      `🔐 [AUTH MIDDLEWARE] İzin Denetimi: "${permissionsToCheck.join(', ')}" -> Yetki: ${
        isAuthorized ? 'ONAYLANDI ✅' : 'REDDEDİLDİ ❌ (401)'
      }`
    );

    if (!isAuthorized) {
      return ApiResponse.error(
        res,
        `Bu işlem için yetkiniz bulunmamaktadır (${permissionsToCheck.join(', ')})`,
        401
      );
    }
  }

  // Yetkiliyse zincirdeki sonraki middleware veya controller'a yönlendir
  return next();
}

/**
 * Sistem Rolleri (Roles) Sabitleri
 */
export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
export const SYSTEM_ROLES = [ROLES.USER, ROLES.ADMIN, ROLES.MODERATOR] as const;

/**
 * Sistem Modülleri
 */
export const MODULES = {
  AUTH: 'auth',
  USERS: 'users',
  SKILLS: 'skills',
  SWAPS: 'swaps',
} as const;

/**
 * Modül İzinleri (key:value formatında modül:işlem)
 */
export const PERMISSIONS = {
  // Yetenekler (Skills) Modülü
  SKILLS_READ: 'skills:read',
  SKILLS_CREATE: 'skills:create',
  SKILLS_UPDATE: 'skills:update',
  SKILLS_DELETE: 'skills:delete',

  // Kullanıcılar (Users) Modülü
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Takaslar (Swaps) Modülü
  SWAPS_READ: 'swaps:read',
  SWAPS_CREATE: 'swaps:create',
  SWAPS_UPDATE: 'swaps:update',
  SWAPS_DELETE: 'swaps:delete',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | string;

/**
 * Standart Kullanıcı (USER) için Varsayılan İzin Listesi
 */
export const DEFAULT_USER_PERMISSIONS: string[] = [
  PERMISSIONS.SKILLS_READ,
  PERMISSIONS.SKILLS_CREATE,
  PERMISSIONS.SKILLS_DELETE,
  PERMISSIONS.USERS_READ,
  PERMISSIONS.USERS_UPDATE,
  PERMISSIONS.SWAPS_READ,
  PERMISSIONS.SWAPS_CREATE,
  PERMISSIONS.SWAPS_UPDATE,
];

/**
 * Yönetici (ADMIN) için Varsayılan İzin Listesi
 */
export const ADMIN_PERMISSIONS: string[] = [
  '*:*',
  'skills:*',
  'users:*',
  'swaps:*',
  'auth:*',
];


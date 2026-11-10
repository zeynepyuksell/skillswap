import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { config } from '../../config/env';
import { AppError } from '../../middlewares/errorHandler';
import { RegisterDTO, LoginDTO, AuthResponse } from './auth.model';
import { UserRole, DEFAULT_USER_PERMISSIONS } from './roles';

// Önceden hesaplanmış dummy bcrypt hash (Mevcut olmayan kullanıcılar için sabit zamanlı doğrulama)
const DUMMY_HASH = '$2a$10$wK0qP15N4i7u5s559h7kbeR3uTjZ0O9N9o/e2a8.f9Qx4j4Pz4jqy';

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Bu e-posta adresiyle zaten kayıtlı bir kullanıcı var', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        bio: data.bio || null,
        role: [UserRole.USER],
        permissions: DEFAULT_USER_PERMISSIONS,
      },
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        role: user.role,
        permissions: user.permissions,
      },
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    // Kullanıcı olmasa bile bcrypt.compare çalıştırarak zamanlama saldırılarını (timing attack) engelle
    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(data.password, hashToCompare);

    if (!user || !isMatch) {
      throw new AppError('Geçersiz e-posta veya şifre', 401);
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        role: user.role,
        permissions: user.permissions,
      },
      token,
    };
  }

  private generateToken(user: { id: string; email: string; role: string[]; permissions: string[] }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );
  }
}

export const authService = new AuthService();

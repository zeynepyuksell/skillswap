import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { UpdateUserProfileDTO } from './user.model';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        rating: true,
        totalReviews: true,
        role: true,
        permissions: true,
        createdAt: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Kullanıcı bulunamadı', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateUserProfileDTO) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        rating: true,
        totalReviews: true,
        role: true,
        permissions: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async listUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          bio: true,
          avatarUrl: true,
          rating: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: { rating: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const userService = new UserService();

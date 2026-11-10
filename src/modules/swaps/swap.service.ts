import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { CreateSwapRequestDTO, UpdateSwapStatusDTO } from './swap.model';

export class SwapService {
  async createSwapRequest(requesterId: string, data: CreateSwapRequestDTO) {
    if (requesterId === data.receiverId) {
      throw new AppError('Kendinize takas isteği gönderemezsiniz', 400);
    }

    const receiver = await prisma.user.findUnique({
      where: { id: data.receiverId },
    });
    if (!receiver) {
      throw new AppError('Alıcı kullanıcı bulunamadı', 404);
    }

    const swap = await prisma.swapRequest.create({
      data: {
        requesterId,
        receiverId: data.receiverId,
        offeredSkillId: data.offeredSkillId,
        requestedSkillId: data.requestedSkillId,
        message: data.message,
      },
      include: {
        requester: { select: { id: true, fullName: true, avatarUrl: true } },
        receiver: { select: { id: true, fullName: true, avatarUrl: true } },
        offeredSkill: true,
        requestedSkill: true,
      },
    });

    return swap;
  }

  async updateSwapStatus(userId: string, swapId: string, data: UpdateSwapStatusDTO) {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
    });

    if (!swap) {
      throw new AppError('Takas talebi bulunamadı', 404);
    }

    // Yetki kontrolü: Sadece alıcı kabul/ret edebilir, iptal eden requester olabilir
    if (data.status === 'ACCEPTED' || data.status === 'REJECTED') {
      if (swap.receiverId !== userId) {
        throw new AppError('Bu talebi sadece alıcı yanıtlayabilir', 403);
      }
    } else if (data.status === 'CANCELLED') {
      if (swap.requesterId !== userId) {
        throw new AppError('Talebi yalnızca oluşturan kişi iptal edebilir', 403);
      }
    } else if (data.status === 'COMPLETED') {
      if (swap.requesterId !== userId && swap.receiverId !== userId) {
        throw new AppError('Yalnızca takas tarafları tamamlandı olarak işaretleyebilir', 403);
      }
    }

    return prisma.swapRequest.update({
      where: { id: swapId },
      data: {
        status: data.status,
        notes: data.notes,
      },
      include: {
        requester: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } },
        offeredSkill: true,
        requestedSkill: true,
      },
    });
  }

  async listUserSwaps(userId: string, status?: string) {
    const where: any = {
      OR: [{ requesterId: userId }, { receiverId: userId }],
    };

    if (status) {
      where.status = status;
    }

    return prisma.swapRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, fullName: true, avatarUrl: true, rating: true } },
        receiver: { select: { id: true, fullName: true, avatarUrl: true, rating: true } },
        offeredSkill: true,
        requestedSkill: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const swapService = new SwapService();

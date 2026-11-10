import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { CreateSkillDTO, AddUserSkillDTO } from './skill.model';

export class SkillService {
  async listSkills(search?: string, category?: string) {
    const where: any = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'Tümü') {
      const categoryWithAmpersand = category.replace(/\s+ve\s+/gi, ' & ');
      const categoryWithVe = category.replace(/\s+&\s+/gi, ' ve ');

      where.category = {
        in: [category, categoryWithAmpersand, categoryWithVe],
        mode: 'insensitive',
      };
    }

    return prisma.skill.findMany({
      where,
      include: {
        users: {
          where: { type: 'OFFERING' },
          select: { userId: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createSkill(data: CreateSkillDTO) {
    console.log('\n------------------ [API LIFECYCLE: 2. SERVICE BAŞLADI] ------------------');
    console.log('⚙️ [SkillService.createSkill] İş Mantığı Başlatıldı:');
    console.log('   📥 Alınan Parametreler:', data);

    const slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    console.log(`   🏷️ Üretilen URL/Slug:', "${slug}"`);

    console.log('   🔍 Prisma ile veritabanında mükerrer kayıt kontrolü yapılıyor...');
    const existing = await prisma.skill.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (existing) {
      console.warn(`   ⚠️ Uyarı: Bu yetenek ("${existing.name}") zaten veritabanında mevcut!`);
      throw new AppError('Bu yetenek zaten mevcut', 400);
    }

    console.log('   💾 Prisma ile PostgreSQL veritabanına yeni kayıt ekleniyor...');
    const createdSkill = await prisma.skill.create({
      data: {
        name: data.name,
        slug,
        category: data.category,
        description: data.description,
      },
    });

    console.log('------------------ [API LIFECYCLE: 2. SERVICE TAMAMLANDI] ------------------');
    console.log('✅ [SkillService.createSkill] Veritabanına Kayıt Başarıyla Yazıldı:');
    console.log('   🆔 ID:', createdSkill.id);
    console.log('   🏷️ İsim:', createdSkill.name);
    console.log('   📂 Kategori:', createdSkill.category);

    return createdSkill;
  }

  async addUserSkill(userId: string, data: AddUserSkillDTO) {
    const skill = await prisma.skill.findUnique({
      where: { id: data.skillId },
    });

    if (!skill) {
      throw new AppError('Yetenek bulunamadı', 404);
    }

    return prisma.userSkill.upsert({
      where: {
        userId_skillId_type: {
          userId,
          skillId: data.skillId,
          type: data.type,
        },
      },
      update: {
        proficiencyLevel: data.proficiencyLevel,
        yearsExperience: data.yearsExperience,
        description: data.description,
      },
      create: {
        userId,
        skillId: data.skillId,
        type: data.type,
        proficiencyLevel: data.proficiencyLevel,
        yearsExperience: data.yearsExperience,
        description: data.description,
      },
      include: {
        skill: true,
      },
    });
  }

  async removeUserSkill(userId: string, userSkillId: string) {
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill || userSkill.userId !== userId) {
      throw new AppError('Yetkinlik kaydı bulunamadı veya silme yetkiniz yok', 404);
    }

    await prisma.userSkill.delete({
      where: { id: userSkillId },
    });

    return { message: 'Yetenek profilden kaldırıldı' };
  }
}

export const skillService = new SkillService();

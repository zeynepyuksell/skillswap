import { Request, Response, NextFunction } from 'express';
import { skillService } from './skill.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class SkillController {
  async listSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const skills = await skillService.listSkills(search, category);
      return ApiResponse.success(res, skills);
    } catch (error) {
      return next(error);
    }
  }

  async createSkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      console.log('\n================== [API LIFECYCLE: 1. CONTROLLER BAŞLADI] ==================');
      console.log('📌 [SkillController.createSkill] İstek Alındı:');
      console.log('   👤 İstek Atan Kullanıcı:', {
        id: req.user?.id,
        email: req.user?.email,
        role: req.user?.role,
        permissions: req.user?.permissions,
      });
      console.log('   📦 Gelen İstek Gövdesi (Body):', req.body);

      console.log('\n➡️ [SkillController -> SkillService] Servis iş mantığı çağrılıyor...');
      const skill = await skillService.createSkill(req.body);

      console.log('\n================== [API LIFECYCLE: 3. CONTROLLER TAMAMLANDI] ==================');
      console.log('✅ [SkillController.createSkill] Servisten Başarılı Sonuç Döndü:');
      console.log('   🆔 Eklenen Yetenek ID:', skill.id);
      console.log('   🏷️ Yetenek Adı:', skill.name);
      console.log('📤 HTTP 201 Created yanıtı istemciye gönderiliyor.\n');

      return ApiResponse.created(res, skill, 'Yetenek başarıyla eklendi');
    } catch (error) {
      console.error('❌ [SkillController.createSkill] Hata Yakalandı:', error);
      return next(error);
    }
  }

  async addUserSkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userSkill = await skillService.addUserSkill(req.user!.id, req.body);
      return ApiResponse.created(res, userSkill, 'Yetenek profilinize eklendi');
    } catch (error) {
      return next(error);
    }
  }

  async removeUserSkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await skillService.removeUserSkill(req.user!.id, req.params.userSkillId);
      return ApiResponse.success(res, result);
    } catch (error) {
      return next(error);
    }
  }
}

export const skillController = new SkillController();

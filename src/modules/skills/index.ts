import { Router } from 'express';
import { skillController } from './skill.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createSkillSchema, addUserSkillSchema } from './skill.model';
import { PERMISSIONS } from '../../constants';

const router = Router();

// Genel yetenek listesi (herkese açık)
router.get('/', skillController.listSkills);

// Yeni yetenek tanımlama (oturum tokeni + skills:create izni)
router.post('/', authMiddleware(PERMISSIONS.SKILLS_CREATE), validateRequest(createSkillSchema), skillController.createSkill);

// Kullanıcı profiline yetenek ekleme/güncelleme
router.post('/my-skills', authMiddleware(PERMISSIONS.SKILLS_CREATE), validateRequest(addUserSkillSchema), skillController.addUserSkill);

// Kullanıcı profilinden yetenek kaldırma
router.delete('/my-skills/:userSkillId', authMiddleware(PERMISSIONS.SKILLS_DELETE), skillController.removeUserSkill);

export { router as skillRoutes };
export * from './skill.service';
export * from './skill.controller';
export * from './skill.model';

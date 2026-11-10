"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seed işlemi başlatılıyor...');
    // 1. Önceki verileri temizle (Sıralı cascade temizlik)
    await prisma.review.deleteMany();
    await prisma.swapRequest.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.user.deleteMany();
    await prisma.skill.deleteMany();
    console.log('🧹 Eski veriler temizlendi.');
    // 2. Yetenekleri (Skills) ekle
    const initialSkills = [
        // Yazılım & Teknoloji
        { name: 'TypeScript', category: 'Yazılım & Teknoloji', description: 'Modern tip güvenli JavaScript geliştirme' },
        { name: 'React', category: 'Yazılım & Teknoloji', description: 'Kullanıcı arayüzleri ve web uygulaması geliştirme' },
        { name: 'Node.js', category: 'Yazılım & Teknoloji', description: 'Sunucu tarafı JavaScript ve REST API geliştirme' },
        { name: 'Python', category: 'Yazılım & Teknoloji', description: 'Veri analizi, yapay zeka ve backend geliştirme' },
        { name: 'Docker', category: 'Yazılım & Teknoloji', description: 'Konteynerleştirme ve dağıtım temelleri' },
        // Tasarım
        { name: 'UI/UX Tasarımı', category: 'Tasarım', description: 'Figma ile kullanıcı deneyimi ve modern arayüz tasarımı' },
        { name: 'Adobe Photoshop', category: 'Tasarım', description: 'Fotoğraf düzenleme ve dijital görsel hazırlama' },
        { name: '3D Modelleme (Blender)', category: 'Tasarım', description: '3 boyutlu modelleme ve sahne render' },
        // Yabancı Dil
        { name: 'İngilizce (Akıcı Konuşma)', category: 'Yabancı Dil', description: 'İş İngilizcesi ve günlük konuşma pratiği' },
        { name: 'İspanyolca (A1-B1)', category: 'Yabancı Dil', description: 'Temel ve orta seviye İspanyolca konuşma/gramer' },
        { name: 'Almanca (A1-A2)', category: 'Yabancı Dil', description: 'Günlük yaşam ve başlangıç seviyesi Almanca' },
        // Müzik & Sanat
        { name: 'Akustik Gitar', category: 'Müzik & Sanat', description: 'Temel akorlar, ritimler ve parmak tekniği' },
        { name: 'Piyano', category: 'Müzik & Sanat', description: 'Temel piyano tuşe tekniği ve nota okuma' },
        // İş & Kariyer
        { name: 'Dijital Pazarlama & SEO', category: 'İş & Kariyer', description: 'Arama motoru optimizasyonu ve büyüme stratejileri' },
        { name: 'CV & Mülakat Koçluğu', category: 'İş & Kariyer', description: 'Teknik mülakat hazırlığı ve CV incelemesi' },
    ];
    const createdSkills = [];
    for (const s of initialSkills) {
        const slug = s.name.toLowerCase().trim().replace(/[^a-z0-9ğüşıöç]+/g, '-');
        const skill = await prisma.skill.create({
            data: {
                name: s.name,
                slug,
                category: s.category,
                description: s.description,
            },
        });
        createdSkills.push(skill);
    }
    console.log(`✅ ${createdSkills.length} adet yetenek oluşturuldu.`);
    // 3. Kullanıcıları Ekle
    const defaultPassword = await bcryptjs_1.default.hash('password123', 10);
    const userZeynep = await prisma.user.create({
        data: {
            email: 'zeynep@example.com',
            passwordHash: defaultPassword,
            fullName: 'Zeynep Yüksel',
            bio: 'Fullstack Developer. TypeScript, Node.js ve React üzerine çalışıyorum. İspanyolca öğrenmek istiyorum.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
            rating: 4.9,
            totalReviews: 8,
        },
    });
    const userCaner = await prisma.user.create({
        data: {
            email: 'caner@example.com',
            passwordHash: defaultPassword,
            fullName: 'Caner Kaya',
            bio: 'Senior UI/UX Tasarımcısı & Figma tutkunu. Akustik gitar çalıyorum, React ve frontend temellerini geliştirmek istiyorum.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            rating: 4.8,
            totalReviews: 5,
        },
    });
    const userElif = await prisma.user.create({
        data: {
            email: 'elif@example.com',
            passwordHash: defaultPassword,
            fullName: 'Elif Demir',
            bio: 'Yeminli tercüman. İspanyolca ve İngilizce eğitmeni. Yazılım dünyasına meraklıyım, Python öğrenmek istiyorum.',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            rating: 5.0,
            totalReviews: 12,
        },
    });
    const userBurak = await prisma.user.create({
        data: {
            email: 'burak@example.com',
            passwordHash: defaultPassword,
            fullName: 'Burak Yıldız',
            bio: 'Veri Analisti ve Python geliştirici. Görsel tasarım ve Figma öğrenmek istiyorum.',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
            rating: 4.7,
            totalReviews: 3,
        },
    });
    console.log('✅ 4 adet örnek kullanıcı oluşturuldu (Şifreleri: password123).');
    // Yetenekleri kolay bulmak için bir harita
    const skillMap = new Map(createdSkills.map((s) => [s.name, s.id]));
    // 4. Kullanıcı Yeteneklerini İlişkilendir (UserSkill)
    // Zeynep: Öğretir -> TypeScript, React | Öğrenmek ister -> İspanyolca
    await prisma.userSkill.createMany({
        data: [
            {
                userId: userZeynep.id,
                skillId: skillMap.get('TypeScript'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.ADVANCED,
                yearsExperience: 4,
                description: 'Büyük ölçekli projelerde TypeScript mimarisi.',
            },
            {
                userId: userZeynep.id,
                skillId: skillMap.get('React'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.ADVANCED,
                yearsExperience: 3,
                description: 'Modern Hooks, State yönetimi ve performans optimizasyonu.',
            },
            {
                userId: userZeynep.id,
                skillId: skillMap.get('İspanyolca (A1-B1)'),
                type: client_1.SkillExchangeType.SEEKING,
                proficiencyLevel: client_1.ProficiencyLevel.BEGINNER,
                description: 'Günlük konuşma pratiği yapabileceğim bir partner arıyorum.',
            },
        ],
    });
    // Caner: Öğretir -> UI/UX, Akustik Gitar | Öğrenmek ister -> React
    await prisma.userSkill.createMany({
        data: [
            {
                userId: userCaner.id,
                skillId: skillMap.get('UI/UX Tasarımı'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.EXPERT,
                yearsExperience: 6,
                description: 'Figma Auto-layout, Design System ve prototipleme.',
            },
            {
                userId: userCaner.id,
                skillId: skillMap.get('Akustik Gitar'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.INTERMEDIATE,
                yearsExperience: 5,
                description: 'Akor geçişleri, arpej ve ritim kalıpları.',
            },
            {
                userId: userCaner.id,
                skillId: skillMap.get('React'),
                type: client_1.SkillExchangeType.SEEKING,
                proficiencyLevel: client_1.ProficiencyLevel.BEGINNER,
                description: 'Tasarım projelerimi kodlayacak kadar React öğrenmek istiyorum.',
            },
        ],
    });
    // Elif: Öğretir -> İspanyolca, İngilizce | Öğrenmek ister -> Python
    await prisma.userSkill.createMany({
        data: [
            {
                userId: userElif.id,
                skillId: skillMap.get('İspanyolca (A1-B1)'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.EXPERT,
                yearsExperience: 8,
                description: 'A1-C1 arası her seviyede pratik ve telaffuz odaklı ders.',
            },
            {
                userId: userElif.id,
                skillId: skillMap.get('İngilizce (Akıcı Konuşma)'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.EXPERT,
                yearsExperience: 10,
                description: 'Akıcı konuşma ve iş dünyası terimleri.',
            },
            {
                userId: userElif.id,
                skillId: skillMap.get('Python'),
                type: client_1.SkillExchangeType.SEEKING,
                proficiencyLevel: client_1.ProficiencyLevel.BEGINNER,
                description: 'Metin işleme ve çeviri otomasyonları yazmak için Python öğrenmek istiyorum.',
            },
        ],
    });
    // Burak: Öğretir -> Python | Öğrenmek ister -> UI/UX Tasarımı
    await prisma.userSkill.createMany({
        data: [
            {
                userId: userBurak.id,
                skillId: skillMap.get('Python'),
                type: client_1.SkillExchangeType.OFFERING,
                proficiencyLevel: client_1.ProficiencyLevel.ADVANCED,
                yearsExperience: 4,
                description: 'Pandas, NumPy, otomasyon ve veri analitiği.',
            },
            {
                userId: userBurak.id,
                skillId: skillMap.get('UI/UX Tasarımı'),
                type: client_1.SkillExchangeType.SEEKING,
                proficiencyLevel: client_1.ProficiencyLevel.BEGINNER,
                description: 'Dashboard ve raporlama arayüzleri tasarlamayı öğrenmek istiyorum.',
            },
        ],
    });
    console.log('✅ Kullanıcı yetenek eşleşmeleri (UserSkills) oluşturuldu.');
    // 5. Örnek Takas Talebi (Zeynep -> Elif: React karşılığı İspanyolca)
    const swapRequest = await prisma.swapRequest.create({
        data: {
            requesterId: userZeynep.id,
            receiverId: userElif.id,
            offeredSkillId: skillMap.get('React'),
            requestedSkillId: skillMap.get('İspanyolca (A1-B1)'),
            status: client_1.SwapStatus.ACCEPTED,
            message: 'Merhaba Elif Hanım! Size React konusunda mentorluk yapabilirim, karşılığında İspanyolca pratik yapabilir miyiz?',
            notes: 'Haftada 2 gün 45 dakika Zoom üzerinden kararlaştırıldı.',
        },
    });
    // 6. Örnek İnceleme / Puanlama (Review)
    await prisma.review.create({
        data: {
            swapRequestId: swapRequest.id,
            reviewerId: userElif.id,
            revieweeId: userZeynep.id,
            rating: 5,
            comment: 'Zeynep harika bir mentor! React bileşen mantığını çok anlaşılır şekilde açıkladı.',
        },
    });
    console.log('✅ Örnek takas talebi ve değerlendirme (Review) oluşturuldu.');
    console.log('🎉 Seed işlemi başarıyla tamamlandı!');
}
main()
    .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
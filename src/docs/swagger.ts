export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SkillSwap API Dokümantasyonu',
    version: '1.0.0',
    description:
      'SkillSwap - Yetenek Takası ve Mentorluk Platformu için RESTful API arayüzü.\n\nTest için varsayılan kullanıcı şifresi: `password123`\nÖrnek kullanıcılar: `zeynep@example.com`, `caner@example.com`, `elif@example.com`, `burak@example.com`',
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Yerel Geliştirme Sunucusu',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT tokenınızı doğrudan buraya yapıştırın (Tırnak işareti veya "Bearer " yazmanıza gerek yoktur).',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Sistem Durumu (Health Check)',
        tags: ['System'],
        responses: {
          200: {
            description: 'API sorunsuz çalışıyor',
          },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'Yeni kullanıcı kaydı',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'fullName'],
                properties: {
                  email: { type: 'string', example: 'yeni.kullanici@example.com' },
                  password: { type: 'string', example: 'password123' },
                  fullName: { type: 'string', example: 'Ahmet Yılmaz' },
                  bio: { type: 'string', example: 'Mobil uygulama geliştiricisi' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Kullanıcı başarıyla oluşturuldu ve token üretildi' },
          400: { description: 'E-posta zaten kayıtlı veya geçersiz veri' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Kullanıcı girişi',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'zeynep@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Giriş başarılı, JWT token döner' },
          401: { description: 'Hatalı e-posta veya şifre' },
        },
      },
    },
    '/api/v1/users': {
      get: {
        summary: 'Kullanıcı ve mentor listesini getir',
        tags: ['Users'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Kullanıcı listesi ve yetenekleri' },
        },
      },
    },
    '/api/v1/users/me': {
      get: {
        summary: 'Giriş yapmış kullanıcının kendi profilini getir',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Kullanıcı detayları ve yetenekleri' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
      patch: {
        summary: 'Profil bilgilerini güncelle',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Zeynep Yüksel' },
                  bio: { type: 'string', example: 'Fullstack & Cloud Mimarisi' },
                  avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profil güncellendi' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
    },
    '/api/v1/users/{id}': {
      get: {
        summary: 'ID ile belirli bir kullanıcının profilini getir',
        tags: ['Users'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Kullanıcı profili' },
          404: { description: 'Kullanıcı bulunamadı' },
        },
      },
    },
    '/api/v1/skills': {
      get: {
        summary: 'Tüm yetenek havuzunu listele ve filtrele',
        tags: ['Skills'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Yetenek adı arama (örn: React)' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Kategori (örn: Tasarım)' },
        ],
        responses: {
          200: { description: 'Yetenekler listesi' },
        },
      },
      post: {
        summary: 'Sisteme yeni bir yetenek ekle',
        tags: ['Skills'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category'],
                properties: {
                  name: { type: 'string', example: 'Next.js' },
                  category: { type: 'string', example: 'Yazılım & Teknoloji' },
                  description: { type: 'string', example: 'React tabanlı tam kapsamlı web framework' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Yetenek oluşturuldu' },
          400: { description: 'Yetenek zaten mevcut' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
    },
    '/api/v1/skills/my-skills': {
      post: {
        summary: 'Kendi profiline öğretilecek (OFFERING) veya öğrenilecek (SEEKING) yetenek ekle',
        tags: ['Skills'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['skillId', 'type'],
                properties: {
                  skillId: { type: 'string', example: 'UUID' },
                  type: { type: 'string', enum: ['OFFERING', 'SEEKING'], example: 'OFFERING' },
                  proficiencyLevel: {
                    type: 'string',
                    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
                    example: 'ADVANCED',
                  },
                  yearsExperience: { type: 'integer', example: 3 },
                  description: { type: 'string', example: 'Haftalık 2 saat birebir mentörlük sağlayabilirim.' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Yetenek profilinize eklendi' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
    },
    '/api/v1/skills/my-skills/{userSkillId}': {
      delete: {
        summary: 'Profildeki bir yetenek kaydını kaldır',
        tags: ['Skills'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'userSkillId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Yetenek silindi' },
          401: { description: 'Yetkisiz erişim' },
          404: { description: 'Kayıt bulunamadı' },
        },
      },
    },
    '/api/v1/swaps/my-swaps': {
      get: {
        summary: 'Kullanıcının gönderdiği ve aldığı takas tekliflerini listele',
        tags: ['Swaps'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'] },
          },
        ],
        responses: {
          200: { description: 'Takas talepleri listesi' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
    },
    '/api/v1/swaps': {
      post: {
        summary: 'Başka bir kullanıcıya takas/mentorluk teklifi gönder',
        tags: ['Swaps'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['receiverId', 'offeredSkillId', 'requestedSkillId', 'message'],
                properties: {
                  receiverId: { type: 'string', example: 'UUID' },
                  offeredSkillId: { type: 'string', example: 'UUID' },
                  requestedSkillId: { type: 'string', example: 'UUID' },
                  message: { type: 'string', example: 'React mentörlüğü karşılığında İspanyolca pratik yapmak isterim.' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Takas teklifi iletildi' },
          400: { description: 'Geçersiz parametreler' },
          401: { description: 'Yetkisiz erişim' },
        },
      },
    },
    '/api/v1/swaps/{id}/status': {
      patch: {
        summary: 'Takas durumunu güncelle (ACCEPTED, REJECTED, CANCELLED, COMPLETED)',
        tags: ['Swaps'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
                    example: 'ACCEPTED',
                  },
                  notes: { type: 'string', example: 'Cumartesi günleri saat 14:00 uygun.' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Takas durumu güncellendi' },
          401: { description: 'Yetkisiz erişim' },
          403: { description: 'Yetki yok' },
          404: { description: 'Takas talebi bulunamadı' },
        },
      },
    },
  },
};

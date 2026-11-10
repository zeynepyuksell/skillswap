# SkillSwap Backend 🚀
Yetenek Takası ve Mentorluk Platformu REST API

SkillSwap, bireylerin herhangi bir maddi ödeme yapmaksızın sahip oldukları bilgi ve yetenekleri birbirleriyle takas etmelerini (**Peer-to-Peer Skill Exchange**) ve karşılıklı mentorluk ilişkisi kurmalarını sağlayan modern bir topluluk platformudur. 

Örneğin bir yazılımcı İspanyolca öğrenmek için bir dil eğitmenine kodlama mentorluğu teklif edebilir, bir tasarımcı ise müzik teorisi karşılığında UI/UX tasarımı öğretebilir.

---

## 📖 Proje Hakkında ve Temel Felsefe

Geleneksel eğitim süreçleri ve kurslar genellikle tek taraflı ve yüksek maliyetlidir. **SkillSwap**, herkesin başkasına öğretebileceği en az bir yeteneği ve geliştirmek istediği yeni bir tutkusu olduğu fikri üzerine inşa edilmiştir.

### 🌟 Öne Çıkan Özellikler

- **🔐 Güvenli Kimlik & Profil Yönetimi:** JWT tabanlı kimlik doğrulama, parola hash'leme (bcrypt), biyografi, avatar ve kullanıcı itibar puanı (rating).
- **💡 Yetenek Havuzu (Skills):**
  - **Öğretebileceklerim (`OFFERING`):** Kullanıcının mentorluk yapabileceği uzmanlıklar.
  - **Öğrenmek İstediklerim (`SEEKING`):** Kullanıcının öğrenmek istediği yetenekler.
  - **Yetkinlik Seviyeleri:** Başlangıç (`BEGINNER`), Orta (`INTERMEDIATE`), İleri (`ADVANCED`) ve Uzman (`EXPERT`) seviye belirleme ve tecrübe yılı takibi.
- **🤝 Takas ve Mentorluk Teklifleri (Swap Requests):**
  - Birebir takas teklifi oluşturma (*"Ben sana React öğreteyim, sen bana Piyano öğret"*).
  - Teklif yaşam döngüsü: `PENDING` (Beklemede) ➔ `ACCEPTED` (Kabul Edildi) / `REJECTED` (Reddedildi) / `CANCELLED` (İptal) ➔ `COMPLETED` (Tamamlandı).
- **⭐ Değerlendirme & İtibar Sistemi (Reviews):**
  - Tamamlanan takaslar sonrasında tarafların birbirine 1-5 yıldız ve yorum bırakabilmesi.
  - Dinamik kullanıcı puan ortalaması ve toplam değerlendirme sayısı hesaplaması.
- **🛡️ İleri Düzey Güvenlik (Hardened Security):**
  - Brute-force ve DoS saldırılarına karşı IP bazlı istek sınırlandırma (`express-rate-limit`).
  - Kullanıcı varlığı tespiti saldırılarına karşı koruma (User Enumeration Prevention - CWE-203/204).
  - Sıkı domain beyaz liste kontrolü ile güvenli CORS yapılandırması (CWE-942).
  - Zod şemaları ile uçtan uca tip ve girdi doğrulaması (Input Validation).
- **📑 Canlı Swagger API Dokümantasyonu:** `/api/docs` üzerinden tüm uç noktaları interaktif olarak test edebilme.

---

## 🛠️ Teknoloji Yığını
- **Runtime:** Node.js
- **Framework:** Express.js
- **Dil:** TypeScript
- **ORM:** Prisma
- **Veritabanı:** PostgreSQL
- **Doğrulama:** Zod
- **Kimlik Doğrulama:** JWT & Bcrypt
- **API Dokümantasyonu:** Swagger UI & OpenAPI 3.0
- **Test:** Vitest & Supertest
- **İstemci (Frontend):** React, Vite, TypeScript, Tailwind CSS (ayrıca `client/` dizininde yer almaktadır)

---

## 📁 Proje Klasör Mimarisi (`modules/` pattern)

Proje, genişletilebilirliği artıran ve alan odaklı tasarımı (Domain-Driven / Modular) benimseyen modüler bir mimariyle geliştirilmiştir:

```
skillswap-backend/
├── prisma/
│   ├── migrations/            # Veritabanı migrasyon geçmişi
│   ├── schema.prisma          # PostgreSQL veri modelleri (User, Skill, UserSkill, SwapRequest, Review)
│   └── seed.ts                # Başlangıç test verileri ve yetenek tohumlayıcı
├── src/
│   ├── config/                # Ortam değişkenleri ve Prisma istemcisi
│   │   ├── env.ts
│   │   └── prisma.ts
│   ├── docs/                  # OpenAPI / Swagger dokümantasyon şeması
│   │   └── swagger.ts
│   ├── middlewares/           # Hata yönetimi, JWT ve validasyon katmanları
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── validate.middleware.ts
│   ├── modules/               # Modüler iş mantığı
│   │   ├── auth/              # Kimlik doğrulama (Kayıt, Giriş, Token, Rate-limit)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   ├── users/             # Kullanıcı profili yönetimi ve mentor listesi
│   │   │   ├── user.controller.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.service.ts
│   │   │   └── index.ts
│   │   ├── skills/            # Yetenek havuzu ve kullanıcı yetenekleri
│   │   │   ├── skill.controller.ts
│   │   │   ├── skill.model.ts
│   │   │   ├── skill.service.ts
│   │   │   └── index.ts
│   │   └── swaps/             # Takas ve mentorluk teklifleri yönetimi
│   │       ├── swap.controller.ts
│   │       ├── swap.model.ts
│   │       ├── swap.service.ts
│   │       └── index.ts
│   ├── routes/                # Modül rotalarının tek çatı altında toplanması
│   │   └── index.ts
│   ├── utils/                 # Ortak yardımcı fonksiyonlar (standart API cevabı, logger vb.)
│   │   ├── apiResponse.ts
│   │   └── logger.ts
│   ├── app.ts                 # Express uygulaması, CORS, middleware ve Swagger entegrasyonu
│   └── server.ts              # Sunucu başlatıcı ve graceful shutdown yönetimi
├── tests/                     # Güvenlik ve regresyon testleri (CORS, Rate Limiting, Enumeration)
│   └── security.test.ts
├── client/                    # React + Vite + TypeScript Frontend Arayüzü
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ⚡ Hızlı Başlangıç

### 1. Bağımlılıkları Kurun
```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın
Kök dizindeki `.env.example` dosyasını `.env` olarak kopyalayın ve `DATABASE_URL` değerini kendi PostgreSQL bağlantı bilginizle güncelleyin:
```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:sifreniz@localhost:5432/skillswap_db?schema=public"
JWT_SECRET="super-secret-jwt-key-change-in-production-12345"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
```

### 3. Veritabanı Şemasını ve Prisma İstemcisini Oluşturun
```bash
npx prisma migrate dev --name init
npx prisma generate
```

*(Opsiyonel)* Hazır test kullanıcıları, kategoriler ve örnek takas verilerini veritabanına yüklemek için seed komutunu çalıştırabilirsiniz:
```bash
npm run prisma:seed
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Sunucu hazır olduğunda `http://localhost:5000/health` adresinden kontrol edebilirsiniz.

---

## 📚 API Dokümantasyonu (Swagger UI)

Sunucu çalışırken etkileşimli API dokümantasyonuna ve uç nokta test paneline tarayıcınızdan erişebilirsiniz:

- **Swagger UI:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **OpenAPI JSON Şeması:** [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)

### Temel API Uç Noktaları Özeti

| Kategori | Metot | Uç Nokta | Açıklama | Yetki |
| :--- | :--- | :--- | :--- | :--- |
| **Sistem** | `GET` | `/health` | API sağlık durumu kontrolü | Herkes |
| **Auth** | `POST` | `/api/v1/auth/register` | Yeni kullanıcı kaydı oluşturma | Herkes |
| **Auth** | `POST` | `/api/v1/auth/login` | Giriş yapma ve JWT token alma | Herkes (Rate Limited) |
| **Users** | `GET` | `/api/v1/users` | Kullanıcıları/mentorları listeleme | Herkes |
| **Users** | `GET` | `/api/v1/users/:id` | Kullanıcı profil detayını görüntüleme | Herkes |
| **Users** | `GET` | `/api/v1/users/me` | Oturum açan kullanıcının profilini getirme | Bearer Token |
| **Users** | `PATCH` | `/api/v1/users/me` | Profil bilgilerini güncelleme | Bearer Token |
| **Skills** | `GET` | `/api/v1/skills` | Tüm yetenek kategorilerini listeleme | Herkes |
| **Skills** | `POST` | `/api/v1/skills` | Yeni bir global yetenek oluşturma | Bearer Token |
| **Skills** | `POST` | `/api/v1/skills/my-skills` | Kendi profiline yetenek ekleme (`OFFERING`/`SEEKING`) | Bearer Token |
| **Skills** | `DELETE` | `/api/v1/skills/my-skills/:id` | Profilinden yetenek kaldırma | Bearer Token |
| **Swaps** | `POST` | `/api/v1/swaps` | Yeni takas teklifi oluşturma | Bearer Token |
| **Swaps** | `GET` | `/api/v1/swaps/my-swaps` | Kullanıcının gelen/giden teklifleri | Bearer Token |
| **Swaps** | `PATCH` | `/api/v1/swaps/:id/status` | Teklifi onaylama, reddetme veya tamamlama | Bearer Token |

---

## 💻 Ön Yüz (Frontend Arayüzü)

Proje içerisinde yer alan React + Vite tabanlı web arayüzünü çalıştırmak için:

```bash
cd client
npm install
npm run dev
```

Frontend arayüzüne varsayılan olarak [http://localhost:5173](http://localhost:5173) adresinden erişebilirsiniz.

---

## 🧪 Testler ve Kod Kalitesi

Projedeki güvenlik kontrolleri (Rate Limiting, User Enumeration engeli, CORS politikası) Vitest ile test edilmektedir:

```bash
npm run test
```

Prisma veritabanı yönetim arayüzünü açmak için:
```bash
npm run prisma:studio
```

---

## 📜 Lisans

Bu proje ISC lisansı ile lisanslanmıştır.

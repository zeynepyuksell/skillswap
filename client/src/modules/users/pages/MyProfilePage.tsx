import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCurrentUser, useUpdateProfile } from '../hooks/useUsers';
import { useSkills, useAddUserSkill, useRemoveUserSkill } from '@/modules/skills/hooks/useSkills';
import {
  User as UserIcon,
  Sparkles,
  BookOpen,
  Trash2,
  Plus,
  Loader2,
  ArrowRight,
  Settings,
} from 'lucide-react';

// Profile update schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
  avatarUrl: z.string().url('Geçerli bir resim linki giriniz').or(z.literal('')).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Add skill schema
const addSkillSchema = z.object({
  skillId: z.string().min(1, 'Lütfen bir yetenek seçin'),
  type: z.enum(['OFFERING', 'SEEKING']),
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  yearsExperience: z.number().min(0),
  description: z.string().optional(),
});

type AddSkillFormData = z.infer<typeof addSkillSchema>;

export const MyProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'skills'>('info');

  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const { data: allSkills } = useSkills();
  const addSkillMutation = useAddUserSkill();
  const removeSkillMutation = useRemoveUserSkill();

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  // Add Skill Form
  const {
    register: registerSkill,
    handleSubmit: handleSkillSubmit,
    reset: resetSkillForm,
    formState: { errors: skillErrors },
  } = useForm<AddSkillFormData>({
    resolver: zodResolver(addSkillSchema),
    defaultValues: {
      skillId: '',
      type: 'OFFERING',
      proficiencyLevel: 'INTERMEDIATE',
      yearsExperience: 1,
      description: '',
    },
  });

  if (isLoadingUser) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
        <span className="text-sm font-medium">Profil yükleniyor...</span>
      </div>
    );
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate({
      fullName: data.fullName,
      bio: data.bio,
      avatarUrl: data.avatarUrl || undefined,
    });
  };

  const onSkillSubmit = (data: AddSkillFormData) => {
    addSkillMutation.mutate(data, {
      onSuccess: () => {
        resetSkillForm();
      },
    });
  };

  const offeringSkills = user?.skills?.filter((s) => s.type === 'OFFERING') || [];
  const seekingSkills = user?.skills?.filter((s) => s.type === 'SEEKING') || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
          Kişisel Alan
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2622] tracking-tight mt-1">
          Profilim & <span className="italic text-[#A34A26]">Yeteneklerim</span>
        </h1>
        <p className="text-sm text-[#5E564D] mt-1.5 font-normal">
          Bilgilerinizi güncelleyin ve takas etmek istediğiniz yeteneklerinizi yönetin.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#E2D6C1] gap-8">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'info'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profil Bilgileri</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Yetenek Yönetimi ({user?.skills?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: Profil Bilgileri */}
      {activeTab === 'info' && (
        <div className="p-8 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs">
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5 max-w-xl">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#2B2622]">Ad Soyad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E564D]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  className="w-full h-12 pl-10 pr-3.5 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerProfile('fullName')}
                />
              </div>
              {profileErrors.fullName && (
                <p className="text-xs font-medium text-[#A34A26] mt-1">{profileErrors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#2B2622]">Hakkımda / Biyografi</label>
              <textarea
                rows={4}
                placeholder="Kendinizi, deneyimlerinizi ve ilgi alanlarınızı kısaca anlatın..."
                className="w-full p-3 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                {...registerProfile('bio')}
              />
              {profileErrors.bio && (
                <p className="text-xs font-medium text-[#A34A26] mt-1">{profileErrors.bio.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#2B2622]">Profil Fotoğrafı URL (Avatar)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                className="w-full h-12 px-3.5 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                {...registerProfile('avatarUrl')}
              />
              {profileErrors.avatarUrl && (
                <p className="text-xs font-medium text-[#A34A26] mt-1">{profileErrors.avatarUrl.message}</p>
              )}
            </div>

            {user?.avatarUrl && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={user.avatarUrl}
                  alt="Avatar Önizleme"
                  className="w-12 h-12 rounded-lg object-cover ring-1 ring-[#D4C8B2]"
                />
                <span className="text-xs text-[#5E564D]">Mevcut profil fotoğrafınız</span>
              </div>
            )}

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="mt-3 h-12 px-6 rounded-lg font-medium text-sm text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Değişiklikleri Kaydet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Yetenek Yönetimi */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Yeni Yetenek Ekle Formu */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs space-y-4">
            <div className="border-b border-[#E2D6C1] pb-3">
              <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
                YETENEK EKLE
              </span>
              <h2 className="font-serif text-lg text-[#2B2622] flex items-center gap-2 mt-1">
                <Plus className="w-4 h-4 text-[#2E4A3B]" />
                <span>Profiline Yeni Yetenek Ekle</span>
              </h2>
            </div>

            <form onSubmit={handleSkillSubmit(onSkillSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Yetenek Seç */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#2B2622]">Yetenek Havuzundan Seç</label>
                <select
                  className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerSkill('skillId')}
                >
                  <option value="">Bir yetenek seçin...</option>
                  {allSkills?.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
                {skillErrors.skillId && (
                  <p className="text-xs font-medium text-[#A34A26] mt-1">{skillErrors.skillId.message}</p>
                )}
              </div>

              {/* Takas Tipi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#2B2622]">Rolün (Öğretici mi, Öğrenici mi?)</label>
                <select
                  className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerSkill('type')}
                >
                  <option value="OFFERING">Öğretebilirim (OFFERING)</option>
                  <option value="SEEKING">Öğrenmek İstiyorum (SEEKING)</option>
                </select>
              </div>

              {/* Yetkinlik Seviyesi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#2B2622]">Yetkinlik Seviyesi</label>
                <select
                  className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerSkill('proficiencyLevel')}
                >
                  <option value="BEGINNER">Başlangıç Seviyesi</option>
                  <option value="INTERMEDIATE">Orta Seviye</option>
                  <option value="ADVANCED">İleri Seviye</option>
                  <option value="EXPERT">Uzman / Profesyonel</option>
                </select>
              </div>

              {/* Deneyim Yılı */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#2B2622]">Deneyim (Yıl)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerSkill('yearsExperience', { valueAsNumber: true })}
                />
              </div>

              {/* Açıklama */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-[#2B2622]">Kısa Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Haftada 2 saat online pratik yaptırabilirim..."
                  className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
                  {...registerSkill('description')}
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={addSkillMutation.isPending}
                  className="h-11 px-5 rounded-lg font-medium text-xs text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {addSkillMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Yeteneği Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mevcut Yetenekler Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Öğrettiklerim */}
            <div className="p-6 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2D6C1] pb-3">
                <div className="flex items-center gap-2 font-serif text-base text-[#2B2622]">
                  <Sparkles className="w-4 h-4 text-[#2E4A3B]" />
                  <span>Öğrettiğim Yetenekler</span>
                </div>
                <span className="text-xs bg-[#CFDCC8] text-[#243F31] font-medium px-2 py-0.5 rounded-md">
                  {offeringSkills.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {offeringSkills.length > 0 ? (
                  offeringSkills.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1]"
                    >
                      <div>
                        <div className="font-serif text-sm text-[#2B2622]">{item.skill.name}</div>
                        <div className="text-[11px] text-[#5E564D] mt-0.5">
                          {item.proficiencyLevel} • {item.yearsExperience || 0} yıl deneyim
                        </div>
                      </div>
                      <button
                        onClick={() => removeSkillMutation.mutate(item.id)}
                        disabled={removeSkillMutation.isPending}
                        className="p-2 text-[#5E564D] hover:text-[#A34A26] rounded-md hover:bg-[#EBC9B5]/40 transition-colors cursor-pointer"
                        title="Yeteneği Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5E564D] italic py-3">Henüz öğretici bir yetenek eklemediniz.</p>
                )}
              </div>
            </div>

            {/* Öğrenmek İstediklerim */}
            <div className="p-6 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2D6C1] pb-3">
                <div className="flex items-center gap-2 font-serif text-base text-[#2B2622]">
                  <BookOpen className="w-4 h-4 text-[#A34A26]" />
                  <span>Öğrenmek İstediklerim</span>
                </div>
                <span className="text-xs bg-[#EBC9B5] text-[#8E3F20] font-medium px-2 py-0.5 rounded-md">
                  {seekingSkills.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {seekingSkills.length > 0 ? (
                  seekingSkills.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1]"
                    >
                      <div>
                        <div className="font-serif text-sm text-[#2B2622]">{item.skill.name}</div>
                        <div className="text-[11px] text-[#5E564D] mt-0.5">{item.skill.category}</div>
                      </div>
                      <button
                        onClick={() => removeSkillMutation.mutate(item.id)}
                        disabled={removeSkillMutation.isPending}
                        className="p-2 text-[#5E564D] hover:text-[#A34A26] rounded-md hover:bg-[#EBC9B5]/40 transition-colors cursor-pointer"
                        title="Yeteneği Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5E564D] italic py-3">Henüz öğrenmek istediğiniz bir yetenek eklemediniz.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

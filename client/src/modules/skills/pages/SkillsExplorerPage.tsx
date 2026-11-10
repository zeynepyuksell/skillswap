import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkills } from '../hooks/useSkills';
import { useUsers } from '@/modules/users/hooks/useUsers';
import { SkillEditorialCard } from '../components/SkillEditorialCard';
import { MentorEditorialCard } from '@/modules/users/components/MentorEditorialCard';
import { SkillSwapModal } from '../components/SkillSwapModal';
import { SwapRequestModal } from '@/modules/users/components/SwapRequestModal';
import { useAuthStore } from '@/modules/auth/services/authStore';
import type { Skill, User } from '@/types/api';
import { Loader2, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Tümü',
  'Yazılım ve Teknoloji',
  'Tasarım',
  'Yabancı Dil',
  'Müzik ve Sanat',
  'İş ve Kariyer',
];

export const SkillsExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [explorerTab, setExplorerTab] = useState<'skills' | 'mentors'>('skills');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  // Modal states
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<Skill | null>(null);
  const [selectedMentorForProposal, setSelectedMentorForProposal] = useState<User | null>(null);

  // Backend queries
  const { data: skills, isLoading: isLoadingSkills } = useSkills(
    searchTerm.trim() || undefined,
    selectedCategory !== 'Tümü' ? selectedCategory : undefined
  );

  const { data: usersData, isLoading: isLoadingUsers } = useUsers(1, 50);

  const handleSuggestSwap = (skill: Skill) => {
    if (!isAuthenticated) {
      toast.info('Takas teklifinde bulunmak için lütfen önce giriş yapın.');
      navigate('/login');
      return;
    }
    setSelectedSkillForSwap(skill);
  };

  const handleOpenMentorSwap = (mentor: User) => {
    if (!isAuthenticated) {
      toast.info('Takas teklifinde bulunmak için lütfen önce giriş yapın.');
      navigate('/login');
      return;
    }
    setSelectedMentorForProposal(mentor);
  };

  // Filter mentors if on mentors tab
  const mentors = (usersData?.users || []).filter((user) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = user.fullName.toLowerCase().includes(term);
    const bioMatch = user.bio?.toLowerCase().includes(term);
    const skillMatch = user.skills?.some((s) => s.skill.name.toLowerCase().includes(term));
    return nameMatch || bioMatch || skillMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Başlık Alanı */}
      <div>
        <span className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#A34A26] block mb-2">
          KEŞİF HAVUZU
        </span>
        <h1 className="font-serif text-[42px] sm:text-[54px] font-semibold text-[#2B2622] leading-[1.08] tracking-tight">
          Bugün ne <em className="italic font-medium text-[#A34A26]">öğrenmek</em> istersin?
        </h1>
        <p className="text-sm text-[#5E564D] max-w-2xl mt-3 font-normal leading-relaxed">
          Birinin bildiği, senin merak ettiğin yetenekleri veya deneyimli mentorları keşfet. Profillerini incele, favorilerine ekle ve takas teklif et.
        </p>
      </div>

      {/* Keşif Sekmeleri: Yetenekler vs Mentorlar */}
      <div className="flex border-b border-[#E2D6C1] gap-8">
        <button
          type="button"
          onClick={() => setExplorerTab('skills')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            explorerTab === 'skills'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#2E4A3B]" />
          <span>Yetenek Havuzu ({skills?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setExplorerTab('mentors')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            explorerTab === 'mentors'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Users className="w-4 h-4 text-[#A34A26]" />
          <span>Mentorlar & Eğitmenler ({mentors.length})</span>
        </button>
      </div>

      {/* Arama ve Kategori Filtreleme */}
      <div className="space-y-4">
        {/* Arama Inputu */}
        <div className="max-w-xl">
          <label className="block text-[12px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] mb-2">
            {explorerTab === 'skills' ? 'Yetenek Ara' : 'Mentor veya Yetenek Ara'}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              explorerTab === 'skills'
                ? 'Örneğin: gitar, Python, İspanyolca'
                : 'Örneğin: Caner Kaya, UI/UX, Zeynep'
            }
            className="w-full h-[54px] rounded-lg bg-[#FBF7F0] border border-[#D4C8B2] px-4 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:ring-1 focus:ring-[#A34A26] focus:border-[#A34A26] transition-colors"
          />
        </div>

        {/* Kategori Chipleri (Yalnızca Yetenekler Sekmesinde) */}
        {explorerTab === 'skills' && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2E4A3B] text-[#F5EFE4]'
                      : 'bg-transparent border border-[#D4C8B2] text-[#2B2622] hover:border-[#2E4A3B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TAB 1: Yetenekler Grid */}
      {explorerTab === 'skills' && (
        <>
          {isLoadingSkills ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
              <span className="text-sm font-medium">Yetenek havuzu taranıyor...</span>
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <SkillEditorialCard
                  key={skill.id}
                  skill={skill}
                  onSuggestSwap={handleSuggestSwap}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-xl border border-[#E2D6C1] bg-[#FBF7F0] p-8 space-y-3">
              <h3 className="font-serif text-xl font-semibold text-[#2B2622]">
                Eşleşen yetenek bulunamadı
              </h3>
              <p className="text-xs text-[#5E564D] max-w-sm mx-auto">
                Farklı bir arama terimi deneyebilir veya kategori filtresini sıfırlayabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tümü');
                }}
                className="text-xs font-semibold text-[#A34A26] underline hover:text-[#8E3F20] cursor-pointer"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Mentorlar Grid */}
      {explorerTab === 'mentors' && (
        <>
          {isLoadingUsers ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
              <span className="text-sm font-medium">Mentorlar getiriliyor...</span>
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorEditorialCard
                  key={mentor.id}
                  mentor={mentor}
                  onSuggestSwap={handleOpenMentorSwap}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-xl border border-[#E2D6C1] bg-[#FBF7F0] p-8 space-y-3">
              <h3 className="font-serif text-xl font-semibold text-[#2B2622]">
                Eşleşen mentor bulunamadı
              </h3>
              <p className="text-xs text-[#5E564D] max-w-sm mx-auto">
                Arama teriminizi değiştirebilir ya da tüm mentorları görüntülemek için aramayı temizleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-semibold text-[#A34A26] underline hover:text-[#8E3F20] cursor-pointer"
              >
                Aramayı Temizle
              </button>
            </div>
          )}
        </>
      )}

      {/* 1. Aşama Modal: Yeteneği Öğreten Mentor Seçimi (ve profil linkleri) */}
      <SkillSwapModal
        skill={selectedSkillForSwap}
        isOpen={!!selectedSkillForSwap}
        onClose={() => setSelectedSkillForSwap(null)}
        onSelectMentor={(mentor) => setSelectedMentorForProposal(mentor)}
      />

      {/* 2. Aşama Modal: Seçilen Mentora Takas Teklifi İletme */}
      <SwapRequestModal
        targetUser={selectedMentorForProposal}
        isOpen={!!selectedMentorForProposal}
        onClose={() => setSelectedMentorForProposal(null)}
      />
    </div>
  );
};

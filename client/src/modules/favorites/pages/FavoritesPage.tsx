import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../services/favoritesStore';
import { SkillEditorialCard } from '@/modules/skills/components/SkillEditorialCard';
import { MentorEditorialCard } from '@/modules/users/components/MentorEditorialCard';
import { SwapRequestModal } from '@/modules/users/components/SwapRequestModal';
import { useAuthStore } from '@/modules/auth/services/authStore';
import type { Skill, User } from '@/types/api';
import {
  Heart,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';
import { toast } from 'sonner';

export const FavoritesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'mentors'>('skills');
  const [targetMentor, setTargetMentor] = useState<User | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const {
    savedSkills,
    savedMentors,
  } = useFavoritesStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSuggestSwap = (skill: Skill) => {
    navigate(`/explore?search=${encodeURIComponent(skill.name)}`);
  };

  const handleOpenMentorSwap = (mentor: User) => {
    if (!isAuthenticated) {
      toast.info('Takas teklifinde bulunmak için lütfen giriş yapın.');
      navigate('/login');
      return;
    }
    setTargetMentor(mentor);
    setIsSwapModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div>
        <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
          Kaydedilenler
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2622] tracking-tight mt-1">
          Favori Yetenek & <span className="italic text-[#A34A26]">Mentorların</span>
        </h1>
        <p className="text-sm text-[#5E564D] mt-1.5 font-normal max-w-2xl leading-relaxed">
          Beğendiğin ve daha sonra incelemek veya takas teklifinde bulunmak üzere kaydettiğin yetenekler ve mentorlar.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2D6C1] gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#2E4A3B]" />
          <span>Favori Yetenekler ({savedSkills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mentors')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'mentors'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <Users className="w-4 h-4 text-[#A34A26]" />
          <span>Favori Mentorlar ({savedMentors.length})</span>
        </button>
      </div>

      {/* TAB 1: Kaydedilen Yetenekler */}
      {activeTab === 'skills' && (
        <div>
          {savedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSkills.map((skill) => (
                <div key={skill.id} className="relative">
                  <SkillEditorialCard
                    skill={skill}
                    onSuggestSwap={handleSuggestSwap}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-xl border border-dashed border-[#E2D6C1] bg-[#FBF7F0] space-y-3">
              <Heart className="w-8 h-8 text-[#5E564D]/50 mx-auto" />
              <h3 className="font-serif text-lg text-[#2B2622]">Henüz favori yeteneğin yok</h3>
              <p className="text-xs text-[#5E564D] max-w-md mx-auto">
                Yetenek havuzunda gezinirken kartların üzerindeki kalp ikonuna tıklayarak beğendiğin yetenekleri buraya kaydedebilirsin.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center h-10 px-5 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors mt-2"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                <span>Yetenekleri Keşfet</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Kaydedilen Mentorlar */}
      {activeTab === 'mentors' && (
        <div>
          {savedMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMentors.map((mentor) => (
                <MentorEditorialCard
                  key={mentor.id}
                  mentor={mentor}
                  onSuggestSwap={handleOpenMentorSwap}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-xl border border-dashed border-[#E2D6C1] bg-[#FBF7F0] space-y-3">
              <Heart className="w-8 h-8 text-[#5E564D]/50 mx-auto" />
              <h3 className="font-serif text-lg text-[#2B2622]">Henüz favori mentorun yok</h3>
              <p className="text-xs text-[#5E564D] max-w-md mx-auto">
                Mentor profillerinde veya keşif sayfasında kalp butonuna tıklayarak mentorları favori listenize ekleyebilirsiniz.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center h-10 px-5 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors mt-2"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                <span>Mentorları Keşfet</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Takas Teklifi Modalı */}
      {targetMentor && (
        <SwapRequestModal
          targetUser={targetMentor}
          isOpen={isSwapModalOpen}
          onClose={() => {
            setIsSwapModalOpen(false);
            setTargetMentor(null);
          }}
        />
      )}
    </div>
  );
};

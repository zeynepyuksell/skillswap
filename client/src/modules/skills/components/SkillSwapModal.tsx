import React from 'react';
import { Link } from 'react-router-dom';
import type { Skill, User } from '@/types/api';
import { useUsers } from '@/modules/users/hooks/useUsers';
import { useFavoritesStore } from '@/modules/favorites/services/favoritesStore';
import { useAuthStore } from '@/modules/auth/services/authStore';
import { X, ArrowRight, Star, PlusCircle, Heart, UserCheck } from 'lucide-react';

interface SkillSwapModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectMentor: (mentor: User) => void;
}

export const SkillSwapModal: React.FC<SkillSwapModalProps> = ({
  skill,
  isOpen,
  onClose,
  onSelectMentor,
}) => {
  const { user: currentUser } = useAuthStore();
  const { data: usersData } = useUsers(1, 50);
  const { isMentorFavorite, toggleMentorFavorite } = useFavoritesStore();

  if (!isOpen || !skill) return null;

  // Find users who offer this skill EXCLUDING the current logged-in user
  const mentorsWithSkill = (usersData?.users || []).filter(
    (u) =>
      u.id !== currentUser?.id &&
      u.skills?.some((s) => s.skillId === skill.id && s.type === 'OFFERING')
  );

  // Check if current user is the one offering this skill
  const isCurrentUserOffering = (usersData?.users || []).some(
    (u) =>
      u.id === currentUser?.id &&
      u.skills?.some((s) => s.skillId === skill.id && s.type === 'OFFERING')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#243F31]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FBF7F0] rounded-xl p-6 sm:p-8 border border-[#E2D6C1] shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#5E564D] hover:text-[#2B2622] hover:bg-[#E2D6C1]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#A34A26] block mb-1">
            {skill.category}
          </span>
          <h3 className="font-serif text-2xl font-semibold text-[#2B2622]">
            {skill.name} için Mentor Seç
          </h3>
          <p className="text-xs text-[#5E564D] mt-1.5 font-normal">
            Bu yeteneği öğreten diğer mentorlardan birini seçerek hemen takas teklifinde bulunabilirsiniz.
          </p>
        </div>

        {/* Mentorlar Listesi */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {mentorsWithSkill.length > 0 ? (
            mentorsWithSkill.map((mentor) => {
              const isSaved = isMentorFavorite(mentor.id);

              return (
                <div
                  key={mentor.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1] hover:border-[#2E4A3B] transition-colors"
                >
                  <Link
                    to={`/users/${mentor.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 group/link"
                    title="Mentörün profiline git"
                  >
                    {mentor.avatarUrl ? (
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.fullName}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-[#D4C8B2]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] font-serif text-base flex items-center justify-center">
                        {mentor.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-[#2B2622] group-hover/link:text-[#A34A26] transition-colors flex items-center gap-1">
                        <span>{mentor.fullName}</span>
                        <span className="text-[10px] text-[#5E564D] font-normal underline">
                          (Profili Gör)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#243F31] font-medium bg-[#F1DFA6] px-1.5 py-0.2 rounded w-fit mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#243F31] text-[#243F31]" />
                        <span>{mentor.rating > 0 ? mentor.rating.toFixed(1) : 'Yeni'}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Kalp Favori Butonu */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMentorFavorite(mentor);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#EBC9B5] text-[#A34A26]'
                          : 'bg-[#FBF7F0] text-[#5E564D] hover:text-[#A34A26] border border-[#E2D6C1]'
                      }`}
                      title={isSaved ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#A34A26]' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectMentor(mentor);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] text-xs font-semibold hover:bg-[#1F3A2D] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Teklif Et</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : isCurrentUserOffering ? (
            <div className="text-center py-8 px-4 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#CFDCC8] text-[#243F31] flex items-center justify-center mx-auto">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#2B2622]">
                Bu yeteneği şu anda siz öğretiyorsunuz
              </h4>
              <p className="text-xs text-[#5E564D] max-w-sm mx-auto">
                Kendinize takas teklifinde bulunamazsınız. Başka bir mentor bu yeteneği sunduğunda burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 px-4 rounded-lg bg-[#F5EFE4] border border-dashed border-[#E2D6C1] space-y-3">
              <p className="text-xs text-[#5E564D]">
                Henüz bu yeteneği öğreten kayıtlı bir mentor bulunmuyor.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] text-xs font-semibold hover:bg-[#1F3A2D] transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>İlk Öğreten Sen Ol</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

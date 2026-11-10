import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@/types/api';
import { useFavoritesStore } from '@/modules/favorites/services/favoritesStore';
import { useAuthStore } from '@/modules/auth/services/authStore';
import { Star, Heart, ArrowRight, User as UserIcon } from 'lucide-react';

interface MentorEditorialCardProps {
  mentor: User;
  onSuggestSwap?: (mentor: User) => void;
}

export const MentorEditorialCard: React.FC<MentorEditorialCardProps> = ({
  mentor,
  onSuggestSwap,
}) => {
  const { user: currentUser } = useAuthStore();
  const { isMentorFavorite, toggleMentorFavorite } = useFavoritesStore();

  const isMe = currentUser?.id === mentor.id;
  const isSaved = isMentorFavorite(mentor.id);

  const offeringSkills = mentor.skills?.filter((s) => s.type === 'OFFERING') || [];
  const seekingSkills = mentor.skills?.filter((s) => s.type === 'SEEKING') || [];

  return (
    <div className="rounded-xl border border-[#E2D6C1] bg-[#FBF7F0] p-6 flex flex-col justify-between transition-all duration-150 hover:border-[#D4C8B2] hover:shadow-[0_4px_16px_rgba(43,38,34,0.04)] relative group">
      <div>
        {/* Top Header: Avatar, Name, Rating and Heart Button */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <Link
            to={isMe ? '/profile' : `/users/${mentor.id}`}
            className="flex items-center gap-3.5 group/mentor"
          >
            {mentor.avatarUrl ? (
              <img
                src={mentor.avatarUrl}
                alt={mentor.fullName}
                className="w-13 h-13 rounded-lg object-cover ring-1 ring-[#D4C8B2] transition-transform group-hover/mentor:scale-105"
              />
            ) : (
              <div className="w-13 h-13 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] font-serif text-xl flex items-center justify-center transition-transform group-hover/mentor:scale-105">
                {mentor.fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-[#2B2622] group-hover/mentor:text-[#A34A26] transition-colors leading-snug">
                  {mentor.fullName}
                </h3>
                {isMe && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em] px-2 py-0.5 rounded bg-[#CFDCC8] text-[#243F31]">
                    Sen
                  </span>
                )}
              </div>
              <div className="flex items-center text-[#243F31] font-medium text-[11px] bg-[#F1DFA6] px-2 py-0.5 rounded-md mt-1 w-fit">
                <Star className="w-3 h-3 fill-[#243F31] text-[#243F31] mr-1" />
                <span>{mentor.rating > 0 ? mentor.rating.toFixed(1) : 'Yeni'} Puan</span>
              </div>
            </div>
          </Link>

          {/* Favori Kalp Butonu (Kendi profili değilse) */}
          {!isMe && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMentorFavorite(mentor);
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#EBC9B5] text-[#A34A26]'
                  : 'bg-[#F5EFE4] text-[#5E564D] hover:text-[#A34A26] hover:bg-[#EBC9B5]/40'
              }`}
              title={isSaved ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              aria-label={isSaved ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#A34A26] text-[#A34A26]' : ''}`} />
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-[#5E564D] line-clamp-2 leading-relaxed mb-4 font-normal">
          {mentor.bio || 'Bu mentor henüz bir biyografi eklemedi.'}
        </p>

        {/* Skills Preview */}
        <div className="space-y-2 mb-4">
          {offeringSkills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] block mb-1">
                Öğretebilir:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {offeringSkills.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#CFDCC8] text-[#243F31]"
                  >
                    {item.skill.name}
                  </span>
                ))}
                {offeringSkills.length > 3 && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 text-[#5E564D]">
                    +{offeringSkills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {seekingSkills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] block mb-1">
                Öğrenmek İstiyor:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {seekingSkills.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EBC9B5] text-[#8E3F20]"
                  >
                    {item.skill.name}
                  </span>
                ))}
                {seekingSkills.length > 3 && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 text-[#5E564D]">
                    +{seekingSkills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Profili İncele & Aksiyon */}
      <div className="border-t border-[#E2D6C1] pt-3.5 flex items-center justify-between gap-2">
        <Link
          to={isMe ? '/profile' : `/users/${mentor.id}`}
          className="text-xs font-semibold text-[#2E4A3B] hover:text-[#A34A26] transition-colors"
        >
          {isMe ? 'Profilim →' : 'Profili İncele →'}
        </Link>

        {isMe ? (
          <Link
            to="/profile"
            className="px-3.5 py-1.5 rounded-lg border border-[#2E4A3B] text-[#2E4A3B] text-xs font-semibold hover:bg-[#2E4A3B] hover:text-[#F5EFE4] transition-colors flex items-center gap-1"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profilimi Düzenle</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onSuggestSwap?.(mentor)}
            className="px-3.5 py-1.5 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] text-xs font-semibold hover:bg-[#1F3A2D] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Takas Teklif Et</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

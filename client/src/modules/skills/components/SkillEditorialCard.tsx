import React from 'react';
import type { Skill } from '@/types/api';
import { useFavoritesStore } from '@/modules/favorites/services/favoritesStore';
import { Heart } from 'lucide-react';

interface SkillEditorialCardProps {
  skill: Skill;
  onSuggestSwap?: (skill: Skill) => void;
}

export const SkillEditorialCard: React.FC<SkillEditorialCardProps> = ({ skill, onSuggestSwap }) => {
  const { isSkillFavorite, toggleSkillFavorite } = useFavoritesStore();
  const isFavorite = isSkillFavorite(skill.id);

  // Kategoriye göre 116px üst şerit rengi
  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('yazılım') || cat.includes('teknoloji')) {
      return 'bg-[#CFDCC8]'; // sage
    }
    if (cat.includes('tasarım')) {
      return 'bg-[#F1DFA6]'; // butter
    }
    if (cat.includes('müzik') || cat.includes('sanat')) {
      return 'bg-[#EBC9B5]'; // blush
    }
    if (cat.includes('dil')) {
      return 'bg-[#E8DCC8]'; // sand
    }
    if (cat.includes('iş') || cat.includes('kariyer')) {
      return 'bg-[#F1DFA6]'; // butter
    }
    return 'bg-[#CFDCC8]';
  };

  const initialLetter = skill.name
    ? skill.name.charAt(0).toLocaleUpperCase('tr-TR')
    : 'S';

  const teacherCount = skill.users?.length || 0;

  return (
    <div className="rounded-xl border border-[#E2D6C1] bg-[#FBF7F0] overflow-hidden flex flex-col justify-between transition-all duration-150 hover:border-[#D4C8B2] hover:shadow-[0_4px_16px_rgba(43,38,34,0.04)] relative group">
      {/* 116px Kategori Şeridi ve Fraunces 84px Baş Harf */}
      <div
        className={`h-[116px] w-full ${getCategoryColor(
          skill.category
        )} flex items-center justify-between px-6 relative overflow-hidden`}
      >
        <span className="font-serif text-[84px] leading-none font-semibold text-[#2B2622]/40 select-none">
          {initialLetter}
        </span>

        {/* Kalp / Favori Butonu */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSkillFavorite(skill);
          }}
          className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-[#EBC9B5] text-[#A34A26] shadow-xs'
              : 'bg-[#FBF7F0]/80 text-[#5E564D] hover:bg-[#FBF7F0] hover:text-[#A34A26]'
          }`}
          title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          aria-label={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#A34A26] text-[#A34A26]' : ''}`} />
        </button>
      </div>

      {/* Alt İçerik Alanı */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Büyük Harfli Küçük Kategori Etiketi */}
          <span className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] mb-1.5 block">
            {skill.category.replace('&', 've')}
          </span>

          {/* Fraunces 24px Başlık */}
          <h3 className="font-serif text-[24px] font-semibold text-[#2B2622] mb-2 leading-tight">
            {skill.name}
          </h3>

          {/* Açıklama Metni */}
          <p className="text-xs text-[#5E564D] line-clamp-2 leading-relaxed mb-6 font-normal">
            {skill.description || 'Bu yetenek için açıklama henüz eklenmemiş.'}
          </p>
        </div>

        {/* İnce Çizgi ve Alt Bar */}
        <div className="border-t border-[#E2D6C1] pt-4 flex items-center justify-between">
          <span className="text-xs text-[#5E564D] font-normal">
            {teacherCount === 0 ? 'İlk öğreten sen ol' : `${teacherCount} kişi öğretiyor`}
          </span>

          <button
            type="button"
            onClick={() => onSuggestSwap?.(skill)}
            className="px-4 py-2 rounded-lg border border-[#2E4A3B] text-[#2E4A3B] text-xs font-semibold hover:bg-[#2E4A3B] hover:text-[#F5EFE4] transition-colors cursor-pointer"
          >
            Takas öner
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';
import { useAuthStore } from '@/modules/auth/services/authStore';
import { useFavoritesStore } from '@/modules/favorites/services/favoritesStore';
import { SwapRequestModal } from '../components/SwapRequestModal';
import {
  Star,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Loader2,
  Award,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const { isMentorFavorite, toggleMentorFavorite } = useFavoritesStore();

  const { data: user, isLoading, isError } = useUser(id || '');
  const isMentorSaved = user ? isMentorFavorite(user.id) : false;

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
        <span className="text-sm font-medium">Mentor profili yükleniyor...</span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#2B2622]">Mentor <span className="italic text-[#A34A26]">bulunamadı</span></h2>
        <p className="text-xs text-[#5E564D]">Aradığınız mentor profili silinmiş veya mevcut değil.</p>
        <Link
          to="/"
          className="inline-flex items-center h-10 px-4 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Keşfet'e Dön</span>
        </Link>
      </div>
    );
  }

  const offeringSkills = user.skills?.filter((s) => s.type === 'OFFERING') || [];
  const seekingSkills = user.skills?.filter((s) => s.type === 'SEEKING') || [];
  const isMe = currentUser?.id === user.id;

  const handleOpenSwap = () => {
    if (!isAuthenticated) {
      toast.info('Takas teklifinde bulunmak için lütfen giriş yapın.');
      navigate('/login');
      return;
    }
    setIsSwapModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E564D] hover:text-[#2B2622] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Yetenek Keşfine Dön</span>
      </Link>

      {/* Profil Başlık Kartı */}
      <div className="rounded-xl p-8 sm:p-10 border border-[#E2D6C1] shadow-xs bg-[#FBF7F0]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-lg object-cover ring-1 ring-[#D4C8B2] shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] font-serif text-3xl flex items-center justify-center shadow-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#2B2622] tracking-tight">
                  {user.fullName}
                </h1>
                <div className="flex items-center text-[#243F31] font-medium text-xs bg-[#F1DFA6] px-2.5 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-[#243F31] text-[#243F31] mr-1" />
                  <span>{user.rating > 0 ? user.rating.toFixed(1) : 'Yeni'} Puan</span>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-[#5E564D] max-w-xl font-normal leading-relaxed">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-[#5E564D] font-normal pt-1">
                {user.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5E564D]" />
                    Üyelik: {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </span>
                )}
                {user.totalReviews && user.totalReviews > 0 ? (
                  <span className="flex items-center gap-1 text-[#2B2622] font-medium">
                    <Award className="w-3.5 h-3.5 text-[#A34A26]" />
                    {user.totalReviews} Başarılı Takas
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action button */}
          {!isMe ? (
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => toggleMentorFavorite(user)}
                className={`h-12 px-4 rounded-lg font-medium text-xs border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isMentorSaved
                    ? 'border-[#A34A26] bg-[#A34A26] text-[#F5EFE4]'
                    : 'border-[#D4C8B2] bg-[#FBF7F0] text-[#5E564D] hover:text-[#A34A26] hover:bg-[#EBC9B5]/40'
                }`}
                title={isMentorSaved ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-4 h-4 ${isMentorSaved ? 'fill-[#F5EFE4]' : ''}`} />
                <span>{isMentorSaved ? 'Favorilerde' : 'Favorilere Ekle'}</span>
              </button>

              <button
                onClick={handleOpenSwap}
                className="flex-1 md:flex-none h-12 px-6 rounded-lg font-medium text-sm text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Takas Teklifi Gönder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/profile"
              className="w-full md:w-auto h-11 px-5 rounded-lg font-medium text-xs text-[#2B2622] bg-[#F5EFE4] hover:bg-[#E8DCC8] border border-[#E2D6C1] transition-colors inline-flex items-center justify-center"
            >
              Profilimi Düzenle
            </Link>
          )}
        </div>
      </div>

      {/* Yetenekler Bölümü (Öğrettikleri vs Öğrenmek İstedikleri) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Öğretebileceği Yetenekler */}
        <div className="rounded-xl p-6 sm:p-8 bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs space-y-4">
          <div className="border-b border-[#E2D6C1] pb-3">
            <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
              ÖĞRETTİKLERİ
            </span>
            <div className="flex items-center justify-between mt-1">
              <h2 className="font-serif text-lg text-[#2B2622] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E4A3B]" />
                <span>Öğretebileceği Yetenekler</span>
              </h2>
              <span className="text-xs bg-[#CFDCC8] text-[#243F31] font-medium px-2 py-0.5 rounded-md">
                {offeringSkills.length}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {offeringSkills.length > 0 ? (
              offeringSkills.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#2B2622]">{item.skill.name}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#CFDCC8] text-[#243F31]">
                      {item.proficiencyLevel === 'EXPERT'
                        ? 'Uzman'
                        : item.proficiencyLevel === 'ADVANCED'
                        ? 'İleri Seviye'
                        : item.proficiencyLevel === 'INTERMEDIATE'
                        ? 'Orta Seviye'
                        : 'Başlangıç'}
                    </span>
                  </div>
                  <div className="text-xs text-[#5E564D] font-normal">
                    Kategori: {item.skill.category}
                    {item.yearsExperience ? ` • ${item.yearsExperience} yıl deneyim` : ''}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#5E564D] pt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#5E564D] italic py-4 text-center">
                Henüz öğretilecek bir yetenek eklenmemiş.
              </p>
            )}
          </div>
        </div>

        {/* Öğrenmek İstediği Yetenekler */}
        <div className="rounded-xl p-6 sm:p-8 bg-[#FBF7F0] border border-[#E2D6C1] shadow-xs space-y-4">
          <div className="border-b border-[#E2D6C1] pb-3">
            <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
              ÖĞRENMEK İSTEDİKLERİ
            </span>
            <div className="flex items-center justify-between mt-1">
              <h2 className="font-serif text-lg text-[#2B2622] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#A34A26]" />
                <span>Öğrenmek İstediği Yetenekler</span>
              </h2>
              <span className="text-xs bg-[#EBC9B5] text-[#8E3F20] font-medium px-2 py-0.5 rounded-md">
                {seekingSkills.length}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {seekingSkills.length > 0 ? (
              seekingSkills.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#2B2622]">{item.skill.name}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EBC9B5] text-[#8E3F20]">
                      {item.skill.category}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#5E564D] pt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#5E564D] italic py-4 text-center">
                Henüz öğrenilmek istenen bir yetenek belirtilmemiş.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Takas Teklifi Modal */}
      <SwapRequestModal
        targetUser={user}
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
      />
    </div>
  );
};

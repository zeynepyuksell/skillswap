import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useUsers';
import { useMySwaps, useUpdateSwapStatus } from '@/modules/swaps/hooks/useSwaps';
import {
  Star,
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  GraduationCap,
  Compass,
  Settings,
  Check,
  X,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: swaps, isLoading: isLoadingSwaps } = useMySwaps();
  const updateSwapMutation = useUpdateSwapStatus();

  if (isLoadingUser) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
        <span className="text-sm font-medium">Panel yükleniyor...</span>
      </div>
    );
  }

  const offeringSkills = user?.skills?.filter((s) => s.type === 'OFFERING') || [];
  const seekingSkills = user?.skills?.filter((s) => s.type === 'SEEKING') || [];
  const activeSwaps = swaps?.filter((s) => s.status === 'ACCEPTED' || s.status === 'PENDING') || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Welcome Header */}
      <div className="relative overflow-hidden rounded-xl bg-[#243F31] p-8 sm:p-10 text-[#F5EFE4] shadow-sm border border-[#1F3A2D]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-18 h-18 rounded-lg object-cover ring-2 ring-[#E2D6C1]/30 shadow-xs"
              />
            ) : (
              <div className="w-18 h-18 rounded-lg bg-[#2E4A3B] border border-[#E2D6C1]/30 text-[#F5EFE4] font-serif text-2xl flex items-center justify-center shadow-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#F5EFE4]">
                  Hoş geldin, <span className="italic text-[#EBC9B5]">{user?.fullName}</span>
                </h1>
                <span className="inline-flex items-center gap-1 bg-[#F1DFA6] text-[#243F31] text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-[#243F31] text-[#243F31]" />
                  {user?.rating ? user.rating.toFixed(1) : 'Yeni'} Puan
                </span>
              </div>
              <p className="text-[#CFDCC8] text-xs sm:text-sm mt-1.5 max-w-xl font-normal leading-relaxed">
                {user?.bio || 'SkillSwap topluluğuna hoş geldiniz! Yeteneklerinizi keşfetmeye ve takas etmeye hazırsınız.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <Link
              to="/explore"
              className="flex-1 md:flex-none h-11 px-4 rounded-lg font-medium text-xs bg-[#F5EFE4] text-[#243F31] hover:bg-[#FBF7F0] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#2E4A3B]" />
              <span>Yetenek Keşfet</span>
            </Link>
            <Link
              to="/profile"
              className="flex-1 md:flex-none h-11 px-4 rounded-lg font-medium text-xs bg-[#2E4A3B] text-[#F5EFE4] hover:bg-[#1F3A2D] border border-[#CFDCC8]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#CFDCC8]" />
              <span>Profilim</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#2E4A3B]/40 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#FBF7F0] border border-[#E2D6C1] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#CFDCC8] text-[#243F31] flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-2xl text-[#2B2622]">{activeSwaps.length}</div>
            <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
              Aktif Takas Talepleri
            </div>
          </div>
        </div>

        <div className="bg-[#FBF7F0] border border-[#E2D6C1] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#F1DFA6] text-[#243F31] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-2xl text-[#2B2622]">{offeringSkills.length}</div>
            <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
              Öğrettiğin Yetenekler
            </div>
          </div>
        </div>

        <div className="bg-[#FBF7F0] border border-[#E2D6C1] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#EBC9B5] text-[#8E3F20] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-2xl text-[#2B2622]">{seekingSkills.length}</div>
            <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
              Öğrenmek İstediklerin
            </div>
          </div>
        </div>
      </div>

      {/* Takas Talepleri Listesi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2D6C1] pb-3">
          <div>
            <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
              Talepler
            </span>
            <h2 className="font-serif text-xl text-[#2B2622]">
              Takas ve <span className="italic text-[#A34A26]">mentorluk</span> süreçlerin
            </h2>
          </div>
          <span className="text-xs text-[#5E564D] font-medium">{swaps?.length || 0} toplam talep</span>
        </div>

        {isLoadingSwaps ? (
          <div className="py-12 flex justify-center text-[#5E564D]">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E4A3B]" />
          </div>
        ) : swaps && swaps.length > 0 ? (
          <div className="space-y-3">
            {swaps.map((swap) => {
              const isRequester = swap.requesterId === user?.id;
              const otherUser = isRequester ? swap.receiver : swap.requester;

              return (
                <div
                  key={swap.id}
                  className="bg-[#FBF7F0] border border-[#E2D6C1] rounded-xl p-5 sm:p-6 transition-colors hover:border-[#D4C8B2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-[#2B2622]">
                        {isRequester ? (
                          <>
                            <span className="text-[#5E564D] font-normal">Alıcı:</span>{' '}
                            {otherUser.fullName}
                          </>
                        ) : (
                          <>
                            <span className="text-[#5E564D] font-normal">Gönderen:</span>{' '}
                            {otherUser.fullName}
                          </>
                        )}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          swap.status === 'ACCEPTED'
                            ? 'bg-[#CFDCC8] text-[#243F31]'
                            : swap.status === 'PENDING'
                            ? 'bg-[#F1DFA6] text-[#634812]'
                            : swap.status === 'COMPLETED'
                            ? 'bg-[#E8DCC8] text-[#2B2622]'
                            : 'bg-[#EBC9B5] text-[#8E3F20]'
                        }`}
                      >
                        {swap.status === 'ACCEPTED'
                          ? 'Kabul Edildi'
                          : swap.status === 'PENDING'
                          ? 'Beklemede'
                          : swap.status === 'COMPLETED'
                          ? 'Tamamlandı'
                          : 'İptal / Reddedildi'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-[#2B2622]">
                      <span className="px-2.5 py-1 rounded-md bg-[#CFDCC8]/60 text-[#243F31] border border-[#CFDCC8]">
                        {swap.offeredSkill.name}
                      </span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#5E564D]" />
                      <span className="px-2.5 py-1 rounded-md bg-[#F1DFA6]/60 text-[#634812] border border-[#F1DFA6]">
                        {swap.requestedSkill.name}
                      </span>
                    </div>

                    {swap.message && (
                      <p className="text-xs text-[#5E564D] italic font-normal">"{swap.message}"</p>
                    )}
                  </div>

                  {/* Actions for receiver if PENDING */}
                  {!isRequester && swap.status === 'PENDING' && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => updateSwapMutation.mutate({ id: swap.id, status: 'ACCEPTED' })}
                        disabled={updateSwapMutation.isPending}
                        className="h-9 px-3.5 rounded-lg text-xs font-medium bg-[#2E4A3B] text-[#F5EFE4] hover:bg-[#1F3A2D] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Kabul Et</span>
                      </button>
                      <button
                        onClick={() => updateSwapMutation.mutate({ id: swap.id, status: 'REJECTED' })}
                        disabled={updateSwapMutation.isPending}
                        className="h-9 px-3 rounded-lg text-xs font-medium bg-[#F5EFE4] text-[#A34A26] hover:bg-[#EBC9B5]/40 border border-[#E2D6C1] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reddet</span>
                      </button>
                    </div>
                  )}

                  {/* Complete Action for ACCEPTED */}
                  {swap.status === 'ACCEPTED' && (
                    <button
                      onClick={() => updateSwapMutation.mutate({ id: swap.id, status: 'COMPLETED' })}
                      disabled={updateSwapMutation.isPending}
                      className="h-9 px-3.5 rounded-lg text-xs font-medium bg-[#2E4A3B] text-[#F5EFE4] hover:bg-[#1F3A2D] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tamamlandı Olarak İşaretle</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center rounded-xl border border-dashed border-[#E2D6C1] bg-[#FBF7F0] space-y-2.5">
            <Clock className="w-8 h-8 text-[#5E564D]/50 mx-auto" />
            <p className="font-serif text-base text-[#2B2622]">Henüz bir takas talebiniz bulunmuyor</p>
            <p className="text-xs text-[#5E564D]">
              Yetenek Keşfi sayfasına giderek ilgilendiğiniz mentorlara ilk teklifinizi iletebilirsiniz.
            </p>
            <Link
              to="/explore"
              className="inline-flex mt-2 h-10 items-center px-4 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors"
            >
              <span>Mentorları Keşfet</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

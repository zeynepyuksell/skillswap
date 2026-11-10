import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '@/modules/users/hooks/useUsers';
import { useMySwaps, useUpdateSwapStatus } from '../hooks/useSwaps';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
  CheckCircle2,
  Clock,
  Loader2,
  Star,
  Compass,
  MessageSquare,
  Ban,
} from 'lucide-react';

type DirectionFilter = 'ALL' | 'RECEIVED' | 'SENT';
type StatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED_OR_CANCELLED';

export const SwapsHubPage: React.FC = () => {
  const [direction, setDirection] = useState<DirectionFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: swaps, isLoading: isLoadingSwaps } = useMySwaps();
  const updateSwapMutation = useUpdateSwapStatus();

  if (isLoadingUser || isLoadingSwaps) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#5E564D]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E4A3B]" />
        <span className="text-sm font-medium">Takas merkezi yükleniyor...</span>
      </div>
    );
  }

  const allSwaps = swaps || [];
  const currentUserId = currentUser?.id;

  // Counts
  const receivedSwaps = allSwaps.filter((s) => s.receiverId === currentUserId);
  const sentSwaps = allSwaps.filter((s) => s.requesterId === currentUserId);
  const pendingCount = allSwaps.filter((s) => s.status === 'PENDING').length;
  const acceptedCount = allSwaps.filter((s) => s.status === 'ACCEPTED').length;
  const completedCount = allSwaps.filter((s) => s.status === 'COMPLETED').length;

  // Filtering logic
  const filteredSwaps = allSwaps.filter((swap) => {
    // 1. Direction filter
    if (direction === 'RECEIVED' && swap.receiverId !== currentUserId) return false;
    if (direction === 'SENT' && swap.requesterId !== currentUserId) return false;

    // 2. Status filter
    if (statusFilter === 'PENDING' && swap.status !== 'PENDING') return false;
    if (statusFilter === 'ACCEPTED' && swap.status !== 'ACCEPTED') return false;
    if (statusFilter === 'COMPLETED' && swap.status !== 'COMPLETED') return false;
    if (
      statusFilter === 'REJECTED_OR_CANCELLED' &&
      swap.status !== 'REJECTED' &&
      swap.status !== 'CANCELLED'
    )
      return false;

    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div>
        <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
          Takas & İstek Merkezi
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2622] tracking-tight mt-1">
          Takaslarım & <span className="italic text-[#A34A26]">İsteklerim</span>
        </h1>
        <p className="text-sm text-[#5E564D] mt-1.5 font-normal max-w-2xl leading-relaxed">
          Gelen ve gönderdiğin tüm takas tekliflerini yönetebilir, onaylayabilir veya sürecini takip edebilirsin.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1]">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
            GELEN TEKLİF
          </div>
          <div className="font-serif text-2xl text-[#2B2622] mt-1">{receivedSwaps.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1]">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
            GÖNDERİLEN
          </div>
          <div className="font-serif text-2xl text-[#2B2622] mt-1">{sentSwaps.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1]">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
            BEKLEYENLER
          </div>
          <div className="font-serif text-2xl text-[#A34A26] mt-1">{pendingCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E2D6C1]">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#5E564D]">
            AKTİF & TAMAMLANAN
          </div>
          <div className="font-serif text-2xl text-[#2E4A3B] mt-1">
            {acceptedCount + completedCount}
          </div>
        </div>
      </div>

      {/* Direction Tabs (Tümü / Gelen / Gönderilen) */}
      <div className="flex border-b border-[#E2D6C1] gap-8">
        <button
          type="button"
          onClick={() => setDirection('ALL')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            direction === 'ALL'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 text-[#2E4A3B]" />
          <span>Tüm Talepler ({allSwaps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setDirection('RECEIVED')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            direction === 'RECEIVED'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-[#A34A26]" />
          <span>Bana Gelenler ({receivedSwaps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setDirection('SENT')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            direction === 'SENT'
              ? 'border-[#A34A26] text-[#2B2622]'
              : 'border-transparent text-[#5E564D] hover:text-[#2B2622]'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-[#2E4A3B]" />
          <span>Gönderdiklerim ({sentSwaps.length})</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#5E564D] mr-2">Durum Filtresi:</span>

        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#2E4A3B] text-[#F5EFE4]'
              : 'bg-[#FBF7F0] text-[#5E564D] border border-[#E2D6C1] hover:text-[#2B2622]'
          }`}
        >
          Tümü ({allSwaps.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-[#F1DFA6] text-[#634812] font-semibold border border-[#E2D6C1]'
              : 'bg-[#FBF7F0] text-[#5E564D] border border-[#E2D6C1] hover:text-[#2B2622]'
          }`}
        >
          Beklemede ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('ACCEPTED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'ACCEPTED'
              ? 'bg-[#CFDCC8] text-[#243F31] font-semibold border border-[#E2D6C1]'
              : 'bg-[#FBF7F0] text-[#5E564D] border border-[#E2D6C1] hover:text-[#2B2622]'
          }`}
        >
          Kabul Edildi ({acceptedCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'COMPLETED'
              ? 'bg-[#E8DCC8] text-[#2B2622] font-semibold border border-[#D4C8B2]'
              : 'bg-[#FBF7F0] text-[#5E564D] border border-[#E2D6C1] hover:text-[#2B2622]'
          }`}
        >
          Tamamlandı ({completedCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('REJECTED_OR_CANCELLED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'REJECTED_OR_CANCELLED'
              ? 'bg-[#EBC9B5] text-[#8E3F20] font-semibold border border-[#E2D6C1]'
              : 'bg-[#FBF7F0] text-[#5E564D] border border-[#E2D6C1] hover:text-[#2B2622]'
          }`}
        >
          İptal / Reddedildi
        </button>
      </div>

      {/* Swaps List */}
      <div className="space-y-4">
        {filteredSwaps.length > 0 ? (
          filteredSwaps.map((swap) => {
            const isRequester = swap.requesterId === currentUserId;
            const otherUser = isRequester ? swap.receiver : swap.requester;

            return (
              <div
                key={swap.id}
                className="bg-[#FBF7F0] border border-[#E2D6C1] rounded-xl p-6 transition-all hover:border-[#D4C8B2] shadow-xs space-y-4"
              >
                {/* Header row: Direction & Status badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2D6C1] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    {isRequester ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.09em] px-2.5 py-0.5 rounded-md bg-[#243F31]/10 text-[#243F31]">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        GÖNDERDİĞİN TEKLİF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.09em] px-2.5 py-0.5 rounded-md bg-[#A34A26]/10 text-[#A34A26]">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        SANA GELEN TEKLİF
                      </span>
                    )}

                    <span className="text-xs text-[#5E564D]">
                      {new Date(swap.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
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
                      ? 'Kabul Edildi / Aktif'
                      : swap.status === 'PENDING'
                      ? 'Yanıt Bekleniyor'
                      : swap.status === 'COMPLETED'
                      ? 'Tamamlandı'
                      : swap.status === 'CANCELLED'
                      ? 'İptal Edildi'
                      : 'Reddedildi'}
                  </span>
                </div>

                {/* Partner Details & Skills Exchange Block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                  {/* Partner info */}
                  <div className="flex items-center gap-3.5">
                    {otherUser.avatarUrl ? (
                      <img
                        src={otherUser.avatarUrl}
                        alt={otherUser.fullName || 'User'}
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-[#D4C8B2]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] font-serif text-lg flex items-center justify-center">
                        {otherUser.fullName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.09em] font-medium text-[#5E564D]">
                        {isRequester ? 'Muhatap (Alıcı)' : 'Teklif Veren'}
                      </div>
                      <Link
                        to={`/users/${otherUser.id}`}
                        className="font-serif text-base text-[#2B2622] hover:text-[#A34A26] font-semibold transition-colors"
                      >
                        {otherUser.fullName}
                      </Link>
                      {otherUser.rating ? (
                        <div className="flex items-center text-[#243F31] font-medium text-[11px] bg-[#F1DFA6] px-1.5 py-0.2 rounded w-fit mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-[#243F31] text-[#243F31] mr-1" />
                          <span>{otherUser.rating.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Skill Exchange Pairing */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#F5EFE4] border border-[#E2D6C1]">
                    <div className="flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#5E564D] block mb-0.5">
                        {isRequester ? 'Senin Öğreteceğin' : 'Karşı Tarafın Öğreteceği'}
                      </span>
                      <span className="font-serif text-sm text-[#2B2622] font-semibold">
                        {swap.offeredSkill.name}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#FBF7F0] border border-[#E2D6C1] flex items-center justify-center shrink-0 text-[#A34A26]">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#5E564D] block mb-0.5">
                        {isRequester ? 'Senin Öğreneceğin' : 'Karşı Tarafın Öğreneceği'}
                      </span>
                      <span className="font-serif text-sm text-[#2B2622] font-semibold">
                        {swap.requestedSkill.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message (if any) */}
                {swap.message && (
                  <div className="flex items-start gap-2 text-xs text-[#5E564D] bg-[#F5EFE4]/60 p-3 rounded-lg border border-[#E2D6C1]/60">
                    <MessageSquare className="w-4 h-4 text-[#A34A26] shrink-0 mt-0.5" />
                    <p className="italic font-normal">"{swap.message}"</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {/* Receiver & PENDING -> Accept / Reject */}
                  {!isRequester && swap.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          updateSwapMutation.mutate({ id: swap.id, status: 'REJECTED' })
                        }
                        disabled={updateSwapMutation.isPending}
                        className="h-9 px-4 rounded-lg text-xs font-medium text-[#A34A26] bg-[#F5EFE4] hover:bg-[#EBC9B5]/40 border border-[#E2D6C1] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reddet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSwapMutation.mutate({ id: swap.id, status: 'ACCEPTED' })
                        }
                        disabled={updateSwapMutation.isPending}
                        className="h-9 px-4 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Kabul Et</span>
                      </button>
                    </>
                  )}

                  {/* Requester & PENDING -> Cancel request */}
                  {isRequester && swap.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() =>
                        updateSwapMutation.mutate({ id: swap.id, status: 'CANCELLED' })
                      }
                      disabled={updateSwapMutation.isPending}
                      className="h-9 px-4 rounded-lg text-xs font-medium text-[#5E564D] hover:text-[#A34A26] bg-[#F5EFE4] hover:bg-[#EBC9B5]/40 border border-[#E2D6C1] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Talebi İptal Et</span>
                    </button>
                  )}

                  {/* Any party & ACCEPTED -> Mark Completed */}
                  {swap.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      onClick={() =>
                        updateSwapMutation.mutate({ id: swap.id, status: 'COMPLETED' })
                      }
                      disabled={updateSwapMutation.isPending}
                      className="h-9 px-4 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Takası Tamamla</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center rounded-xl border border-dashed border-[#E2D6C1] bg-[#FBF7F0] space-y-3">
            <Clock className="w-8 h-8 text-[#5E564D]/50 mx-auto" />
            <h3 className="font-serif text-lg text-[#2B2622]">Bu kriterde takas talebi bulunamadı</h3>
            <p className="text-xs text-[#5E564D] max-w-md mx-auto">
              Filtrelerinizi değiştirebilir ya da yeni mentorlar keşfederek ilk takas teklifinizi iletebilirsiniz.
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
    </div>
  );
};

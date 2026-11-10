import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/types/api';
import { useCurrentUser } from '../hooks/useUsers';
import { useCreateSwap } from '@/modules/swaps/hooks/useSwaps';
import { X, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';

const swapSchema = z.object({
  offeredSkillId: z.string().min(1, 'Lütfen karşı tarafa öğretebileceğiniz yeteneği seçin'),
  requestedSkillId: z.string().min(1, 'Lütfen karşı taraftan öğrenmek istediğiniz yeteneği seçin'),
  message: z.string().min(5, 'Lütfen en az 5 karakterlik bir mesaj yazınız'),
});

type SwapFormData = z.infer<typeof swapSchema>;

interface SwapRequestModalProps {
  targetUser: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ targetUser, isOpen, onClose }) => {
  const { data: currentUser } = useCurrentUser();
  const createSwapMutation = useCreateSwap();

  const myOfferingSkills = currentUser?.skills?.filter((s) => s.type === 'OFFERING') || [];
  const targetOfferingSkills = targetUser?.skills?.filter((s) => s.type === 'OFFERING') || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      offeredSkillId: '',
      requestedSkillId: '',
      message: '',
    },
  });

  if (!isOpen || !targetUser) return null;

  const onSubmit = (data: SwapFormData) => {
    createSwapMutation.mutate(
      {
        receiverId: targetUser.id,
        offeredSkillId: data.offeredSkillId,
        requestedSkillId: data.requestedSkillId,
        message: data.message,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#243F31]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FBF7F0] rounded-xl p-6 sm:p-8 shadow-2xl border border-[#E2D6C1] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#5E564D] hover:text-[#2B2622] hover:bg-[#F5EFE4] transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-[#A34A26]">
            Yetenek Takası
          </span>
          <h3 className="font-serif text-2xl text-[#2B2622]">
            Takas teklifi <span className="italic text-[#A34A26]">başlat</span>
          </h3>
          <p className="text-xs text-[#5E564D]">
            <strong className="text-[#2B2622] font-semibold">{targetUser.fullName}</strong> ile yeteneklerinizi karşılıklı takas edin.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Karşı taraftan ne öğrenmek istersin? */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2B2622]">
              <BookOpen className="w-3.5 h-3.5 text-[#2E4A3B]" />
              <span>{targetUser.fullName} sana ne öğretsin?</span>
            </label>
            <select
              className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
              {...register('requestedSkillId')}
            >
              <option value="">Bir yetenek seçin...</option>
              {targetOfferingSkills.map((item) => (
                <option key={item.skill.id} value={item.skill.id}>
                  {item.skill.name} ({item.proficiencyLevel})
                </option>
              ))}
            </select>
            {errors.requestedSkillId && (
              <p className="text-xs font-medium text-[#A34A26] mt-1">{errors.requestedSkillId.message}</p>
            )}
          </div>

          {/* Sen ne öğretebilirsin? */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2B2622]">
              <Sparkles className="w-3.5 h-3.5 text-[#A34A26]" />
              <span>Sen karşılığında ne öğreteceksin?</span>
            </label>
            <select
              className="w-full h-12 rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] px-3.5 text-sm text-[#2B2622] focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
              {...register('offeredSkillId')}
            >
              <option value="">Öğretebileceğin yeteneği seç...</option>
              {myOfferingSkills.map((item) => (
                <option key={item.skill.id} value={item.skill.id}>
                  {item.skill.name} ({item.proficiencyLevel})
                </option>
              ))}
            </select>
            {errors.offeredSkillId && (
              <p className="text-xs font-medium text-[#A34A26] mt-1">{errors.offeredSkillId.message}</p>
            )}
            {myOfferingSkills.length === 0 && (
              <p className="text-xs text-[#A34A26] font-medium">
                Profilinizde henüz bir öğretici yetenek ekli değil. Önce profilinize yetenek eklemeniz gerekebilir.
              </p>
            )}
          </div>

          {/* Mesaj */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#2B2622]">Takas Mesajı</label>
            <textarea
              rows={3}
              placeholder="Örn: Merhaba, React öğrenmek istiyorum. Karşılığında size haftalık 2 saat İspanyolca konuşma pratiği yaptırabilirim."
              className="w-full rounded-lg border border-[#D4C8B2] bg-[#FBF7F0] p-3 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:border-[#A34A26] focus:ring-1 focus:ring-[#A34A26]"
              {...register('message')}
            />
            {errors.message && (
              <p className="text-xs font-medium text-[#A34A26] mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-lg text-xs font-medium text-[#5E564D] hover:text-[#2B2622] hover:bg-[#F5EFE4] border border-[#E2D6C1] transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={createSwapMutation.isPending}
              className="h-11 px-5 rounded-lg text-xs font-medium text-[#F5EFE4] bg-[#2E4A3B] hover:bg-[#1F3A2D] shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {createSwapMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Teklifi Gönder</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

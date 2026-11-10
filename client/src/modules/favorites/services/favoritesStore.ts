import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill, User } from '@/types/api';
import { toast } from 'sonner';

interface FavoritesState {
  savedSkills: Skill[];
  savedMentors: User[];
  toggleSkillFavorite: (skill: Skill) => void;
  isSkillFavorite: (skillId: string) => boolean;
  toggleMentorFavorite: (mentor: User) => void;
  isMentorFavorite: (mentorId: string) => boolean;
  removeSkillFavorite: (skillId: string) => void;
  removeMentorFavorite: (mentorId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      savedSkills: [],
      savedMentors: [],

      toggleSkillFavorite: (skill) => {
        const { savedSkills } = get();
        const exists = savedSkills.some((s) => s.id === skill.id);

        if (exists) {
          set({ savedSkills: savedSkills.filter((s) => s.id !== skill.id) });
          toast.info(`"${skill.name}" favorilerden çıkarıldı.`);
        } else {
          set({ savedSkills: [skill, ...savedSkills] });
          toast.success(`"${skill.name}" favorilere eklendi!`);
        }
      },

      isSkillFavorite: (skillId) => {
        return get().savedSkills.some((s) => s.id === skillId);
      },

      removeSkillFavorite: (skillId) => {
        set((state) => ({
          savedSkills: state.savedSkills.filter((s) => s.id !== skillId),
        }));
        toast.info('Yetenek favorilerden çıkarıldı.');
      },

      toggleMentorFavorite: (mentor) => {
        const { savedMentors } = get();
        const exists = savedMentors.some((m) => m.id === mentor.id);

        if (exists) {
          set({ savedMentors: savedMentors.filter((m) => m.id !== mentor.id) });
          toast.info(`"${mentor.fullName}" favorilerden çıkarıldı.`);
        } else {
          set({ savedMentors: [mentor, ...savedMentors] });
          toast.success(`"${mentor.fullName}" favorilere kaydedildi!`);
        }
      },

      isMentorFavorite: (mentorId) => {
        return get().savedMentors.some((m) => m.id === mentorId);
      },

      removeMentorFavorite: (mentorId) => {
        set((state) => ({
          savedMentors: state.savedMentors.filter((m) => m.id !== mentorId),
        }));
        toast.info('Mentor favorilerden çıkarıldı.');
      },
    }),
    {
      name: 'skillswap-favorites',
    }
  )
);

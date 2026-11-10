import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@/types/api';
import { Card } from '@/components/ui/Card';
import { Star, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface MentorCardProps {
  user: User;
  onInitiateSwap?: (user: User) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ user, onInitiateSwap }) => {
  const offeringSkills = user.skills?.filter((s) => s.type === 'OFFERING') || [];
  const seekingSkills = user.skills?.filter((s) => s.type === 'SEEKING') || [];

  return (
    <Card className="flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all duration-200 rounded-3xl p-6 bg-white border border-slate-200/80 group">
      <div>
        {/* Mentor Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-50 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <Link
                to={`/users/${user.id}`}
                className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
              >
                {user.fullName}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{user.rating > 0 ? user.rating.toFixed(1) : 'Yeni'}</span>
                </div>
                {user.totalReviews && user.totalReviews > 0 ? (
                  <span className="text-[11px] text-slate-400">({user.totalReviews} değerlendirme)</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-5 leading-relaxed font-normal">
          {user.bio || 'Henüz bir biyografi eklenmemiş.'}
        </p>

        {/* Öğretebileceği Yetenekler (OFFERING) */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Öğretebilecekleri</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {offeringSkills.length > 0 ? (
              offeringSkills.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  title={item.description || item.skill.name}
                >
                  {item.skill.name}
                  {item.proficiencyLevel && (
                    <span className="ml-1 text-[10px] text-emerald-600/80 font-normal">
                      • {item.proficiencyLevel === 'EXPERT' ? 'Uzman' : item.proficiencyLevel === 'ADVANCED' ? 'İleri' : 'Orta'}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Belirtilmemiş</span>
            )}
          </div>
        </div>

        {/* Öğrenmek İstedikleri (SEEKING) */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Öğrenmek İstedikleri</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seekingSkills.length > 0 ? (
              seekingSkills.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/60"
                >
                  {item.skill.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Belirtilmemiş</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/users/${user.id}`}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors inline-flex items-center"
        >
          <span>Profili İncele</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>

        {onInitiateSwap && (
          <button
            type="button"
            onClick={() => onInitiateSwap(user)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#5046e5] hover:bg-[#4338ca] shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Takas Teklif Et
          </button>
        )}
      </div>
    </Card>
  );
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/services/authStore';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import { useFavoritesStore } from '@/modules/favorites/services/favoritesStore';
import { ArrowLeftRight, LogOut, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();
  const { savedSkills, savedMentors } = useFavoritesStore();

  const isExplore = location.pathname === '/' || location.pathname === '/explore';
  const isSwaps = location.pathname === '/swaps' || location.pathname === '/dashboard';
  const isFavorites = location.pathname === '/favorites';
  const isProfile = location.pathname === '/profile';

  const totalFavorites = savedSkills.length + savedMentors.length;

  // Get user initials (e.g., Zeynep Yüksel -> ZY)
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2D6C1] bg-[#F5EFE4]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Sol: Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#2E4A3B] text-[#F5EFE4] flex items-center justify-center transition-transform group-hover:scale-105">
            <ArrowLeftRight className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#2E4A3B]">
            SkillSwap
          </span>
        </Link>

        {/* Orta: Menü Öğeleri */}
        <nav className="flex items-center gap-8 h-full">
          <Link
            to="/explore"
            className={`text-sm tracking-tight transition-colors relative flex items-center h-full ${
              isExplore
                ? 'font-semibold text-[#2B2622] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#A34A26]'
                : 'font-medium text-[#5E564D] hover:text-[#2B2622]'
            }`}
          >
            Keşfet
          </Link>

          <Link
            to="/favorites"
            className={`text-sm tracking-tight transition-colors relative flex items-center gap-1.5 h-full ${
              isFavorites
                ? 'font-semibold text-[#2B2622] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#A34A26]'
                : 'font-medium text-[#5E564D] hover:text-[#2B2622]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${totalFavorites > 0 ? 'fill-[#A34A26] text-[#A34A26]' : ''}`} />
            <span>Favorilerim</span>
            {totalFavorites > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#A34A26] text-[#F5EFE4] leading-tight">
                {totalFavorites}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/swaps"
                className={`text-sm tracking-tight transition-colors relative flex items-center h-full ${
                  isSwaps
                    ? 'font-semibold text-[#2B2622] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#A34A26]'
                    : 'font-medium text-[#5E564D] hover:text-[#2B2622]'
                }`}
              >
                Takaslarım
              </Link>

              <Link
                to="/profile"
                className={`text-sm tracking-tight transition-colors relative flex items-center h-full ${
                  isProfile
                    ? 'font-semibold text-[#2B2622] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#A34A26]'
                    : 'font-medium text-[#5E564D] hover:text-[#2B2622]'
                }`}
              >
                Profil
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm tracking-tight font-medium text-[#5E564D] hover:text-[#2B2622] transition-colors"
            >
              Nasıl Çalışır?
            </Link>
          )}
        </nav>

        {/* Sağ: Avatar veya Giriş/Kayıt */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full bg-[#2E4A3B] text-[#F5EFE4] font-semibold text-xs flex items-center justify-center transition-transform hover:scale-105"
                title={`${user.fullName} profili`}
              >
                {getInitials(user.fullName)}
              </Link>

              <button
                onClick={logout}
                className="p-2 text-[#5E564D] hover:text-rose-700 transition-colors cursor-pointer"
                title="Çıkış yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-[#2E4A3B] hover:text-[#1F3A2D] transition-colors"
              >
                Giriş yap
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-[#2E4A3B] text-[#F5EFE4] text-xs font-semibold hover:bg-[#1F3A2D] transition-colors"
              >
                Kayıt ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
